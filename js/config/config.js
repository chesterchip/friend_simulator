/**
 * Configuration module for Emotion Visualization App
 */

const Config = (function() {
    // App version
    const appVersion = "1.008";

    // Emotion configuration - colors and animations
    const emotions = {
        anger: { bg: "#D54A4A", text: "#AA4A4A", animation: "none", intensity: 50, duration: 100 },
        happy: { bg: "#4CAF50", text: "#3A8C8C", animation: "none", intensity: 50, duration: 100 },
        peaceful: { bg: "#FFEB3B", text: "#FFD54F", animation: "none", intensity: 50, duration: 100 },
        fear: { bg: "#FF9800", text: "#D54A4A", animation: "none", intensity: 50, duration: 100 },
        sad: { bg: "#AB4A8E", text: "#5E1D85", animation: "none", intensity: 50, duration: 100 },
        surprise: { bg: "#2196F3", text: "#1A237E", animation: "none", intensity: 50, duration: 100 },
        neutral: { bg: "#9E9E9E", text: "#1A237E", animation: "none", intensity: 50, duration: 100 }
    };

    // Example sentences for quick emotions
    const examples = {
        anger: "I'm so angry right now",
        happy: "I'm really excited about the celebration!",
        peaceful: "I feel completely relaxed and content.",
        fear: "I'm terrified of what might happen next.",
        sad: "I feel so disappointed and lonely today.",
        surprise: "I'm absolutely shocked by the news!",
        neutral: "I'm just going about my day as usual."
    };

    // Keywords for emotion detection
    const keywords = {
        anger: ["angry", "mad", "furious", "rage", "hate", "annoyed", "irritated", "frustrated", "enraged"],
        happy: ["happy", "joy", "excited", "glad", "pleased", "delighted", "cheerful", "thrilled", "ecstatic", "love"],
        peaceful: ["peaceful", "calm", "relaxed", "serene", "tranquil", "content", "zen", "mindful", "chill"],
        fear: ["fear", "afraid", "scared", "terrified", "anxious", "worried", "nervous", "dread", "panic"],
        sad: ["sad", "unhappy", "depressed", "miserable", "gloomy", "heartbroken", "down", "melancholy", "devastated"],
        surprise: ["surprise", "shocked", "amazed", "astonished", "stunned", "wow", "unexpected", "startled", "astounded"],
        neutral: ["neutral", "ok", "fine", "alright", "average", "normal", "balanced", "standard", "moderate"]
    };

    // Default animation options
    const animationOptions = ['pulse', 'shake', 'big', 'small', 'nod', 'ripple', 'bloom', 'jitter', 'none'];

    // Color palette from screenshot 2
    const colorPalette = [
        "#FFEB3B", // Yellow
        "#4CAF50", // Green
        "#3A8C8C", // Teal
        "#2A7E7E", // Dark Teal
        "#3F51B5", // Indigo
        "#1A237E", // Dark Blue
        "#5E1D85", // Purple
        "#AB4A8E", // Pink/Magenta
        "#D54A4A", // Red
        "#E53935", // Bright Red
        "#FF9800", // Orange
        "#FFB74D"  // Light Orange
    ];

    // Default animation and slider values - updated with user configuration
    const defaultValues = {
        animationSpeed: 76,
        gradientMaxSize: 100,
        gradientMinSize: 100,
        gradientFeatherSize: 28,
        gradientTiltH: 0,   // New gradient tilt horizontal value
        gradientTiltV: 0,   // New gradient tilt vertical value
        fontSize: 74,
        fontKerning: 50,
        lineHeight: 36,
        fontWeight: 18,
        fontStyle: "normal",
        transitionSpeed: 41,
        backgroundTransitionSpeed: 500,
        gradientColorTransitionSpeed: 700, // New setting for gradient color transition speed
        textColorTransitionSpeed: 600,      // New setting for text color transition speed
        defaultTransitionDuration: 1000, // Default 1 second
        fontFamily: "SF Pro", // Default font family
        
        // Layer settings
        textOpacity: 100, // Text layer opacity (0-100)
        textBlendMode: "normal", // Text layer blend mode
        gradientOpacity: 100, // Gradient layer opacity (0-100)
        gradientBlendMode: "normal", // Gradient layer blend mode
        backgroundOpacity: 100, // Background layer opacity (0-100)
        backgroundBlendMode: "normal", // Background layer blend mode
        
        // Distortion settings
        distortionEffect: "none", // Default to no distortion
        distortionIntensity: 50,  // Middle intensity by default
        distortText: true,        // Apply distortion to text layer
        distortGradient: true,    // Apply distortion to gradient layer
        distortBackground: true,   // Apply distortion to background layer
        
        // Advanced gradient settings (matching screenshot exactly)
        advancedGradient: {
            type: 'dual-radial',
            point1: { x: 50, y: 30, size: 50 },  // Exactly matching screenshot
            point2: { x: 50, y: 70, size: 50 },  // Exactly matching screenshot
            glow: 0,                             // Exactly matching screenshot (0)
            bloom: 55,                           // Exactly matching screenshot (55)
            blend: 49,                           // Exactly matching screenshot (49)
            colors: {
                primary: '#59a3ff',              // Blue color shown in screenshot
                secondary: '#ff3b3b',            // Red color shown in screenshot
                background: '#59a3ff'            // Blue color shown in screenshot
            }
        }
    };
    
    /**
     * Get a copy of the emotions configuration
     * @returns {Object} Copy of emotions configuration
     */
    function getEmotions() {
        return JSON.parse(JSON.stringify(emotions));
    }
    
    /**
     * Update emotion settings
     * @param {string} emotion - Emotion name
     * @param {Object} settings - New settings
     */
    function updateEmotion(emotion, settings) {
        if (emotions[emotion]) {
            Object.assign(emotions[emotion], settings);
        }
    }
    
    /**
     * Get a specific setting value
     * @param {string} setting - Setting name
     * @returns {*} Setting value
     */
    function getValue(setting) {
        return defaultValues[setting] !== undefined ? defaultValues[setting] : null;
    }
    
    /**
     * Get a copy of the current configuration
     * @returns {Object} Current configuration
     */
    function getCurrentConfig() {
        return {
            appVersion,
            emotions: getEmotions(),
            defaultValues: { ...defaultValues }
        };
    }
    
    /**
     * Get the color palette
     * @returns {Array} Color palette
     */
    function getColorPalette() {
        return [...colorPalette];
    }
    
    // Public API
    return {
        appVersion,
        emotions,
        examples,
        keywords,
        animationOptions,
        defaultValues,
        colorPalette,
        getEmotions,
        updateEmotion,
        getValue,
        getCurrentConfig,
        getColorPalette
    };
})();

// Export for use in other modules
window.Config = Config;