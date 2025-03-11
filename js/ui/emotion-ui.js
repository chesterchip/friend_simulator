/**
 * Emotion UI module for the Emotion Visualization App
 * Handles UI elements related to emotions display
 */

const EmotionUI = (function() {
    // DOM elements
    const detectedEmotionsContainer = document.getElementById('detected-emotions');
    const quickEmotionsContainer = document.getElementById('quick-emotions');
    const emotionInput = document.getElementById('emotion-input');
    
    /**
     * Initialize emotion UI elements
     */
    function init() {
        initQuickEmotions();
        initSpiderDiagram();
    }
    
    /**
     * Initialize quick emotion buttons
     */
    function initQuickEmotions() {
        if (!quickEmotionsContainer) return;
        
        quickEmotionsContainer.innerHTML = '';
        
        Object.keys(Config.emotions).forEach(emotion => {
            // Create button directly without using DOMUtils for simplicity
            const button = document.createElement('button');
            button.className = 'emotion-btn';
            button.textContent = emotion;
            button.onclick = () => handleQuickEmotionClick(emotion);
            
            quickEmotionsContainer.appendChild(button);
        });
    }

    /**
     * Initialize the spider diagram container
     */
    function initSpiderDiagram() {
        if (!detectedEmotionsContainer) return;
        
        // Clear existing content
        detectedEmotionsContainer.innerHTML = '';
        
        // Create a container for the spider diagram
        const spiderContainer = document.createElement('div');
        spiderContainer.id = 'spider-diagram-container';
        spiderContainer.style.width = '100%';
        spiderContainer.style.height = '300px';
        spiderContainer.style.marginBottom = '20px';
        
        // Append to the emotions container
        detectedEmotionsContainer.appendChild(spiderContainer);
        
        // Mount the spider diagram if ready, otherwise it will be mounted by the script
        if (window.EmotionSpiderDiagram && window.mountEmotionSpiderDiagram) {
            window.mountEmotionSpiderDiagram(spiderContainer);
        }
    }
    
    /**
     * Handle quick emotion button click
     * @param {string} emotion - Emotion name
     */
    function handleQuickEmotionClick(emotion) {
        if (!emotionInput) return;
        
        // Set input text to example for this emotion
        emotionInput.value = Config.examples[emotion];
        
        // Analyze the example text
        const result = EmotionAnalyzer.analyzeText(Config.examples[emotion], true);
        result.text = Config.examples[emotion];
        
        // Send to visualization manager
        VisualizationManager.processAnalysisResult(result);
        
        // Update emotion visualization
        updateEmotionVisualization(result.emotionScores);
    }
    
    /**
     * Update emotion visualization based on current scores
     * @param {Object} scores - Emotion scores
     */
    function updateEmotionVisualization(scores) {
        // Dispatch custom event to notify the spider diagram of score updates
        const event = new CustomEvent('emotionScoresUpdated', { detail: scores });
        window.dispatchEvent(event);
    }
    
    // Public API
    return {
        init,
        updateEmotionVisualization
    };
})();

// Export for use in other modules
window.EmotionUI = EmotionUI;