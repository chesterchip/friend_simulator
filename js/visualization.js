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
 * @param {string} layer - Layer name (text, gradient, background)
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
    }
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
