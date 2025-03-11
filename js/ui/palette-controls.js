/**
 * Color Palette Controls for the Emotion Visualization App
 * Handles the color palette UI and functionality
 */

const PaletteControls = (function() {
    // DOM references
    const paletteContainer = document.getElementById('palette-colors');
    const leftPaletteContainer = document.getElementById('palette-colors-left');
    
    /**
     * Initialize the palette controls
     */
    function init() {
        refreshPaletteUI();
    }
    
    /**
     * Refresh the palette UI with current colors
     */
    function refreshPaletteUI() {
        // Update both palette containers
        updatePaletteContainer(paletteContainer);
        updatePaletteContainer(leftPaletteContainer);
    }
    
    /**
     * Update a specific palette container
     * @param {HTMLElement} container - The palette container element
     */
    function updatePaletteContainer(container) {
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Get the current palette
        const palette = Config.getColorPalette();
        
        // Create color boxes for each palette color
        palette.forEach((color, index) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'palette-color-box';
            colorBox.style.backgroundColor = color;
            colorBox.dataset.index = index;
            colorBox.title = `Palette Color ${index + 1}`;
            
            // Add click handler to edit the color
            colorBox.addEventListener('click', (e) => handlePaletteColorClick(e, index));
            
            container.appendChild(colorBox);
        });
    }
    
    /**
     * Handle click on a palette color box
     * @param {Event} e - Click event
     * @param {number} index - Color index
     */
    function handlePaletteColorClick(e, index) {
        const currentColor = Config.getColorPalette()[index];
        
        // Use the existing color picker to select a new color
        ColorPicker.createColorPicker(
            e.target, 
            'palette', 
            index, 
            currentColor,
            (_, index, color) => {
                // Update the color in the palette
                Config.updatePaletteColor(index, color);
                
                // Refresh all palette UIs
                refreshPaletteUI();
            }
        );
    }
    
    // Public API
    return {
        init,
        refreshPaletteUI
    };
})();

// Export for use in other modules
window.PaletteControls = PaletteControls;