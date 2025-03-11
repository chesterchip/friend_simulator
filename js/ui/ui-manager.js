/**
 * UI Manager for the Emotion Visualization App
 * Coordinates UI initialization and updates
 */

const UIManager = (function() {
    // Track if a slider is being actively dragged
    let activeSlider = null;

    /**
     * Initialize all UI modules and elements
     */
    function init() {
        // Initialize UI sub-modules
        SliderControls.init();
        ColorControls.init();
        LayerControls.init();
        EmotionUI.init();
        
        // Initialize event listeners for main UI elements
        initMainEventListeners();
        
        // Initialize history navigation
        initHistoryNavigation();
        
        // Initialize reset buttons
        initResetButtons();
    }
    
    /**
     * Initialize main event listeners
     */
    function initMainEventListeners() {
        const emotionInput = document.getElementById('emotion-input');
        const clearButton = document.getElementById('clear-btn');
        const analyzeButton = document.getElementById('analyze-btn');
        
        // Clear button
        clearButton.addEventListener('click', () => {
            emotionInput.value = '';
            emotionInput.focus();
            
            // Analyze empty text to reset
            const result = EmotionAnalyzer.analyzeText('', true);
            result.text = '';
            
            // Send to visualization manager for processing
            VisualizationManager.processAnalysisResult(result);
            
            // Update emotion UI
            if (EmotionUI.updateEmotionVisualization) {
                EmotionUI.updateEmotionVisualization(result.emotionScores);
            }
        });
        
        // Analyze button
        analyzeButton.addEventListener('click', () => {
            const result = EmotionAnalyzer.analyzeText(emotionInput.value, true);
            result.text = emotionInput.value;
            
            VisualizationManager.processAnalysisResult(result);
            if (EmotionUI.updateEmotionVisualization) {
                EmotionUI.updateEmotionVisualization(result.emotionScores);
            }
        });
        
        // Real-time analysis as user types
        emotionInput.addEventListener('input', () => {
            const result = EmotionAnalyzer.analyzeText(emotionInput.value);
            result.text = emotionInput.value;
            
            VisualizationManager.processAnalysisResult(result);
            if (EmotionUI.updateEmotionVisualization) {
                EmotionUI.updateEmotionVisualization(result.emotionScores);
            }
        });
        
        // Enter key to analyze
        emotionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const result = EmotionAnalyzer.analyzeText(emotionInput.value, true);
                result.text = emotionInput.value;
                
                VisualizationManager.processAnalysisResult(result);
                if (EmotionUI.updateEmotionVisualization) {
                    EmotionUI.updateEmotionVisualization(result.emotionScores);
                }
            }
        });
        
        // Initialize gradient tilt sliders
        initGradientTiltSliders();

        // Initialize slider change tracking
        initSliderTracking();
    }

    /**
     * Initialize slider tracking to save state only on slider release
     */
    function initSliderTracking() {
        // Find all slider elements
        const sliders = document.querySelectorAll('input[type="range"]');
        
        sliders.forEach(slider => {
            // Track when slider dragging starts
            slider.addEventListener('mousedown', () => {
                activeSlider = slider.id;
            });

            // Track when slider dragging ends - save state only then
            slider.addEventListener('mouseup', () => {
                if (activeSlider === slider.id) {
                    // Get the value from the slider
                    const value = parseInt(slider.value);
                    const settingName = getSettingNameFromSliderId(slider.id);
                    
                    if (settingName) {
                        // Update the setting and save state
                        VisualizationManager.updateSettingWithHistory(settingName, value);
                    }
                    
                    activeSlider = null;
                }
            });

            // Also handle change events for cases when slider is changed without dragging
            slider.addEventListener('change', () => {
                const value = parseInt(slider.value);
                const settingName = getSettingNameFromSliderId(slider.id);
                
                if (settingName && !activeSlider) {
                    // Update the setting and save state
                    VisualizationManager.updateSettingWithHistory(settingName, value);
                }
            });

            // For input events during dragging, just update display without saving history
            slider.addEventListener('input', () => {
                if (activeSlider === slider.id) {
                    const value = parseInt(slider.value);
                    const settingName = getSettingNameFromSliderId(slider.id);
                    
                    if (settingName) {
                        // Update the setting without saving history
                        VisualizationManager.updateSettingWithoutHistory(settingName, value);
                    }
                }
            });
        });
    }

    /**
     * Map slider ID to setting name
     * @param {string} sliderId - The ID of the slider element
     * @returns {string|null} - The corresponding setting name or null if not found
     */
    function getSettingNameFromSliderId(sliderId) {
        // Map of slider IDs to setting names
        const sliderMap = {
            'animation-speed': 'animationSpeed',
            'gradient-max-size': 'gradientMaxSize',
            'gradient-min-size': 'gradientMinSize',
            'gradient-feather-size': 'gradientFeatherSize',
            'gradient-tilt-h': 'gradientTiltH',
            'gradient-tilt-v': 'gradientTiltV',
            'font-size': 'fontSize',
            'font-kerning': 'fontKerning',
            'font-weight': 'fontWeight',
            'line-height': 'lineHeight',
            'transition-speed': 'transitionSpeed',
            'bg-transition-speed': 'backgroundTransitionSpeed',
            'text-opacity': 'textOpacity',
            'gradient-opacity': 'gradientOpacity',
            'background-opacity': 'backgroundOpacity',
            'distortion-intensity': 'distortionIntensity'
        };
        
        return sliderMap[sliderId] || null;
    }
    
    /**
     * Initialize history navigation
     */
    function initHistoryNavigation() {
        const backButton = document.getElementById('history-back-btn');
        const forwardButton = document.getElementById('history-forward-btn');
        
        if (backButton) {
            backButton.addEventListener('click', () => {
                VisualizationManager.goBack();
                updateHistoryButtonsState();
            });
        }
        
        if (forwardButton) {
            forwardButton.addEventListener('click', () => {
                VisualizationManager.goForward();
                updateHistoryButtonsState();
            });
        }
    }

    /**
     * Update history navigation button states
     */
    function updateHistoryButtonsState() {
        const backButton = document.getElementById('history-back-btn');
        const forwardButton = document.getElementById('history-forward-btn');
        
        if (backButton) {
            backButton.disabled = !VisualizationManager.canGoBack();
        }
        
        if (forwardButton) {
            forwardButton.disabled = !VisualizationManager.canGoForward();
        }
    }
    
    /**
     * Initialize reset buttons
     */
    function initResetButtons() {
        // Reset Tilt Horizontal button
        const resetTiltHButton = document.getElementById('reset-tilt-h');
        if (resetTiltHButton) {
            resetTiltHButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button behavior
                e.stopPropagation(); // Prevent event bubbling
                VisualizationManager.resetControl('gradientTiltH');
            });
        }
        
        // Reset Tilt Vertical button
        const resetTiltVButton = document.getElementById('reset-tilt-v');
        if (resetTiltVButton) {
            resetTiltVButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button behavior
                e.stopPropagation(); // Prevent event bubbling
                VisualizationManager.resetControl('gradientTiltV');
            });
        }
    }
    
    /**
     * Initialize gradient tilt sliders
     */
    function initGradientTiltSliders() {
        const tiltHSlider = document.getElementById('gradient-tilt-h');
        const tiltVSlider = document.getElementById('gradient-tilt-v');
        const tiltHValue = document.getElementById('gradient-tilt-h-value');
        const tiltVValue = document.getElementById('gradient-tilt-v-value');
        
        if (tiltHSlider && tiltHValue) {
            tiltHSlider.addEventListener('input', () => {
                const value = parseInt(tiltHSlider.value);
                tiltHValue.textContent = value + '°';
                VisualizationManager.updateSettingWithoutHistory('gradientTiltH', value);
            });

            tiltHSlider.addEventListener('change', () => {
                const value = parseInt(tiltHSlider.value);
                VisualizationManager.updateSettingWithHistory('gradientTiltH', value);
            });
        }
        
        if (tiltVSlider && tiltVValue) {
            tiltVSlider.addEventListener('input', () => {
                const value = parseInt(tiltVSlider.value);
                tiltVValue.textContent = value + '°';
                VisualizationManager.updateSettingWithoutHistory('gradientTiltV', value);
            });

            tiltVSlider.addEventListener('change', () => {
                const value = parseInt(tiltVSlider.value);
                VisualizationManager.updateSettingWithHistory('gradientTiltV', value);
            });
        }
    }
    
    /**
     * Update UI elements to reflect loaded configuration
     * @param {Object} config - Configuration object
     */
    function updateUIFromConfig(config) {
        // Update slider values in the UI
        SliderControls.updateAllSliders(config);
        
        // Update color table UI
        ColorControls.refreshColorTable();
        
        // Update layer visibility toggles
        if ('textLayerVisible' in config) {
            LayerControls.updateVisibilityToggleUI('text', config.textLayerVisible);
        }
        
        if ('gradientLayerVisible' in config) {
            LayerControls.updateVisibilityToggleUI('gradient', config.gradientLayerVisible);
        }
        
        if ('backgroundLayerVisible' in config) {
            LayerControls.updateVisibilityToggleUI('background', config.backgroundLayerVisible);
        }
        
        if ('distortionLayerVisible' in config) {
            LayerControls.updateVisibilityToggleUI('distortion', config.distortionLayerVisible);
        }
        
        // Update distortion layer checkboxes
        LayerControls.updateDistortionCheckboxesUI(config);

        // Update history button states
        updateHistoryButtonsState();
    }
    
    // Public API
    return {
        init,
        updateUIFromConfig,
        updateHistoryButtonsState
    };
})();

// Export for use in other modules
window.UIManager = UIManager;