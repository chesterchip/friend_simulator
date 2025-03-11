/**
 * Slider Controls for the Emotion Visualization App
 * Handles slider UI elements and their event handlers
 */

const SliderControls = (function() {
    // Slider mapping for configuration settings
    const sliderMap = {
        // Animation and gradient sliders
        'animationSpeed': {
            slider: 'animation-speed',
            value: 'animation-speed-value',
            unit: ''
        },
        'gradientMaxSize': {
            slider: 'gradient-max-size',
            value: 'gradient-max-size-value',
            unit: ''
        },
        'gradientMinSize': {
            slider: 'gradient-min-size',
            value: 'gradient-min-size-value',
            unit: ''
        },
        'gradientFeatherSize': {
            slider: 'gradient-feather-size',
            value: 'gradient-feather-size-value',
            unit: ''
        },
        'gradientTiltH': {
            slider: 'gradient-tilt-h',
            value: 'gradient-tilt-h-value',
            unit: '°'
        },
        'gradientTiltV': {
            slider: 'gradient-tilt-v',
            value: 'gradient-tilt-v-value',
            unit: '°'
        },
        
        // Text styling sliders
        'fontSize': {
            slider: 'font-size',
            value: 'font-size-value',
            unit: ''
        },
        'fontKerning': {
            slider: 'font-kerning',
            value: 'font-kerning-value',
            unit: ''
        },
        'fontWeight': {
            slider: 'font-weight',
            value: 'font-weight-value',
            unit: ''
        },
        'lineHeight': {
            slider: 'line-height',
            value: 'line-height-value',
            unit: ''
        },
        
        // Dropdowns
        'fontFamily': {
            slider: 'font-family',
            isDropdown: true
        },
        'fontStyle': {
            slider: 'font-style',
            isDropdown: true
        },
        
// Transition sliders
'transitionSpeed': {
    slider: 'transition-speed',
    value: 'transition-speed-value',
    unit: ''
},
'backgroundTransitionSpeed': {
    slider: 'bg-transition-speed',
    value: 'bg-transition-speed-value',
    unit: 'ms'
},
'gradientColorTransitionSpeed': {
    slider: 'gradient-color-transition-speed',
    value: 'gradient-color-transition-speed-value',
    unit: 'ms'
},
'textColorTransitionSpeed': {
    slider: 'text-color-transition-speed',
    value: 'text-color-transition-speed-value',
    unit: 'ms'
},
        
        // Layer settings
        'textOpacity': {
            slider: 'text-opacity',
            value: 'text-opacity-value',
            unit: '%'
        },
        'textBlendMode': {
            slider: 'text-blend-mode',
            isDropdown: true
        },
        'gradientOpacity': {
            slider: 'gradient-opacity',
            value: 'gradient-opacity-value',
            unit: '%'
        },
        'gradientBlendMode': {
            slider: 'gradient-blend-mode',
            isDropdown: true
        },
        'backgroundOpacity': {
            slider: 'background-opacity',
            value: 'background-opacity-value',
            unit: '%'
        },
        'backgroundBlendMode': {
            slider: 'background-blend-mode',
            isDropdown: true
        },
        
        // Distortion settings
        'distortionIntensity': {
            slider: 'distortion-intensity',
            value: 'distortion-intensity-value',
            unit: '%'
        },
        'distortionEffect': {
            slider: 'distortion-effect',
            isDropdown: true
        }
    };
    
    /**
     * Initialize all sliders with event listeners
     */
    function init() {
        Object.entries(sliderMap).forEach(([settingName, config]) => {
            const element = document.getElementById(config.slider);
            if (!element) return;
            
            if (config.isDropdown) {
                // Set up dropdown change handler
                element.addEventListener('change', function() {
                    const value = this.value;
                    VisualizationManager.updateSetting(settingName, value);
                });
            } else {
                // Set up slider input handler
                element.addEventListener('input', function() {
                    const value = parseInt(this.value);
                    
                    // Update display value
                    const valueDisplay = document.getElementById(config.value);
                    if (valueDisplay) {
                        valueDisplay.textContent = value + config.unit;
                    }
                    
                    // Update setting in visualization manager
                    VisualizationManager.updateSetting(settingName, value);
                });
            }
        });
    }
    
    /**
     * Update slider value in UI
     * @param {string} settingName - Setting name
     * @param {*} value - Setting value
     */
    function updateSliderUI(settingName, value) {
        const config = sliderMap[settingName];
        if (!config) return;
        
        const element = document.getElementById(config.slider);
        if (!element) return;
        
        // Update element value
        element.value = value;
        
        // Update display value for sliders
        if (!config.isDropdown && config.value) {
            const valueDisplay = document.getElementById(config.value);
            if (valueDisplay) {
                valueDisplay.textContent = value + config.unit;
            }
        }
    }
    
    /**
     * Update all sliders from a configuration object
     * @param {Object} config - Configuration object
     */
    function updateAllSliders(config) {
        Object.entries(sliderMap).forEach(([settingName, sliderConfig]) => {
            if (settingName in config) {
                updateSliderUI(settingName, config[settingName]);
            }
        });
    }
    
    // Public API
    return {
        init,
        updateSliderUI,
        updateAllSliders
    };
})();

// Export for use in other modules
window.SliderControls = SliderControls;