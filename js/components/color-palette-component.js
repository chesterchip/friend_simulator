/**
 * Color Palette Component for the Emotion Visualization App
 * Displays a grid of color swatches that can be clicked to select colors
 */

const ColorPaletteComponent = (function() {
    // DOM element
    let paletteContainer = null;
    
    // Event callback
    let onColorSelected = null;
    
    /**
     * Initialize color palette component
     * @param {string|HTMLElement} container - Container element or ID
     * @param {Function} callback - Callback when color is selected
     */
    function init(container, callback) {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        if (!container) {
            console.error('Color palette container not found');
            return;
        }
        
        // Store reference to container
        paletteContainer = container;
        
        // Store callback
        onColorSelected = callback;
        
        // Create color palette
        createColorPalette();
    }
    
    /**
     * Create color palette from Config.colorPalette
     */
    function createColorPalette() {
        if (!paletteContainer) return;
        
        // Clear container
        paletteContainer.innerHTML = '';
        
        // Create color palette wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'color-palette-wrapper';
        wrapper.style.display = 'grid';
        wrapper.style.gridTemplateColumns = 'repeat(6, 1fr)';
        wrapper.style.gap = '4px';
        wrapper.style.marginTop = '15px';
        wrapper.style.marginBottom = '10px';
        
        // Get colors from Config
        const colors = Config.colorPalette || [
            "#FFEB3B", "#4CAF50", "#3A8C8C", "#2A7E7E", "#3F51B5", "#1A237E",
            "#5E1D85", "#AB4A8E", "#D54A4A", "#E53935", "#FF9800", "#FFB74D"
        ];
        
        // Create color swatches
        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-palette-swatch';
            swatch.style.backgroundColor = color;
            swatch.style.height = '30px';
            swatch.style.borderRadius = '4px';
            swatch.style.cursor = 'pointer';
            swatch.style.border = '1px solid #444';
            
            // Store color as data attribute
            swatch.dataset.color = color;
            
            // Add hover effect
            swatch.addEventListener('mouseover', () => {
                swatch.style.transform = 'scale(1.05)';
                swatch.style.transition = 'transform 0.1s ease-in-out';
            });
            
            swatch.addEventListener('mouseout', () => {
                swatch.style.transform = 'scale(1)';
            });
            
            // Add click handler
            swatch.addEventListener('click', handleColorClick);
            
            wrapper.appendChild(swatch);
        });
        
        // Add palette to container
        paletteContainer.appendChild(wrapper);
    }
    
    /**
     * Handle color swatch click
     * @param {Event} e - Click event
     */
    function handleColorClick(e) {
        const color = e.target.dataset.color;
        
        if (color && onColorSelected) {
            onColorSelected(color);
        }
    }
    
    /**
     * Set a new callback function
     * @param {Function} callback - Callback function
     */
    function setCallback(callback) {
        onColorSelected = callback;
    }
    
    // Public API
    return {
        init,
        createColorPalette,
        setCallback
    };
})();

// Export for use in other modules
window.ColorPaletteComponent = ColorPaletteComponent;