/**
 * Emotion analysis module for the Emotion Visualization App
 */

// Current emotional state
let currentEmotion = "neutral";
let secondaryEmotion = "neutral";
let emotionScores = {
    anger: 0.1, happy: 0.1, peaceful: 0.1, fear: 0.1, 
    sad: 0.1, surprise: 0.1, neutral: 0.8
};

/**
 * Analyze text to detect emotions
 * @param {string} text - The text to analyze
 * @param {boolean} isButtonClick - Whether this is triggered by a button click
 * @returns {Object} - The analysis results
 */
function analyzeEmotion(text, isButtonClick = false) {
    text = text.trim();
    
    if (!text) {
        // Reset to neutral for empty text
        resetToNeutral();
        return {
            currentEmotion,
            secondaryEmotion,
            emotionScores,
            textChanged: true,
            emotionChanged: false
        };
    }
    
    // Store previous emotions to detect changes
    const prevCurrentEmotion = currentEmotion;
    const prevSecondaryEmotion = secondaryEmotion;
    
    // Calculate emotion scores
    const scores = calculateEmotionScores(text);
    
    // Normalize scores to total 100%
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    const normalizedScores = {};
    for (const emotion in scores) {
        normalizedScores[emotion] = (scores[emotion] / totalScore) * 100;
    }
    
    // Sort emotions by score to find the top ones
    const sortedEmotions = Object.keys(normalizedScores)
        .sort((a, b) => normalizedScores[b] - normalizedScores[a]);
    
    // Update emotions
    currentEmotion = sortedEmotions[0] || "neutral";
    secondaryEmotion = sortedEmotions[1] || "neutral";
    emotionScores = normalizedScores;
    
    // Determine if emotions have changed
    const emotionChanged = (prevCurrentEmotion !== currentEmotion || prevSecondaryEmotion !== secondaryEmotion);
    
    return {
        currentEmotion,
        secondaryEmotion,
        emotionScores,
        prevCurrentEmotion,
        prevSecondaryEmotion,
        textChanged: true,
        emotionChanged,
        isButtonClick
    };
}

/**
 * Reset emotions to neutral state
 */
function resetToNeutral() {
    currentEmotion = "neutral";
    secondaryEmotion = "neutral";
    emotionScores = {
        anger: 0.1, happy: 0.1, peaceful: 0.1, fear: 0.1, 
        sad: 0.1, surprise: 0.1, neutral: 0.8
    };
}

/**
 * Calculate scores for each emotion based on text content
 * @param {string} text - The text to analyze
 * @returns {Object} - Emotion scores
 */
function calculateEmotionScores(text) {
    let scores = {};
    
    // Initialize all emotions with a small baseline score
    for (const emotion in emotions) {
        scores[emotion] = 0.1;
    }
    
    // Simple keyword matching
    const lowerText = text.toLowerCase();
    for (const emotion in keywords) {
        for (const keyword of keywords[emotion]) {
            if (lowerText.includes(keyword)) {
                scores[emotion] += 1.0;
                
                // Check for intensifiers
                const intensifiers = ["very", "so", "really", "extremely", "absolutely"];
                for (const intensifier of intensifiers) {
                    if (lowerText.includes(intensifier + " " + keyword)) {
                        scores[emotion] += 1.0; // Double the score for intensified emotions
                        break;
                    }
                }
            }
        }
    }
    
    // Specific phrase detection
    if (lowerText.includes("i love you")) {
        scores.happy += 1.5;
        scores.peaceful += 1.0;
    }
    
    if (lowerText.includes("i'm afraid") || lowerText.includes("im afraid")) {
        scores.fear += 1.5;
    }
    
    if (lowerText.includes("but")) {
        // Sentences with "but" often have mixed emotions
        const parts = lowerText.split("but");
        if (parts.length > 1) {
            // Analyze the part after "but" with more weight
            for (const emotion in keywords) {
                for (const keyword of keywords[emotion]) {
                    if (parts[1].includes(keyword)) {
                        scores[emotion] += 0.8; // Add extra weight for emotions after "but"
                    }
                }
            }
        }
    }
    
    return scores;
}

/**
 * Get current emotion state
 * @returns {Object} - Current emotion state
 */
function getCurrentEmotionState() {
    return {
        currentEmotion,
        secondaryEmotion,
        emotionScores
    };
}
