/**
 * Layer Controls for the Emotion Visualization App
 * Handles layer visibility and blend mode controls
 */

const LayerControls = (function() {
    // Layer visibility toggle elements
    let textVisibilityToggle;
    let gradientVisibilityToggle;
    let backgroundVisibilityToggle;
    let distortionVisibilityToggle;
    
    // Distortion layer checkboxes
    const distortTextCheckbox = document.getElementById('distort-text');
    const distortGradientCheckbox = document.getElementById('distort-gradient');
    const distortBackgroundCheckbox = document.getElementById('distort-background');
    
    /**
     * Initialize layer controls
     */
    function init() {
        // Get references to toggle elements - moved here to ensure DOM is ready
        textVisibilityToggle = document.getElementById('text-visibility-toggle');
        gradientVisibilityToggle = document.getElementById('gradient-visibility-toggle');
        backgroundVisibilityToggle = document.getElementById('background-visibility-toggle');
        distortionVisibilityToggle = document.getElementById('distortion-visibility-toggle');
        
        // Initialize with default visibility (all visible)
        updateLayerVisibility('text', true);
        updateLayerVisibility('gradient', true);
        updateLayerVisibility('background', true);
        updateLayerVisibility('distortion', true);
        
        // Set up visibility toggle event listeners
        initVisibilityToggles();
        
        // Set up distortion layer checkboxes
        initDistortionLayerCheckboxes();
    }
    
    /**
     * Initialize visibility toggle event listeners
     */
    function initVisibilityToggles() {
        // Text layer visibility toggle
        if (textVisibilityToggle) {
            textVisibilityToggle.addEventListener('click', () => {
                // Get current visibility state from the class
                const isCurrentlyHidden = textVisibilityToggle.classList.contains('hidden');
                // Toggle the class
                textVisibilityToggle.classList.toggle('hidden');
                // Update layer visibility - if it's hidden, we want to show it and vice versa
                updateLayerVisibility('text', isCurrentlyHidden);
            });
        }
        
        // Gradient layer visibility toggle
        if (gradientVisibilityToggle) {
            gradientVisibilityToggle.addEventListener('click', () => {
                const isCurrentlyHidden = gradientVisibilityToggle.classList.contains('hidden');
                gradientVisibilityToggle.classList.toggle('hidden');
                updateLayerVisibility('gradient', isCurrentlyHidden);
            });
        }
        
        // Background layer visibility toggle
        if (backgroundVisibilityToggle) {
            backgroundVisibilityToggle.addEventListener('click', () => {
                const isCurrentlyHidden = backgroundVisibilityToggle.classList.contains('hidden');
                backgroundVisibilityToggle.classList.toggle('hidden');
                updateLayerVisibility('background', isCurrentlyHidden);
            });
        }
        
        // Distortion layer visibility toggle
        if (distortionVisibilityToggle) {
            distortionVisibilityToggle.addEventListener('click', () => {
                const isCurrentlyHidden = distortionVisibilityToggle.classList.contains('hidden');
                distortionVisibilityToggle.classList.toggle('hidden');
                updateLayerVisibility('distortion', isCurrentlyHidden);
            });
        }
    }
    
    /**
     * Initialize distortion layer checkboxes
     */
    function initDistortionLayerCheckboxes() {
        if (distortTextCheckbox) {
            distortTextCheckbox.addEventListener('change', () => {
                updateDistortionLayerSettings('distortText', distortTextCheckbox.checked);
            });
        }
        
        if (distortGradientCheckbox) {
            distortGradientCheckbox.addEventListener('change', () => {
                updateDistortionLayerSettings('distortGradient', distortGradientCheckbox.checked);
            });
        }
        
        if (distortBackgroundCheckbox) {
            distortBackgroundCheckbox.addEventListener('change', () => {
                updateDistortionLayerSettings('distortBackground', distortBackgroundCheckbox.checked);
            });
        }
    }
    
    /**
     * Update distortion layer settings
     * @param {string} setting - Setting name
     * @param {boolean} value - Setting value
     */
    function updateDistortionLayerSettings(setting, value) {
        VisualizationManager.updateSetting(setting, value);
    }
    
    /**
     * Update layer visibility
     * @param {string} layer - Layer name
     * @param {boolean} visible - Visibility state
     */
    function updateLayerVisibility(layer, visible) {
        // Update in visualization manager
        VisualizationManager.updateLayerVisibility(layer, visible);
        
        // Update UI toggle state
        updateVisibilityToggleUI(layer, visible);
    }
    
    /**
     * Update visibility toggle UI
     * @param {string} layer - Layer name
     * @param {boolean} visible - Visibility state
     */
    function updateVisibilityToggleUI(layer, visible) {
        let toggle;
        
        // Get the correct toggle element
        switch (layer) {
            case 'text':
                toggle = textVisibilityToggle;
                break;
            case 'gradient':
                toggle = gradientVisibilityToggle;
                break;
            case 'background':
                toggle = backgroundVisibilityToggle;
                break;
            case 'distortion':
                toggle = distortionVisibilityToggle;
                break;
        }
        
        // Update toggle state - hidden class means NOT visible
        if (toggle) {
            toggle.classList.toggle('hidden', !visible);
        }
    }
    
    /**
     * Update distortion checkboxes UI
     * @param {Object} config - Configuration object
     */
    function updateDistortionCheckboxesUI(config) {
        if (distortTextCheckbox && 'distortText' in config) {
            distortTextCheckbox.checked = config.distortText;
        }
        
        if (distortGradientCheckbox && 'distortGradient' in config) {
            distortGradientCheckbox.checked = config.distortGradient;
        }
        
        if (distortBackgroundCheckbox && 'distortBackground' in config) {
            distortBackgroundCheckbox.checked = config.distortBackground;
        }
    }
    
    // Public API
    return {
        init,
        updateLayerVisibility,
        updateVisibilityToggleUI,
        updateDistortionCheckboxesUI
    };
})();

// Export for use in other modules
window.LayerControls = LayerControls;