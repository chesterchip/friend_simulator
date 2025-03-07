/**
 * Visualization module for the Emotion Visualization App
 * Handles canvas drawing, animation, and text effects
 */

// Animation variables
let animationFrame = null;
let animationOffset = 0;

// Transition animation variables
let isTransitioning = false;
let transitionStartTime = 0;
let transitionDuration = defaultValues.defaultTransitionDuration;
let previousPrimaryColor = emotions.neutral.bg;
let previousSecondaryColor = emotions.neutral.bg;
let targetPrimaryColor = emotions.neutral.bg;
let targetSecondaryColor = emotions.neutral.bg;
let previousTextColor = emotions.neutral.text;
let targetTextColor = emotions.neutral.text;

// Typewriter animation variables
let typewriterText = "";
let typewriterTargetText = "Enter an emotion to visualize";
let typewriterIndex = 0;
let typewriterInterval = null;

// Animation and slider values
let animationSpeed = defaultValues.animationSpeed;
let gradientMaxSize = defaultValues.gradientMaxSize;
let gradientMinSize = defaultValues.gradientMinSize;
let gradientFeatherSize = defaultValues.gradientFeatherSize;
let fontSize = defaultValues.fontSize;
let fontKerning = defaultValues.fontKerning;
let lineHeight = defaultValues.lineHeight;
let fontWeight = defaultValues.fontWeight;
let fontStyle = defaultValues.fontStyle; // Font style (normal, bold, italic, etc.)
let transitionSpeed = defaultValues.transitionSpeed;
let backgroundTransitionSpeed = defaultValues.backgroundTransitionSpeed;
let fontFamily = defaultValues.fontFamily;

// Layer settings
let textOpacity = defaultValues.textOpacity;
let textBlendMode = defaultValues.textBlendMode;
let gradientOpacity = defaultValues.gradientOpacity;
let gradientBlendMode = defaultValues.gradientBlendMode;
let backgroundOpacity = defaultValues.backgroundOpacity;
let backgroundBlendMode = defaultValues.backgroundBlendMode;

// Distortion settings
let distortionLayerVisible = true;
let distortionEffect = defaultValues.distortionEffect;
let distortionIntensity = defaultValues.distortionIntensity;
let distortionAnimationFrame = null;
let distortionOffset = 0;

// Layer visibility settings
let textLayerVisible = true;
let gradientLayerVisible = true;
let backgroundLayerVisible = true;

// DOM elements
const displayCanvas = document.getElementById('display-canvas');
const displayText = document.getElementById('display-text');

/**
 * Start the visualization
 */
function startVisualization() {
    updateDisplay();
    startTypewriter("Enter an emotion to visualize");
}

/**
 * Update the visualization display
 */
function updateDisplay() {
    const ctx = displayCanvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    
    // Get canvas dimensions
    const width = displayCanvas.width;
    const height = displayCanvas.height;
    
    // Calculate current colors based on transition
    let primaryColor, secondaryColor, textColor;
    
    if (isTransitioning) {
        // Calculate how far we are through the transition (0 to 1)
        const now = Date.now();
        const elapsed = now - transitionStartTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        
        // Interpolate between colors
        primaryColor = interpolateColor(previousPrimaryColor, targetPrimaryColor, progress);
        secondaryColor = interpolateColor(previousSecondaryColor, targetSecondaryColor, progress);
        textColor = interpolateColor(previousTextColor, targetTextColor, progress);
        
        // Check if transition is complete
        if (progress >= 1) {
            isTransitioning = false;
            previousPrimaryColor = targetPrimaryColor;
            previousSecondaryColor = targetSecondaryColor;
            previousTextColor = targetTextColor;
        }
    } else {
        // Use current emotion colors
        const emotionState = getCurrentEmotionState();
        primaryColor = emotions[emotionState.currentEmotion]?.bg || "#FF0000";
        secondaryColor = emotions[emotionState.secondaryEmotion]?.bg || "#0000FF";
        textColor = emotions[emotionState.currentEmotion]?.text || "#000000";
    }
    
    // Create a darker version of the secondary color for the background
    const darkerSecondary = shadeColor(secondaryColor, -30); // 30% darker
    
    // Apply background layer with opacity and blend mode (if visible)
    if (backgroundLayerVisible) {
        ctx.globalCompositeOperation = "source-over"; // Reset to default
        ctx.globalAlpha = backgroundOpacity / 100;
        ctx.fillStyle = darkerSecondary;
        ctx.fillRect(0, 0, width, height);
    }
    
    // Apply gradient layer (if visible)
    if (gradientLayerVisible) {
        // Set blend mode for gradient layer
        ctx.globalCompositeOperation = gradientBlendMode;
        
        // Calculate gradient position based on animation
        const gradientCenterX = width/2 + Math.sin(animationOffset) * (width/4);
        const gradientCenterY = height/2 + Math.cos(animationOffset) * (height/4);
        
        // Apply gradient layer with opacity
        ctx.globalAlpha = gradientOpacity / 100;
        
        // Create smaller gradient overlay
        const minGradientSize = 50;
        const maxGradientSize = 1000;
        const gradientSizeRange = maxGradientSize - minGradientSize;
        const gradientSize = minGradientSize + (gradientSizeRange * (gradientMaxSize / 100));
        
        const gradient = ctx.createRadialGradient(
            gradientCenterX, gradientCenterY, gradientMinSize * 2,
            gradientCenterX, gradientCenterY, gradientSize
        );
        
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(gradientFeatherSize / 100, primaryColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Transparent at the edge
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    // Apply distortion effects if visible
    if (distortionLayerVisible && distortionEffect !== 'none') {
        applyDistortionEffect(ctx, width, height);
    }
    
    // Reset opacity for future drawing operations
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
    
    // Update text layer (visibility is handled by CSS)
    if (textLayerVisible) {
        // Update text style with transitioning text color and opacity
        displayText.style.color = textColor;
        displayText.style.opacity = textOpacity / 100;
        displayText.style.mixBlendMode = textBlendMode;
        displayText.style.visibility = 'visible';
    } else {
        displayText.style.visibility = 'hidden';
    }
    
    // Apply slider values to visual elements
    updateTextStyles();
    
    // Update text animation
    updateTextAnimation();
    
    // Update animation offset for next frame
    // Animation speed: lower values = faster animation (reversed)
    const animationFactor = 0.005 * ((animationSpeed + 1) / 50 + 0.5);
    animationOffset += animationFactor;
    
    // Request next animation frame
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(updateDisplay);
}

/**
 * Apply selected distortion effect to the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyDistortionEffect(ctx, width, height) {
    // Get the current canvas image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Apply different effects based on selection
    switch (distortionEffect) {
        case 'filmGrain':
            applyFilmGrain(data, width, height);
            break;
        case 'noise':
            applyNoise(data, width, height);
            break;
        case 'scanlines':
            applyScanlines(data, width, height);
            break;
        case 'glitch':
            applyGlitch(ctx, data, width, height);
            break;
        case 'blur':
            applyBlur(data, width, height);
            break;
        case 'warp':
            applyWarp(data, width, height);
            break;
        case 'pixelate':
            applyPixelate(ctx, width, height);
            return; // Pixelate applies directly to canvas, no need to put image data back
    }
    
    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply film grain effect
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyFilmGrain(data, width, height) {
    const intensity = distortionIntensity / 100 * 50; // Scale to reasonable value
    
    for (let i = 0; i < data.length; i += 4) {
        // Generate random noise value between -intensity and +intensity
        const noise = (Math.random() - 0.5) * intensity * 2;
        
        // Apply to RGB channels
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        // Don't modify alpha channel
    }
}

/**
 * Apply noise effect (colored noise)
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyNoise(data, width, height) {
    const intensity = distortionIntensity / 100 * 70; // Scale to reasonable value
    
    for (let i = 0; i < data.length; i += 4) {
        // Generate random noise values for each channel
        const noiseR = (Math.random() - 0.5) * intensity * 2;
        const noiseG = (Math.random() - 0.5) * intensity * 2;
        const noiseB = (Math.random() - 0.5) * intensity * 2;
        
        // Apply to RGB channels
        data[i] = Math.min(255, Math.max(0, data[i] + noiseR));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noiseG));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noiseB));
    }
}

/**
 * Apply scanlines effect
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyScanlines(data, width, height) {
    const intensity = distortionIntensity / 100 * 0.7; // Scale to reasonable value
    const scanlineWidth = 2; // Width of each scanline
    
    for (let y = 0; y < height; y++) {
        // Determine if this row is a scanline
        if (y % (scanlineWidth * 2) < scanlineWidth) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                // Darken pixels in scanline rows
                data[i] = data[i] * (1 - intensity);
                data[i + 1] = data[i + 1] * (1 - intensity);
                data[i + 2] = data[i + 2] * (1 - intensity);
            }
        }
    }
}

/**
 * Apply glitch effect
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyGlitch(ctx, data, width, height) {
    const intensity = distortionIntensity / 100;
    
    // Number of glitch slices depends on intensity
    const numSlices = Math.floor(intensity * 20) + 1;
    
    // Occasionally add color channel shift
    if (Math.random() < intensity * 0.8) {
        const channelShift = Math.floor(intensity * 10) + 1;
        
        for (let i = 0; i < data.length; i += 4) {
            // Shift red channel left or right
            const sourceI = i + (Math.random() > 0.5 ? channelShift * 4 : -channelShift * 4);
            if (sourceI >= 0 && sourceI < data.length) {
                data[i] = data[sourceI];
            }
        }
    }
    
    // Create horizontal glitch slices
    for (let i = 0; i < numSlices; i++) {
        const y = Math.floor(Math.random() * height);
        const sliceHeight = Math.floor(Math.random() * 20) + 5;
        const shiftX = Math.floor((Math.random() - 0.5) * width * intensity * 0.5);
        
        // Only create slices sometimes, based on intensity
        if (Math.random() < intensity) {
            // Get slice image data
            const sliceData = ctx.getImageData(0, y, width, sliceHeight);
            
            // Clear the slice area
            ctx.clearRect(0, y, width, sliceHeight);
            
            // Draw the slice data shifted
            ctx.putImageData(sliceData, shiftX, y);
        }
    }
}

/**
 * Apply blur effect
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyBlur(data, width, height) {
    // Box blur implementation - simplified for performance
    const intensity = Math.floor(distortionIntensity / 100 * 10) + 1;
    const kernel = intensity;
    const tempData = new Uint8ClampedArray(data.length);
    
    // Copy original data
    for (let i = 0; i < data.length; i++) {
        tempData[i] = data[i];
    }
    
    // Approximated box blur by sampling nearby pixels
    for (let y = kernel; y < height - kernel; y++) {
        for (let x = kernel; x < width - kernel; x++) {
            const idx = (y * width + x) * 4;
            
            let r = 0, g = 0, b = 0, a = 0, count = 0;
            
            // Sample a window of pixels
            for (let ky = -kernel; ky <= kernel; ky += kernel) {
                for (let kx = -kernel; kx <= kernel; kx += kernel) {
                    const sampleIdx = ((y + ky) * width + (x + kx)) * 4;
                    r += tempData[sampleIdx];
                    g += tempData[sampleIdx + 1];
                    b += tempData[sampleIdx + 2];
                    a += tempData[sampleIdx + 3];
                    count++;
                }
            }
            
            // Set pixel to average value
            data[idx] = r / count;
            data[idx + 1] = g / count;
            data[idx + 2] = b / count;
            data[idx + 3] = a / count;
        }
    }
}

/**
 * Apply warp effect (wavy distortion)
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyWarp(data, width, height) {
    const intensity = distortionIntensity / 100 * 20;
    const tempData = new Uint8ClampedArray(data.length);
    
    // Copy original data
    for (let i = 0; i < data.length; i++) {
        tempData[i] = data[i];
    }
    
    // Get time-based animation value
    const time = Date.now() / 1000;
    
    // Apply wave distortion
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Calculate wave distortion
            const distortX = Math.sin(y * 0.05 + time * 2) * intensity;
            const distortY = Math.cos(x * 0.05 + time * 2) * intensity;
            
            // Get source coordinates
            const sourceX = Math.floor(x + distortX);
            const sourceY = Math.floor(y + distortY);
            
            // Check if source is within bounds
            if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
                const destIdx = (y * width + x) * 4;
                const sourceIdx = (sourceY * width + sourceX) * 4;
                
                // Copy source pixel to destination
                data[destIdx] = tempData[sourceIdx];
                data[destIdx + 1] = tempData[sourceIdx + 1];
                data[destIdx + 2] = tempData[sourceIdx + 2];
                data[destIdx + 3] = tempData[sourceIdx + 3];
            }
        }
    }
}

/**
 * Apply pixelate effect
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function applyPixelate(ctx, width, height) {
    // Calculate pixel size based on intensity
    const pixelSize = Math.max(2, Math.floor(distortionIntensity / 100 * 20));
    
    // Get current canvas content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(displayCanvas, 0, 0);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw pixelated version
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            // Limit dimensions to prevent going out of bounds
            const pixelWidth = Math.min(pixelSize, width - x);
            const pixelHeight = Math.min(pixelSize, height - y);
            
            // Get the color of the first pixel in this block
            const pixelData = tempCtx.getImageData(x, y, 1, 1).data;
            
            // Draw a rectangle with that color
            ctx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
            ctx.fillRect(x, y, pixelWidth, pixelHeight);
        }
    }
}

/**
 * Update text styles based on slider values
 */
function updateTextStyles() {
    // Font size ranges from 16px to 72px based on slider value
    displayText.style.fontSize = Math.max(16 + (fontSize / 100) * 56, 16) + 'px';
    
    // Letter spacing ranges from -2px to 10px
    displayText.style.letterSpacing = ((fontKerning - 50) / 10) + 'px';
    
    // Line height ranges from 1 to 2
    displayText.style.lineHeight = (1 + (lineHeight / 100)).toString();
    
    // Apply font style (normal, bold, italic, underline, bold-italic)
    switch(fontStyle) {
        case 'normal':
            displayText.style.fontWeight = 300 + (fontWeight * 6);
            displayText.style.fontStyle = 'normal';
            displayText.style.textDecoration = 'none';
            break;
        case 'bold':
            displayText.style.fontWeight = 700;
            displayText.style.fontStyle = 'normal';
            displayText.style.textDecoration = 'none';
            break;
        case 'italic':
            displayText.style.fontWeight = 300 + (fontWeight * 6);
            displayText.style.fontStyle = 'italic';
            displayText.style.textDecoration = 'none';
            break;
        case 'underline':
            displayText.style.fontWeight = 300 + (fontWeight * 6);
            displayText.style.fontStyle = 'normal';
            displayText.style.textDecoration = 'underline';
            break;
        case 'bold-italic':
            displayText.style.fontWeight = 700;
            displayText.style.fontStyle = 'italic';
            displayText.style.textDecoration = 'none';
            break;
        default:
            // Default to normal
            displayText.style.fontWeight = 300 + (fontWeight * 6);
            displayText.style.fontStyle = 'normal';
            displayText.style.textDecoration = 'none';
    }
    
    // Apply font family based on selection
    displayText.classList.remove('rounded-font');
    displayText.classList.remove('standard-font');
    
    // Special handling for SF Pro and SF Pro Rounded
    if (fontFamily === "SF Pro Rounded") {
        displayText.style.fontFamily = '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, "SF Pro", "Helvetica Neue", Arial, sans-serif';
        displayText.classList.add('rounded-font');
    } else if (fontFamily === "SF Pro") {
        displayText.style.fontFamily = '"SF Pro", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
        displayText.classList.add('standard-font');
    } else {
        // For all other fonts, just apply the font family directly
        displayText.style.fontFamily = `"${fontFamily}", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
    }
}

/**
 * Update text animation based on current emotion
 */
function updateTextAnimation() {
    const emotionState = getCurrentEmotionState();
    const currentEmotion = emotionState.currentEmotion;
    displayText.className = 'display-text';
    
    // Preserve font classes
    if (fontFamily === "SF Pro Rounded") {
        displayText.classList.add('rounded-font');
    } else if (fontFamily === "SF Pro") {
        displayText.classList.add('standard-font');
    }
    
    const animation = emotions[currentEmotion]?.animation || 'none';
    const intensity = emotions[currentEmotion]?.intensity || 50;
    const duration = emotions[currentEmotion]?.duration || 100;
    
    if (animation !== 'none') {
        displayText.classList.add(animation);
        
        // Apply intensity using CSS custom properties
        displayText.style.setProperty('--animation-intensity', intensity / 50);
        
        // Apply duration - if 100, it's infinite, otherwise use the value in seconds
        if (duration >= 100) {
            displayText.style.animationIterationCount = 'infinite';
        } else {
            displayText.style.animationDuration = `${duration / 10}s`;
            displayText.style.animationIterationCount = '1';
            displayText.style.animationFillMode = 'forwards';
        }
    }
}

/**
 * Update layer visibility
 * @param {string} layer - Layer name (text, gradient, background, distortion)
 * @param {boolean} visible - Visibility state
 */
function updateLayerVisibility(layer, visible) {
    switch(layer) {
        case 'text':
            textLayerVisible = visible;
            displayText.style.visibility = visible ? 'visible' : 'hidden';
            break;
        case 'gradient':
            gradientLayerVisible = visible;
            break;
        case 'background':
            backgroundLayerVisible = visible;
            break;
        case 'distortion':
            distortionLayerVisible = visible;
            break;
    }
    
    // Update display
    updateDisplay();
}

/**
 * Update animation intensity for a specific emotion
 * @param {string} emotion - The emotion to update
 */
function updateAnimationIntensity(emotion) {
    const emotionState = getCurrentEmotionState();
    if (emotionState.currentEmotion === emotion) {
        updateTextAnimation();
    }
}

/**
 * Update animation duration for a specific emotion
 * @param {string} emotion - The emotion to update
 */
function updateAnimationDuration(emotion) {
    const emotionState = getCurrentEmotionState();
    if (emotionState.currentEmotion === emotion) {
        updateTextAnimation();
    }
}

/**
 * Start emotion transition animation
 * @param {string} fromPrimary - Starting primary color
 * @param {string} fromSecondary - Starting secondary color
 * @param {string} toPrimary - Target primary color
 * @param {string} toSecondary - Target secondary color
 * @param {string} prevEmotion - Previous emotion name
 * @param {string} currentEmo - Current emotion name
 */
function startEmotionTransition(fromPrimary, fromSecondary, toPrimary, toSecondary, prevEmotion, currentEmo) {
    previousPrimaryColor = fromPrimary;
    previousSecondaryColor = fromSecondary;
    targetPrimaryColor = toPrimary;
    targetSecondaryColor = toSecondary;
    
    // Add text color transition
    previousTextColor = emotions[prevEmotion]?.text || "#000000";
    targetTextColor = emotions[currentEmo]?.text || "#000000";
    
    // Set transition duration directly from the slider value
    transitionDuration = backgroundTransitionSpeed;
    transitionStartTime = Date.now();
    isTransitioning = true;
}

/**
 * Start typewriter animation for text
 * @param {string} targetText - The text to type out
 */
function startTypewriter(targetText) {
    // Clear any existing animation
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
    }
    
    // Reset variables
    typewriterTargetText = targetText;
    typewriterText = "";
    typewriterIndex = 0;
    
    // Initialize with empty text and cursor
    displayText.innerHTML = '<span class="typing-cursor"></span>';
    
    // Calculate typing speed based on transition speed (50-500ms)
    // Adjusted to make 50 behave like the old 100
    const typingSpeed = Math.max(50, 500 - transitionSpeed * 10);
    
    // Start the animation with static placement
    typewriterInterval = setInterval(() => {
        if (typewriterIndex < typewriterTargetText.length) {
            typewriterText += typewriterTargetText[typewriterIndex];
            displayText.innerHTML = typewriterText + '<span class="typing-cursor"></span>';
            typewriterIndex++;
        } else {
            // Animation complete
            clearInterval(typewriterInterval);
            typewriterInterval = null;
        }
    }, typingSpeed);
}

/**
 * Update text display without animation
 * @param {string} text - Text to display
 */
function updateTextDisplay(text) {
    if (displayText.textContent !== text && !typewriterInterval) {
        // Only update text directly if not in the middle of a typewriter animation
        displayText.innerHTML = text + '<span class="typing-cursor"></span>';
    }
}

/**
 * Update animation slider values
 * @param {string} name - Slider name
 * @param {number} value - Slider value
 */
function updateSliderValue(name, value) {
    switch (name) {
        case 'animationSpeed':
            animationSpeed = value;
            break;
        case 'gradientMaxSize':
            gradientMaxSize = value;
            break;
        case 'gradientMinSize':
            gradientMinSize = value;
            break;
        case 'gradientFeatherSize':
            gradientFeatherSize = value;
            break;
        case 'fontSize':
            fontSize = value;
            break;
        case 'fontKerning':
            fontKerning = value;
            break;
        case 'fontWeight':
            fontWeight = value;
            break;
        case 'lineHeight':
            lineHeight = value;
            break;
        case 'fontStyle':
            fontStyle = value;
            updateTextStyles();
            break;
        case 'transitionSpeed':
            transitionSpeed = value;
            // If we're currently typing, adjust the typing speed
            if (typewriterInterval) {
                clearInterval(typewriterInterval);
                startTypewriter(typewriterTargetText);
            }
            break;
        case 'backgroundTransitionSpeed':
            backgroundTransitionSpeed = value;
            break;
        case 'fontFamily':
            fontFamily = value;
            updateTextStyles(); // Immediately update font family
            break;
        case 'textOpacity':
            textOpacity = value;
            break;
        case 'textBlendMode':
            textBlendMode = value;
            break;
        case 'gradientOpacity':
            gradientOpacity = value;
            break;
        case 'gradientBlendMode':
            gradientBlendMode = value;
            break;
        case 'backgroundOpacity':
            backgroundOpacity = value;
            break;
        case 'backgroundBlendMode':
            backgroundBlendMode = value;
            break;
        case 'distortionEffect':
            distortionEffect = value;
            break;
        case 'distortionIntensity':
            distortionIntensity = value;
            break;
    }
}

/**
 * Update distortion effect
 * @param {string} effect - Selected distortion effect
 */
function updateDistortionEffect(effect) {
    distortionEffect = effect;
    updateDisplay();
}

/**
 * Update distortion intensity
 * @param {number} intensity - Distortion intensity value
 */
function updateDistortionIntensity(intensity) {
    distortionIntensity = intensity;
    updateDisplay();
}

// Export functions to global scope for accessibility across modules
window.startVisualization = startVisualization;
window.updateDisplay = updateDisplay;
window.startEmotionTransition = startEmotionTransition;
window.startTypewriter = startTypewriter;
window.updateTextDisplay = updateTextDisplay;
window.updateSliderValue = updateSliderValue;
window.updateAnimationIntensity = updateAnimationIntensity;
window.updateAnimationDuration = updateAnimationDuration;
window.updateLayerVisibility = updateLayerVisibility;
window.updateDistortionEffect = updateDistortionEffect;
window.updateDistortionIntensity = updateDistortionIntensity;
