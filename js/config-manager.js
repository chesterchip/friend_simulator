/**
 * Configuration Manager for the Emotion Visualization App
 * Handles saving and loading of configuration settings
 */

// DOM elements
const saveConfigBtn = document.getElementById('save-config-btn');
const loadConfigBtn = document.getElementById('load-config-btn');
const configFileInput = document.getElementById('config-file-input');
const configFeedback = document.getElementById('config-feedback');

/**
 * Initialize configuration manager
 */
function initConfigManager() {
    saveConfigBtn.addEventListener('click', saveConfiguration);
    loadConfigBtn.addEventListener('click', () => {
        configFileInput.click();
    });
    configFileInput.addEventListener('change', loadConfiguration);
}

/**
 * Save current configuration to a JSON file
 */
function saveConfiguration() {
    try {
        // Gather all configuration settings
        const configuration = {
            // App version and timestamp
            appVersion: appVersion,
            timestamp: new Date().toISOString(),
            
            // Emotion settings
            emotions: JSON.parse(JSON.stringify(emotions)),
            
            // Animation and slider values
            animationSpeed: animationSpeed,
            gradientMaxSize: gradientMaxSize,
            gradientMinSize: gradientMinSize,
            gradientFeatherSize: gradientFeatherSize,
            
            // Text settings
            fontSize: fontSize,
            fontKerning: fontKerning,
            fontWeight: fontWeight,
            lineHeight: lineHeight,
            fontFamily: fontFamily,
            fontStyle: fontStyle, // Added font style
            
            // Transition settings
            transitionSpeed: transitionSpeed,
            backgroundTransitionSpeed: backgroundTransitionSpeed,
            
            // Layer settings
            textOpacity: textOpacity,
            textBlendMode: textBlendMode,
            gradientOpacity: gradientOpacity,
            gradientBlendMode: gradientBlendMode,
            backgroundOpacity: backgroundOpacity,
            backgroundBlendMode: backgroundBlendMode,
            
            // Layer visibility
            textLayerVisible: textLayerVisible,
            gradientLayerVisible: gradientLayerVisible,
            backgroundLayerVisible: backgroundLayerVisible,
            
            // Distortion settings
            distortionEffect: distortionEffect,
            distortionIntensity: distortionIntensity,
            distortionLayerVisible: distortionLayerVisible
        };
        
        // Convert to JSON string
        const configJSON = JSON.stringify(configuration, null, 2);
        
        // Create a blob and download link
        const blob = new Blob([configJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `emotion-config-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Release the URL object
        URL.revokeObjectURL(url);
        
        // Show success message
        showFeedback('Configuration saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving configuration:', error);
        showFeedback('Error saving configuration', 'error');
    }
}

/**
 * Load configuration from a JSON file
 */
function loadConfiguration(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const configuration = JSON.parse(e.target.result);
            
            // Validate configuration
            if (!validateConfiguration(configuration)) {
                showFeedback('Invalid configuration file', 'error');
                return;
            }
            
            // Apply configuration settings
            applyConfiguration(configuration);
            
            // Show success message
            showFeedback('Configuration loaded successfully!', 'success');
            
            // Reset the file input
            configFileInput.value = '';
        } catch (error) {
            console.error('Error loading configuration:', error);
            showFeedback('Error loading configuration', 'error');
        }
    };
    
    reader.onerror = function() {
        showFeedback('Error reading file', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration object
 * @returns {boolean} True if valid
 */
function validateConfiguration(config) {
    // Basic validation, check for required properties
    const requiredProps = [
        'emotions', 
        'animationSpeed', 
        'gradientMaxSize', 
        'fontFamily'
    ];
    
    for (const prop of requiredProps) {
        if (!(prop in config)) {
            console.error(`Missing required property: ${prop}`);
            return false;
        }
    }
    
    return true;
}

/**
 * Apply loaded configuration to the app
 * @param {Object} config - Configuration object
 */
function applyConfiguration(config) {
    // Apply emotion settings
    if (config.emotions) {
        Object.keys(config.emotions).forEach(emotion => {
            if (emotions[emotion]) {
                emotions[emotion] = config.emotions[emotion];
            }
        });
    }
    
    // Apply animation and gradient settings
    if ('animationSpeed' in config) window.updateSliderValue('animationSpeed', config.animationSpeed);
    if ('gradientMaxSize' in config) window.updateSliderValue('gradientMaxSize', config.gradientMaxSize);
    if ('gradientMinSize' in config) window.updateSliderValue('gradientMinSize', config.gradientMinSize);
    if ('gradientFeatherSize' in config) window.updateSliderValue('gradientFeatherSize', config.gradientFeatherSize);
    
    // Apply text settings
    if ('fontSize' in config) window.updateSliderValue('fontSize', config.fontSize);
    if ('fontKerning' in config) window.updateSliderValue('fontKerning', config.fontKerning);
    if ('fontWeight' in config) window.updateSliderValue('fontWeight', config.fontWeight);
    if ('lineHeight' in config) window.updateSliderValue('lineHeight', config.lineHeight);
    if ('fontFamily' in config) window.updateSliderValue('fontFamily', config.fontFamily);
    if ('fontStyle' in config) window.updateSliderValue('fontStyle', config.fontStyle);
    
    // Apply transition settings
    if ('transitionSpeed' in config) window.updateSliderValue('transitionSpeed', config.transitionSpeed);
    if ('backgroundTransitionSpeed' in config) window.updateSliderValue('backgroundTransitionSpeed', config.backgroundTransitionSpeed);
    
    // Apply layer settings
    if ('textOpacity' in config) window.updateSliderValue('textOpacity', config.textOpacity);
    if ('textBlendMode' in config) window.updateSliderValue('textBlendMode', config.textBlendMode);
    if ('gradientOpacity' in config) window.updateSliderValue('gradientOpacity', config.gradientOpacity);
    if ('gradientBlendMode' in config) window.updateSliderValue('gradientBlendMode', config.gradientBlendMode);
    if ('backgroundOpacity' in config) window.updateSliderValue('backgroundOpacity', config.backgroundOpacity);
    if ('backgroundBlendMode' in config) window.updateSliderValue('backgroundBlendMode', config.backgroundBlendMode);
    
    // Apply layer visibility
    if ('textLayerVisible' in config) window.updateLayerVisibility('text', config.textLayerVisible);
    if ('gradientLayerVisible' in config) window.updateLayerVisibility('gradient', config.gradientLayerVisible);
    if ('backgroundLayerVisible' in config) window.updateLayerVisibility('background', config.backgroundLayerVisible);
    
    // Apply distortion settings
    if ('distortionEffect' in config) window.updateSliderValue('distortionEffect', config.distortionEffect);
    if ('distortionIntensity' in config) window.updateSliderValue('distortionIntensity', config.distortionIntensity);
    if ('distortionLayerVisible' in config) window.updateLayerVisibility('distortion', config.distortionLayerVisible);
    
    // Update UI to reflect new settings
    updateUIFromConfig(config);
}

/**
 * Update UI elements to reflect loaded configuration
 * @param {Object} config - Configuration object
 */
function updateUIFromConfig(config) {
    // Update slider values
    if ('animationSpeed' in config) {
        document.getElementById('animation-speed').value = config.animationSpeed;
        document.getElementById('animation-speed-value').textContent = config.animationSpeed;
    }
    
    if ('gradientMaxSize' in config) {
        document.getElementById('gradient-max-size').value = config.gradientMaxSize;
        document.getElementById('gradient-max-size-value').textContent = config.gradientMaxSize;
    }
    
    if ('gradientMinSize' in config) {
        document.getElementById('gradient-min-size').value = config.gradientMinSize;
        document.getElementById('gradient-min-size-value').textContent = config.gradientMinSize;
    }
    
    if ('gradientFeatherSize' in config) {
        document.getElementById('gradient-feather-size').value = config.gradientFeatherSize;
        document.getElementById('gradient-feather-size-value').textContent = config.gradientFeatherSize;
    }
    
    // Update font settings
    if ('fontSize' in config) {
        document.getElementById('font-size').value = config.fontSize;
        document.getElementById('font-size-value').textContent = config.fontSize;
    }
    
    if ('fontKerning' in config) {
        document.getElementById('font-kerning').value = config.fontKerning;
        document.getElementById('font-kerning-value').textContent = config.fontKerning;
    }
    
    if ('fontWeight' in config) {
        document.getElementById('font-weight').value = config.fontWeight;
        document.getElementById('font-weight-value').textContent = config.fontWeight;
    }
    
    if ('lineHeight' in config) {
        document.getElementById('line-height').value = config.lineHeight;
        document.getElementById('line-height-value').textContent = config.lineHeight;
    }
    
    if ('fontFamily' in config) {
        document.getElementById('font-family').value = config.fontFamily;
    }
    
    if ('fontStyle' in config) {
        document.getElementById('font-style').value = config.fontStyle;
    }
    
    // Update transition settings
    if ('transitionSpeed' in config) {
        document.getElementById('transition-speed').value = config.transitionSpeed;
        document.getElementById('transition-speed-value').textContent = config.transitionSpeed;
    }
    
    if ('backgroundTransitionSpeed' in config) {
        document.getElementById('bg-transition-speed').value = config.backgroundTransitionSpeed;
        document.getElementById('bg-transition-speed-value').textContent = config.backgroundTransitionSpeed + 'ms';
    }
    
    // Update layer settings
    if ('textOpacity' in config) {
        document.getElementById('text-opacity').value = config.textOpacity;
        document.getElementById('text-opacity-value').textContent = config.textOpacity + '%';
    }
    
    if ('textBlendMode' in config) {
        document.getElementById('text-blend-mode').value = config.textBlendMode;
    }
    
    if ('gradientOpacity' in config) {
        document.getElementById('gradient-opacity').value = config.gradientOpacity;
        document.getElementById('gradient-opacity-value').textContent = config.gradientOpacity + '%';
    }
    
    if ('gradientBlendMode' in config) {
        document.getElementById('gradient-blend-mode').value = config.gradientBlendMode;
    }
    
    if ('backgroundOpacity' in config) {
        document.getElementById('background-opacity').value = config.backgroundOpacity;
        document.getElementById('background-opacity-value').textContent = config.backgroundOpacity + '%';
    }
    
    if ('backgroundBlendMode' in config) {
        document.getElementById('background-blend-mode').value = config.backgroundBlendMode;
    }
    
    // Update distortion settings
    if ('distortionIntensity' in config) {
        document.getElementById('distortion-intensity').value = config.distortionIntensity;
        document.getElementById('distortion-intensity-value').textContent = config.distortionIntensity + '%';
    }
    
    if ('distortionEffect' in config) {
        document.getElementById('distortion-effect').value = config.distortionEffect;
    }
    
    // Update layer visibility toggles
    if ('textLayerVisible' in config) {
        const textToggle = document.getElementById('text-visibility-toggle');
        if (textToggle) {
            textToggle.classList.toggle('hidden', !config.textLayerVisible);
        }
    }
    
    if ('gradientLayerVisible' in config) {
        const gradientToggle = document.getElementById('gradient-visibility-toggle');
        if (gradientToggle) {
            gradientToggle.classList.toggle('hidden', !config.gradientLayerVisible);
        }
    }
    
    if ('backgroundLayerVisible' in config) {
        const backgroundToggle = document.getElementById('background-visibility-toggle');
        if (backgroundToggle) {
            backgroundToggle.classList.toggle('hidden', !config.backgroundLayerVisible);
        }
    }
    
    if ('distortionLayerVisible' in config) {
        const distortionToggle = document.getElementById('distortion-visibility-toggle');
        if (distortionToggle) {
            distortionToggle.classList.toggle('hidden', !config.distortionLayerVisible);
        }
    }
    
    // Update color table
    initColorTable();
    
    // Force display update
    window.updateDisplay();
}

/**
 * Show feedback message to the user
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showFeedback(message, type = 'success') {
    configFeedback.textContent = message;
    configFeedback.className = 'config-feedback';
    configFeedback.classList.add(`config-${type}`);
    
    // Clear message after 3 seconds
    setTimeout(() => {
        configFeedback.textContent = '';
        configFeedback.className = 'config-feedback';
    }, 3000);
}

// Expose the init function to the global scope
window.initConfigManager = initConfigManager;
