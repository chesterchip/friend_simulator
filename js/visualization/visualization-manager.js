/**
 * Visualization Manager for the Emotion Visualization App
 * Coordinates canvas rendering, animations, and text effects
 */

const VisualizationManager = (function() {
    // Animation and transition state
    let animationFrame = null;
    let needsUpdate = true;
    
    // History for undo/redo
    let stateHistory = [];
    let currentStateIndex = -1;
    const maxHistoryStates = 20;
    
// Settings from default config
let settings = {
    // Animation and visual settings
    animationSpeed: Config.defaultValues.animationSpeed,
    gradientMaxSize: Config.defaultValues.gradientMaxSize,
    gradientMinSize: Config.defaultValues.gradientMinSize,
    gradientFeatherSize: Config.defaultValues.gradientFeatherSize,
    gradientTiltH: Config.defaultValues.gradientTiltH,
    gradientTiltV: Config.defaultValues.gradientTiltV,
    fontSize: Config.defaultValues.fontSize,
    fontKerning: Config.defaultValues.fontKerning,
    lineHeight: Config.defaultValues.lineHeight,
    fontWeight: Config.defaultValues.fontWeight,
    fontStyle: Config.defaultValues.fontStyle,
    transitionSpeed: Config.defaultValues.transitionSpeed,
    backgroundTransitionSpeed: Config.defaultValues.backgroundTransitionSpeed,
    gradientColorTransitionSpeed: Config.defaultValues.gradientColorTransitionSpeed,
    textColorTransitionSpeed: Config.defaultValues.textColorTransitionSpeed,
    fontFamily: Config.defaultValues.fontFamily,
    
    // Layer settings
    textOpacity: Config.defaultValues.textOpacity,
    textBlendMode: Config.defaultValues.textBlendMode,
    gradientOpacity: Config.defaultValues.gradientOpacity,
    gradientBlendMode: Config.defaultValues.gradientBlendMode,
    backgroundOpacity: Config.defaultValues.backgroundOpacity,
    backgroundBlendMode: Config.defaultValues.backgroundBlendMode,
    
    // Distortion settings
    distortionEffect: Config.defaultValues.distortionEffect,
    distortionIntensity: Config.defaultValues.distortionIntensity,
    distortText: Config.defaultValues.distortText,
    distortGradient: Config.defaultValues.distortGradient,
    distortBackground: Config.defaultValues.distortBackground,
    
    // Layer visibility
    textLayerVisible: true,
    gradientLayerVisible: true,
    backgroundLayerVisible: true,
    distortionLayerVisible: true,
    
    // Advanced gradient (if defined in Config)
    advancedGradient: Config.defaultValues.advancedGradient || null
};

    // Layer thumbnails
    let layerThumbnails = {
        text: null,
        gradient: null,
        background: null
    };

    // DOM elements
    const displayCanvas = document.getElementById('display-canvas');
    const displayText = document.getElementById('display-text');
    
    /**
     * Initialize visualization
     */
    function init() {
        // Start the main render loop
        startRenderLoop();
        
        // Initialize text display
        TextEffects.init(displayText);
        
        // Start with default text
        TextEffects.startTypewriter("Enter an emotion to visualize");
        
        // Save initial state
        saveCurrentState();
    }
    
    /**
     * Start the main render loop
     */
    function startRenderLoop() {
        // Initial render
        updateDisplay();
        
        // Set up animation frame loop
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        animationFrame = requestAnimationFrame(renderLoop);
    }
    
    /**
     * Main render loop
     */
    function renderLoop() {
        // Only render if something changed
        if (needsUpdate) {
            updateDisplay();
            needsUpdate = false;
        }
        
        // Always update animation offset
        CanvasRenderer.updateAnimationOffset(settings.animationSpeed);
        
        // Check if we need to update again
        if (CanvasRenderer.isAnimating() || TextEffects.isAnimating()) {
            needsUpdate = true;
        }
        
        // Continue the loop
        animationFrame = requestAnimationFrame(renderLoop);
    }
    
    /**
     * Update the visualization display
     */
    function updateDisplay() {
        // Create temp canvas for background layer
        const backgroundCanvas = document.createElement('canvas');
        backgroundCanvas.width = displayCanvas.width;
        backgroundCanvas.height = displayCanvas.height;
        
        // Create temp canvas for complete scene
        const sceneCanvas = document.createElement('canvas');
        sceneCanvas.width = displayCanvas.width;
        sceneCanvas.height = displayCanvas.height;
        
        // Check if we should use advanced gradient settings
        const useAdvancedGradient = settings.advancedGradient && 
                                   settings.advancedGradient.type && 
                                   settings.advancedGradient.type !== 'none';
        
        if (useAdvancedGradient) {
            // Render with advanced gradient settings
            console.log("Using advanced gradient:", settings.advancedGradient.type);
            
            // Render the background with advanced gradient
            const ctx = sceneCanvas.getContext('2d');
            CanvasRenderer.renderAdvancedGradient(ctx, sceneCanvas.width, sceneCanvas.height, settings);
            
            // Copy to background canvas for layer preview
            const bgCtx = backgroundCanvas.getContext('2d');
            bgCtx.drawImage(sceneCanvas, 0, 0);
            
            // Extract thumbnails
            layerThumbnails.background = createThumbnail(backgroundCanvas);
            layerThumbnails.gradient = createGradientThumbnail(sceneCanvas, backgroundCanvas);
        } else {
            // Update canvas layers and get thumbnails
            layerThumbnails.background = CanvasRenderer.renderLayers(
                backgroundCanvas, 
                EmotionAnalyzer.getCurrentState(),
                {
                    ...settings,
                    gradientLayerVisible: false,
                    textLayerVisible: false
                }
            );
            
            // Render the full scene including gradient on the scene canvas
            CanvasRenderer.renderLayers(
                sceneCanvas, 
                EmotionAnalyzer.getCurrentState(),
                {
                    ...settings,
                    textLayerVisible: false
                }
            );
            
            // Extract gradient thumbnail by comparing scene with background
            layerThumbnails.gradient = createGradientThumbnail(sceneCanvas, backgroundCanvas);
        }
        
        // Render final scene to display canvas
        const ctx = displayCanvas.getContext('2d');
        ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
        ctx.drawImage(sceneCanvas, 0, 0);
        
        // Update text styles and animation
        TextEffects.updateTextStyles(settings);
        TextEffects.updateTextAnimation(EmotionAnalyzer.getCurrentState(), Config.emotions);
        
        // Create text thumbnail
        layerThumbnails.text = createTextThumbnail();
        
        // Apply distortion to text if enabled
        if (settings.distortionLayerVisible && 
            settings.distortionEffect !== 'none' && 
            settings.distortText) {
            applyTextDistortion();
        } else {
            // Remove any distortion effects
            displayText.style.filter = '';
            displayText.style.textShadow = '';
            displayText.style.backgroundImage = '';
            displayText.style.backgroundClip = '';
            displayText.style.webkitBackgroundClip = '';
            displayText.style.webkitTextFillColor = '';
            displayText.classList.remove('distortion-effect');
            
            // Reset animation-specific styles
            if (!displayText.classList.contains('big') &&
                !displayText.classList.contains('small') &&
                !displayText.classList.contains('shake') &&
                !displayText.classList.contains('nod') &&
                !displayText.classList.contains('pulse') &&
                !displayText.classList.contains('ripple') &&
                !displayText.classList.contains('bloom') &&
                !displayText.classList.contains('jitter')) {
                displayText.style.animation = '';
                displayText.style.transform = 'translate(-50%, -50%)';
            }
        }
        
        // Update layer thumbnails in the UI
        updateLayerThumbnailsUI();
    }
    
    /**
     * Create a gradient layer thumbnail
     * @param {HTMLCanvasElement} sceneCanvas - Canvas with all layers
     * @param {HTMLCanvasElement} backgroundCanvas - Canvas with only background
     * @returns {HTMLCanvasElement} Gradient thumbnail
     */
    function createGradientThumbnail(sceneCanvas, backgroundCanvas) {
        const thumbnailWidth = 44;  // Match the CSS width of layer-thumbnail
        const thumbnailHeight = 96; // Match the CSS height of layer-thumbnail
        
        const thumbnail = document.createElement('canvas');
        thumbnail.width = thumbnailWidth;
        thumbnail.height = thumbnailHeight;
        
        const thumbCtx = thumbnail.getContext('2d');
        
        // Draw scene first
        thumbCtx.drawImage(sceneCanvas, 0, 0, sceneCanvas.width, sceneCanvas.height, 
                           0, 0, thumbnailWidth, thumbnailHeight);
        
        // Apply a slight tint of the primary color
        const emotionState = EmotionAnalyzer.getCurrentState();
        const primaryColor = Config.emotions[emotionState.currentEmotion]?.bg || "#FF0000";
        
        thumbCtx.fillStyle = primaryColor;
        thumbCtx.globalAlpha = 0.3;
        thumbCtx.fillRect(0, 0, thumbnailWidth, thumbnailHeight);
        thumbCtx.globalAlpha = 1.0;
        
        return thumbnail;
    }
    
    /**
     * Create a text layer thumbnail
     * @returns {HTMLCanvasElement} Text thumbnail
     */
    function createTextThumbnail() {
        const thumbnailWidth = 44;  // Match the CSS width of layer-thumbnail
        const thumbnailHeight = 96; // Match the CSS height of layer-thumbnail
        
        const thumbnail = document.createElement('canvas');
        thumbnail.width = thumbnailWidth;
        thumbnail.height = thumbnailHeight;
        
        const thumbCtx = thumbnail.getContext('2d');
        
        // Use the text color from the current emotion
        const emotionState = EmotionAnalyzer.getCurrentState();
        const textColor = Config.emotions[emotionState.currentEmotion]?.text || "#FFFFFF";
        
        // Draw text symbol
        thumbCtx.fillStyle = textColor;
        thumbCtx.font = 'bold 24px sans-serif';
        thumbCtx.textAlign = 'center';
        thumbCtx.textBaseline = 'middle';
        thumbCtx.fillText('T', thumbnailWidth/2, thumbnailHeight/2);
        
        return thumbnail;
    }
    
    /**
     * Create a canvas thumbnail
     * @param {HTMLCanvasElement} canvas - Source canvas
     * @returns {HTMLCanvasElement} Thumbnail canvas
     */
    function createThumbnail(canvas) {
        const thumbnailWidth = 44;  // Match the CSS width of layer-thumbnail
        const thumbnailHeight = 96; // Match the CSS height of layer-thumbnail
        
        const thumbnail = document.createElement('canvas');
        thumbnail.width = thumbnailWidth;
        thumbnail.height = thumbnailHeight;
        
        const thumbCtx = thumbnail.getContext('2d');
        thumbCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, thumbnailWidth, thumbnailHeight);
        
        return thumbnail;
    }
    
    /**
     * Update layer thumbnails in the UI
     */
    function updateLayerThumbnailsUI() {
        // Update text layer thumbnail
        const textThumbnailContainer = document.getElementById('text-layer-thumbnail');
        if (textThumbnailContainer && layerThumbnails.text) {
            textThumbnailContainer.innerHTML = '';
            textThumbnailContainer.appendChild(layerThumbnails.text);
        }
        
        // Update gradient layer thumbnail
        const gradientThumbnailContainer = document.getElementById('gradient-layer-thumbnail');
        if (gradientThumbnailContainer && layerThumbnails.gradient) {
            gradientThumbnailContainer.innerHTML = '';
            gradientThumbnailContainer.appendChild(layerThumbnails.gradient);
        }
        
        // Update background layer thumbnail
        const backgroundThumbnailContainer = document.getElementById('background-layer-thumbnail');
        if (backgroundThumbnailContainer && layerThumbnails.background) {
            backgroundThumbnailContainer.innerHTML = '';
            backgroundThumbnailContainer.appendChild(layerThumbnails.background);
        }
    }
    
    /**
     * Apply distortion effects to text
     */
    function applyTextDistortion() {
        if (!displayText) return;
        
        // Add distortion class as marker
        displayText.classList.add('distortion-effect');
        
        // Reset any previous animations that might interfere
        displayText.style.animation = '';
        
        // Apply effect based on distortion type
        switch (settings.distortionEffect) {
            case 'blur':
                // Apply blur filter - scale based on intensity
                const blurAmount = (settings.distortionIntensity / 100) * 5; // 0-5px blur
                displayText.style.filter = `blur(${blurAmount}px)`;
                break;
                
            case 'noise':
            case 'filmGrain':
                // Add noise effect through CSS
                displayText.classList.add('text-noise');
                
                // Intensity controls the amount of noise
                displayText.style.setProperty('--noise-intensity', settings.distortionIntensity / 100);
                
                // Add filter for more visual effect
                const noiseContrastBoost = 1 + (settings.distortionIntensity / 200);
                displayText.style.filter = `contrast(${noiseContrastBoost}) brightness(1.05)`;
                
                // Add text shadow based on intensity
                const shadowSize = (settings.distortionIntensity / 100) * 2;
                displayText.style.textShadow = `
                    0 0 ${shadowSize}px rgba(255,255,255,0.7),
                    0 0 ${shadowSize * 0.5}px rgba(255,255,255,0.5)
                `;
                
                // Add noise animation
                displayText.style.animation = 'noise 0.05s infinite';
                break;
                
            case 'glitch':
                // Add glitch class
                displayText.classList.add('text-glitch');
                
                // Set glitch intensity
                displayText.style.setProperty('--glitch-intensity', settings.distortionIntensity / 50);
                
                // Glitch effect with RGB split and transformation
                const glitchAmount = Math.max(1, Math.floor((settings.distortionIntensity / 100) * 10));
                displayText.style.textShadow = `
                    ${glitchAmount}px 0 rgba(255,0,0,0.7),
                    -${glitchAmount}px 0 rgba(0,255,255,0.7)
                `;
                
                // Add stronger filter for more contrast
                displayText.style.filter = `contrast(1.5) brightness(1.1)`;
                
                // Add glitch animation
                displayText.style.animation = 'textGlitch 0.3s infinite';
                break;
                
            case 'pixelate':
                // Pixelate effect using text-shadow
                const pixelSize = Math.max(1, Math.floor((settings.distortionIntensity / 100) * 5));
                let pixelShadows = '';
                
                // Create a grid of text shadows to simulate pixelation
                for (let x = -pixelSize; x <= pixelSize; x += 2) {
                    for (let y = -pixelSize; y <= pixelSize; y += 2) {
                        if (x !== 0 || y !== 0) {
                            pixelShadows += `${x}px ${y}px 0 rgba(255,255,255,0.2),`;
                        }
                    }
                }
                
                // Remove trailing comma
                if (pixelShadows.endsWith(',')) {
                    pixelShadows = pixelShadows.slice(0, -1);
                }
                
                displayText.style.textShadow = pixelShadows;
                displayText.style.filter = `blur(${pixelSize/3}px) contrast(1.2)`;
                break;
                
            case 'warp':
                // Apply warp effect with perspective transform
                const warpIntensity = (settings.distortionIntensity / 100) * 20;
                displayText.style.transform = `translate(-50%, -50%) 
                                             perspective(500px) 
                                             rotateX(${warpIntensity/2}deg) 
                                             rotateY(${warpIntensity/2}deg)`;
                
                // Add blur for depth effect
                displayText.style.filter = `blur(${warpIntensity/20}px)`;
                break;
                
            case 'scanlines':
                // Apply scanlines class
                displayText.classList.add('text-scanlines');
                
                // Set up scanline background pattern
                const scanlineSize = Math.max(1, Math.floor((settings.distortionIntensity / 100) * 8));
                const scanlineOpacity = Math.min(0.8, (settings.distortionIntensity / 100) * 0.8);
                
                displayText.style.backgroundImage = `
                    repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, ${scanlineOpacity}),
                        rgba(0, 0, 0, ${scanlineOpacity}) 1px,
                        transparent 1px,
                        transparent ${scanlineSize}px
                    )
                `;
                
                displayText.style.backgroundSize = `100% ${scanlineSize}px`;
                displayText.style.animation = 'scanlines 2s linear infinite';
                displayText.style.filter = 'brightness(1.2) contrast(1.1)';
                break;
                
            default:
                // No effect or unknown effect
                displayText.style.filter = '';
                displayText.style.textShadow = '';
                displayText.style.backgroundImage = '';
                displayText.style.animation = '';
                displayText.style.transform = 'translate(-50%, -50%)';
                displayText.classList.remove('text-glitch', 'text-noise', 'text-scanlines');
                break;
        }
    }
    
/**
 * Process emotion analysis result
 * @param {Object} result - Emotion analysis result
 */
function processAnalysisResult(result) {
    if (result.emotionChanged) {
        // Start color transition
        const prevEmotions = Config.emotions[result.prevCurrentEmotion];
        const currEmotions = Config.emotions[result.currentEmotion];
        
        // Use separate transition speeds for gradient and text
        CanvasRenderer.startEmotionTransition(
            prevEmotions?.bg || "#9E9E9E",
            Config.emotions[result.prevSecondaryEmotion]?.bg || "#9E9E9E",
            currEmotions?.bg || "#FF0000",
            Config.emotions[result.secondaryEmotion]?.bg || "#0000FF",
            settings.gradientColorTransitionSpeed // Use the new setting for gradient colors
        );
        
        // Update text color with its own transition speed
        TextEffects.startColorTransition(
            prevEmotions?.text || "#000000",
            currEmotions?.text || "#000000",
            settings.textColorTransitionSpeed // Use the new setting for text color
        );
        
        // Update advanced gradient colors if linked to emotions
        updateGradientColorsFromEmotions(result.currentEmotion, result.secondaryEmotion);
        
        // Update spider diagram with new emotion scores
        if (EmotionUI.updateEmotionVisualization) {
            EmotionUI.updateEmotionVisualization(result.emotionScores);
        } else {
            // Dispatch event for spider diagram to update
            const event = new CustomEvent('emotionScoresUpdated', { detail: result.emotionScores });
            window.dispatchEvent(event);
        }
    }
    
    if (result.isButtonClick) {
        // Start typewriter animation when button is clicked
        TextEffects.startTypewriter(result.text || "");
    } else if (result.textChanged) {
        // Just update text without animation
        TextEffects.updateTextContent(result.text || "");
    }
    
    // Force update
    needsUpdate = true;
    
    // Save state for history
    saveCurrentState();
}
    
/**
 * Update gradient colors based on emotions if linked
 * @param {string} primaryEmotion - Primary emotion
 * @param {string} secondaryEmotion - Secondary emotion
 */
function updateGradientColorsFromEmotions(primaryEmotion, secondaryEmotion) {
    if (!settings.advancedGradient || !settings.advancedGradient.colors) return;
    
    // Get color source dropdowns
    const primarySourceDropdown = document.getElementById('gradient-color1-source');
    const secondarySourceDropdown = document.getElementById('gradient-color2-source');
    const bgSourceDropdown = document.getElementById('gradient-color-bg-source');
    
    // Get color boxes
    const primaryColorBox = document.getElementById('gradient-color1');
    const secondaryColorBox = document.getElementById('gradient-color2');
    const bgColorBox = document.getElementById('gradient-color-bg');
    
    // Store current colors for transition
    const currentColors = { ...settings.advancedGradient.colors };
    const newColors = { ...settings.advancedGradient.colors };
    
    // Determine new colors based on emotion settings
    
    // Update primary color if linked to emotion
    if (primarySourceDropdown && primarySourceDropdown.value === 'primary') {
        newColors.primary = Config.emotions[primaryEmotion]?.bg || "#FF0000";
    } else if (primarySourceDropdown && primarySourceDropdown.value === 'secondary') {
        newColors.primary = Config.emotions[secondaryEmotion]?.bg || "#0000FF";
    }
    
    // Update secondary color if linked to emotion
    if (secondarySourceDropdown && secondarySourceDropdown.value === 'primary') {
        newColors.secondary = Config.emotions[primaryEmotion]?.bg || "#FF0000";
    } else if (secondarySourceDropdown && secondarySourceDropdown.value === 'secondary') {
        newColors.secondary = Config.emotions[secondaryEmotion]?.bg || "#0000FF";
    }
    
    // Update background color if linked to emotion
    if (bgSourceDropdown && bgSourceDropdown.value === 'primary') {
        newColors.background = Config.emotions[primaryEmotion]?.bg || "#FF0000";
    } else if (bgSourceDropdown && bgSourceDropdown.value === 'secondary') {
        newColors.background = Config.emotions[secondaryEmotion]?.bg || "#0000FF";
    }
    
    // Check if any colors have changed
    const colorsChanged = (
        newColors.primary !== currentColors.primary || 
        newColors.secondary !== currentColors.secondary || 
        newColors.background !== currentColors.background
    );
    
    if (colorsChanged) {
        // Start a gradient color transition
        CanvasRenderer.startAdvGradientTransition(
            currentColors,
            newColors,
            settings.gradientColorTransitionSpeed
        );
        
        // Update UI color boxes (these will update visually with the animation)
        if (primaryColorBox) {
            primaryColorBox.style.backgroundColor = newColors.primary;
        }
        if (secondaryColorBox) {
            secondaryColorBox.style.backgroundColor = newColors.secondary;
        }
        if (bgColorBox) {
            bgColorBox.style.backgroundColor = newColors.background;
        }
        
        // Eventually, the settings object will be updated by the transition logic
        // when the transition is complete
    }
    
    // Force update
    needsUpdate = true;
}
    
    /**
     * Save current state to history
     */
    function saveCurrentState() {
        // Create a copy of the current settings
        const stateCopy = JSON.parse(JSON.stringify(settings));
        
        // Add text content to the state
        stateCopy.textContent = displayText ? displayText.textContent : "";
        
        // Add current emotion to the state
        const emotionState = EmotionAnalyzer.getCurrentState();
        stateCopy.currentEmotion = emotionState.currentEmotion;
        stateCopy.secondaryEmotion = emotionState.secondaryEmotion;
        
        // If we're not at the end of the history, truncate the future states
        if (currentStateIndex < stateHistory.length - 1) {
            stateHistory = stateHistory.slice(0, currentStateIndex + 1);
        }
        
        // Add new state to history
        stateHistory.push(stateCopy);
        currentStateIndex = stateHistory.length - 1;
        
        // Limit history size
        if (stateHistory.length > maxHistoryStates) {
            stateHistory.shift();
            currentStateIndex--;
        }
        
        // Update navigation buttons state
        if (UIManager && UIManager.updateHistoryButtonsState) {
            UIManager.updateHistoryButtonsState();
        }
    }
    
    /**
     * Go back in history (undo)
     */
    function goBack() {
        if (currentStateIndex > 0) {
            currentStateIndex--;
            applyHistoryState(stateHistory[currentStateIndex]);
            return true;
        }
        return false;
    }
    
    /**
     * Go forward in history (redo)
     */
    function goForward() {
        if (currentStateIndex < stateHistory.length - 1) {
            currentStateIndex++;
            applyHistoryState(stateHistory[currentStateIndex]);
            return true;
        }
        return false;
    }

    /**
     * Check if we can go back in history
     * @returns {boolean} True if there are history states to go back to
     */
    function canGoBack() {
        return currentStateIndex > 0;
    }

    /**
     * Check if we can go forward in history
     * @returns {boolean} True if there are history states to go forward to
     */
    function canGoForward() {
        return currentStateIndex < stateHistory.length - 1;
    }
    
    /**
     * Apply a state from history
     * @param {Object} state - State to apply
     */
    function applyHistoryState(state) {
        // Apply settings from state
        Object.keys(settings).forEach(key => {
            if (key in state) {
                settings[key] = state[key];
            }
        });
        
        // Update text content if needed
        if (state.textContent && displayText) {
            TextEffects.updateTextContent(state.textContent);
        }
        
        // Update UI to reflect the state
        UIManager.updateUIFromConfig(settings);
        
        // Force update
        needsUpdate = true;
    }
    
    /**
     * Update a setting value and save to history
     * @param {string} name - Setting name
     * @param {*} value - Setting value
     */
    function updateSettingWithHistory(name, value) {
        if (name in settings && settings[name] !== value) {
            settings[name] = value;
            needsUpdate = true;
            saveCurrentState(); // Save to history
        }
    }

    /**
     * Update a setting value without saving to history
     * Useful for slider dragging without creating multiple history entries
     * @param {string} name - Setting name
     * @param {*} value - Setting value
     */
    function updateSettingWithoutHistory(name, value) {
        if (name in settings) {
            settings[name] = value;
            needsUpdate = true;
        }
    }
    
    /**
     * Update a setting value - backwards compatibility
     * @param {string} name - Setting name
     * @param {*} value - Setting value
     */
    function updateSetting(name, value) {
        updateSettingWithHistory(name, value);
    }
    
    /**
     * Reset a specific control to default
     * @param {string} name - Control name
     */
    function resetControl(name) {
        if (name in Config.defaultValues) {
            updateSettingWithHistory(name, Config.defaultValues[name]);
            
            // Update UI for this control
            SliderControls.updateSliderUI(name, Config.defaultValues[name]);
        }
    }
    
    /**
     * Update layer visibility
     * @param {string} layer - Layer name
     * @param {boolean} visible - Visibility state
     */
    function updateLayerVisibility(layer, visible) {
        const visibilityKey = `${layer}LayerVisible`;
        
        if (visibilityKey in settings) {
            // Only save state if the value actually changed
            const valueChanged = settings[visibilityKey] !== visible;
            
            settings[visibilityKey] = visible;
            
            // Update text visibility immediately
            if (layer === 'text') {
                displayText.style.visibility = visible ? 'visible' : 'hidden';
            }
            
            // If distortion is toggled off, remove text effects
            if (layer === 'distortion' && !visible) {
                displayText.style.filter = '';
                displayText.style.textShadow = '';
                displayText.style.backgroundImage = '';
                displayText.style.backgroundClip = '';
                displayText.style.webkitBackgroundClip = '';
                displayText.style.webkitTextFillColor = '';
                displayText.style.transform = 'translate(-50%, -50%)';
                displayText.classList.remove('distortion-effect');
                displayText.classList.remove('text-glitch', 'text-noise', 'text-scanlines');
                }
            
            needsUpdate = true;
            
            // Save state to history if the value changed
            if (valueChanged) {
                saveCurrentState();
            }
        }
    }
    
    /**
     * Get current settings
     * @returns {Object} Current settings
     */
    function getCurrentSettings() {
        return { ...settings };
    }
    
    /**
     * Apply loaded settings
     * @param {Object} config - Loaded configuration
     */
    function applySettings(config) {
        // Apply each setting if it exists in the config
        Object.keys(settings).forEach(key => {
            if (key in config) {
                settings[key] = config[key];
            }
        });
        
        // Special handling for advanced gradient if present
        if (config.advancedGradient) {
            settings.advancedGradient = { ...config.advancedGradient };
        }
        
        // Force update
        needsUpdate = true;
        
        // Save state to history
        saveCurrentState();
    }
    
    // Public API
    return {
        init,
        updateDisplay,
        processAnalysisResult,
        updateSetting,
        updateSettingWithHistory,
        updateSettingWithoutHistory,
        updateLayerVisibility,
        getCurrentSettings,
        applySettings,
        goBack,
        goForward,
        canGoBack,
        canGoForward,
        resetControl,
        updateGradientColorsFromEmotions,
        settings // Expose settings object for direct access
    };
})();

// Export for use in other modules
window.VisualizationManager = VisualizationManager;