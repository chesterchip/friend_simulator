/**
 * Configuration file for Emotion Visualization App
 */

// App version
const appVersion = "1.008";

// Emotion configuration - colors and animations
const emotions = {
    anger: { bg: "#FF0000", text: "#000000", animation: "none", intensity: 50, duration: 100 },
    happy: { bg: "#4CAF50", text: "#000000", animation: "none", intensity: 50, duration: 100 },
    peaceful: { bg: "#FFEB3B", text: "#000000", animation: "none", intensity: 50, duration: 100 },
    fear: { bg: "#FF9800", text: "#000000", animation: "none", intensity: 50, duration: 100 },
    sad: { bg: "#9C27B0", text: "#000000", animation: "none", intensity: 50, duration: 100 },
    surprise: { bg: "#2196F3", text: "#000000", animation: "none", intensity: 50, duration: 100 },
    neutral: { bg: "#9E9E9E", text: "#000000", animation: "none", intensity: 50, duration: 100 }
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

// Default animation and slider values
const defaultValues = {
    animationSpeed: 50,
    gradientMaxSize: 50,
    gradientMinSize: 0,
    gradientFeatherSize: 0,
    fontSize: 50,
    fontKerning: 50,
    lineHeight: 50,
    fontWeight: 50,
    transitionSpeed: 50,
    backgroundTransitionSpeed: 500, // Default 500ms (fast)
    defaultTransitionDuration: 1000, // Default 1 second
    fontFamily: "SF Pro", // Default font family
    
    // Layer settings
    textOpacity: 100, // Text layer opacity (0-100)
    textBlendMode: "normal", // Text layer blend mode
    gradientOpacity: 100, // Gradient layer opacity (0-100)
    gradientBlendMode: "normal", // Gradient layer blend mode
    backgroundOpacity: 100, // Background layer opacity (0-100)
    backgroundBlendMode: "normal" // Background layer blend mode
};
