/**
 * Configuration Manager for the Emotion Visualization App
 * Handles saving and loading of configuration settings
 */

const ConfigManager = (function() {
    // DOM elements
    const saveConfigBtn = document.getElementById('save-config-btn');
    const loadConfigBtn = document.getElementById('load-config-btn');
    const configFileInput = document.getElementById('config-file-input');
    const configFeedback = document.getElementById('config-feedback');
    
    /**
     * Initialize configuration manager
     */
    function init() {
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
                appVersion: Config.appVersion,
                timestamp: new Date().toISOString(),
                
                // Emotion settings
                emotions: Config.getEmotions(),
                
                // Get current display settings from VisualizationManager
                ...VisualizationManager.getCurrentSettings()
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
                
                // Apply configuration settings using VisualizationManager
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
                if (Config.emotions[emotion]) {
                    Config.updateEmotion(emotion, config.emotions[emotion]);
                }
            });
        }
        
        // Apply visualization settings
        VisualizationManager.applySettings(config);
        
        // Update UI components to reflect new settings
        UIManager.updateUIFromConfig(config);
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
    
    // Public API
    return {
        init,
        saveConfiguration,
        loadConfiguration,
        applyConfiguration,
        showFeedback
    };
})();

// Export for use in other modules
window.ConfigManager = ConfigManager;
