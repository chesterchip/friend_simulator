/**
 * Text Effects module for the Emotion Visualization App
 * Handles text styling, animations, and typewriter effects
 */

const TextEffects = (function() {
    // Text element reference
    let displayText = null;
    
    // Typewriter animation variables
    let typewriterText = "";
    let typewriterTargetText = "Enter an emotion to visualize";
    let typewriterIndex = 0;
    let typewriterInterval = null;

    // Text color transition variables
    let isColorTransitioning = false;
    let colorTransitionStartTime = 0;
    let colorTransitionDuration = Config.defaultValues.defaultTransitionDuration;
    let previousTextColor = Config.emotions.neutral.text;
    let targetTextColor = Config.emotions.neutral.text;
    
    /**
     * Initialize text effects
     * @param {HTMLElement} element - The text display element
     */
    function init(element) {
        displayText = element;
    }
    
    /**
     * Update text styles based on settings
     * @param {Object} settings - Current settings
     */
    function updateTextStyles(settings) {
        if (!displayText) return;
        
        // Font size ranges from 16px to 72px based on slider value
        displayText.style.fontSize = Math.max(16 + (settings.fontSize / 100) * 56, 16) + 'px';
        
        // Letter spacing ranges from -2px to 10px
        displayText.style.letterSpacing = ((settings.fontKerning - 50) / 10) + 'px';
        
        // Line height ranges from 1 to 2
        displayText.style.lineHeight = (1 + (settings.lineHeight / 100)).toString();
        
        // Apply font style (normal, bold, italic, underline, bold-italic)
        switch(settings.fontStyle) {
            case 'normal':
                displayText.style.fontWeight = 300 + (settings.fontWeight * 6);
                displayText.style.fontStyle = 'normal';
                displayText.style.textDecoration = 'none';
                break;
            case 'bold':
                displayText.style.fontWeight = 700;
                displayText.style.fontStyle = 'normal';
                displayText.style.textDecoration = 'none';
                break;
            case 'italic':
                displayText.style.fontWeight = 300 + (settings.fontWeight * 6);
                displayText.style.fontStyle = 'italic';
                displayText.style.textDecoration = 'none';
                break;
            case 'underline':
                displayText.style.fontWeight = 300 + (settings.fontWeight * 6);
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
                displayText.style.fontWeight = 300 + (settings.fontWeight * 6);
                displayText.style.fontStyle = 'normal';
                displayText.style.textDecoration = 'none';
        }
        
        // Apply font family based on selection
        displayText.classList.remove('rounded-font');
        displayText.classList.remove('standard-font');
        
        // Special handling for SF Pro and SF Pro Rounded
        if (settings.fontFamily === "SF Pro Rounded") {
            displayText.style.fontFamily = '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, "SF Pro", "Helvetica Neue", Arial, sans-serif';
            displayText.classList.add('rounded-font');
        } else if (settings.fontFamily === "SF Pro") {
            displayText.style.fontFamily = '"SF Pro", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
            displayText.classList.add('standard-font');
        } else {
            // For all other fonts, just apply the font family directly
            displayText.style.fontFamily = `"${settings.fontFamily}", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
        }
        
        // Apply text layer settings
        displayText.style.opacity = settings.textOpacity / 100;
        displayText.style.mixBlendMode = settings.textBlendMode;
        displayText.style.visibility = settings.textLayerVisible ? 'visible' : 'hidden';
        
        // Apply text color based on transition state
        updateTextColor();
    }
    
    /**
     * Update text color based on transition state
     */
    function updateTextColor() {
        if (!displayText) return;
        
        if (isColorTransitioning) {
            // Calculate how far we are through the transition (0 to 1)
            const now = Date.now();
            const elapsed = now - colorTransitionStartTime;
            const progress = Math.min(elapsed / colorTransitionDuration, 1);
            
            // Interpolate between colors
            const textColor = ColorUtils.interpolateColor(previousTextColor, targetTextColor, progress);
            displayText.style.color = textColor;
            
            // Check if transition is complete
            if (progress >= 1) {
                isColorTransitioning = false;
                previousTextColor = targetTextColor;
            }
        } else {
            // Use current emotion text color directly
            const emotionState = EmotionAnalyzer.getCurrentState();
            const textColor = Config.emotions[emotionState.currentEmotion]?.text || "#FFFFFF";
            displayText.style.color = textColor;
        }
    }
    
    /**
     * Update text animation based on current emotion
     * @param {Object} emotionState - Current emotion state
     * @param {Object} emotions - Emotion configurations
     */
    function updateTextAnimation(emotionState, emotions) {
        if (!displayText) return;
        
        // Reset animation classes but keep font classes
        const hasRoundedFont = displayText.classList.contains('rounded-font');
        const hasStandardFont = displayText.classList.contains('standard-font');
        
        displayText.className = 'display-text';
        
        // Restore font classes
        if (hasRoundedFont) {
            displayText.classList.add('rounded-font');
        } else if (hasStandardFont) {
            displayText.classList.add('standard-font');
        }
        
        const currentEmotion = emotionState.currentEmotion;
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
     * Start typewriter animation for text
     * @param {string} targetText - The text to type out
     */
    function startTypewriter(targetText) {
        if (!displayText) return;
        
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
        // Higher transitionSpeed value = faster typing (lower interval)
        const typingSpeed = Math.max(50, 500 - (VisualizationManager.getCurrentSettings().transitionSpeed * 10));
        
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
    function updateTextContent(text) {
        if (!displayText || typewriterInterval) return;
        
        // Only update text if not currently animating
        displayText.innerHTML = text + '<span class="typing-cursor"></span>';
    }
    
    /**
     * Start text color transition
     * @param {string} fromColor - Starting color
     * @param {string} toColor - Target color
     * @param {number} duration - Transition duration in ms
     */
    function startColorTransition(fromColor, toColor, duration) {
        previousTextColor = fromColor;
        targetTextColor = toColor;
        colorTransitionDuration = duration;
        colorTransitionStartTime = Date.now();
        isColorTransitioning = true;
    }
    
    /**
     * Check if text is currently animating
     * @returns {boolean} True if animation is in progress
     */
    function isAnimating() {
        return (typewriterInterval !== null) || isColorTransitioning;
    }
    
    // Public API
    return {
        init,
        updateTextStyles,
        updateTextAnimation,
        startTypewriter,
        updateTextContent,
        startColorTransition,
        isAnimating
    };
})();

// Export for use in other modules
window.TextEffects = TextEffects;
