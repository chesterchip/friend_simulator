/**
 * Color picker module for the Emotion Visualization App
 */

const ColorPicker = (function() {
    // DOM References
    const colorPickerContainer = document.getElementById('color-picker-container');
    
    // State tracking
    let currentTarget = null;
    let currentCallback = null;
    
    /**
     * Create and display a color picker
     * @param {Element} target - The clicked color box element
     * @param {string} emotion - The emotion being edited
     * @param {string} property - The property being edited (bg/text)
     * @param {string} currentColor - The current color value
     * @param {Function} onColorSelected - Callback when color is selected
     */
    function createColorPicker(target, emotion, property, currentColor, onColorSelected) {
        // Clear any existing pickers
        colorPickerContainer.innerHTML = '';
        
        // Save references for event handlers
        currentTarget = target;
        currentCallback = onColorSelected;
        
        // Create color picker container
        const picker = DOMUtils.createElement('div', { className: 'color-picker' });
        
        // Position the picker
        const rect = target.getBoundingClientRect();
        DOMUtils.setStyles(picker, {
            top: `${rect.bottom + 5}px`,
            left: `${rect.left}px`,
            width: '220px'
        });
        
        // Create color canvas
        const canvas = DOMUtils.createElement('canvas', { 
            className: 'color-canvas',
            width: 200,
            height: 200
        });
        
        // Create preview elements
        const preview = DOMUtils.createElement('div', { className: 'color-preview' });
        
        const previewBox = DOMUtils.createElement('div', { 
            className: 'preview-box',
            style: { backgroundColor: currentColor }
        });
        
        const colorValue = DOMUtils.createElement('span', { 
            className: 'color-value' 
        }, currentColor.toUpperCase());
        
        preview.appendChild(previewBox);
        preview.appendChild(colorValue);
        
        // Create color palette section
        const paletteSection = DOMUtils.createElement('div', {
            className: 'color-palette-section',
            style: {
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '4px'
            }
        });
        
        // Add palette colors
        const colors = Config.colorPalette || [
            "#FFEB3B", "#4CAF50", "#3A8C8C", "#2A7E7E", "#3F51B5", "#1A237E",
            "#5E1D85", "#AB4A8E", "#D54A4A", "#E53935", "#FF9800", "#FFB74D"
        ];
        
        colors.forEach(color => {
            const swatch = DOMUtils.createElement('div', {
                className: 'color-swatch',
                style: {
                    backgroundColor: color,
                    width: '100%',
                    height: '24px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    border: '1px solid #444'
                },
                onclick: () => handlePaletteColorSelection(color)
            });
            
            paletteSection.appendChild(swatch);
        });
        
        // Assemble the color picker
        picker.appendChild(canvas);
        picker.appendChild(preview);
        picker.appendChild(paletteSection);
        colorPickerContainer.appendChild(picker);
        
        // Draw color spectrum
        drawColorSpectrum(canvas);
        
        // Add click handler to select colors from the canvas
        canvas.addEventListener('click', (e) => {
            const color = getColorFromCanvas(canvas, e);
            updateSelectedColor(color);
        });
        
        // Close picker when clicking outside
        document.addEventListener('mousedown', closePickerHandler);
    }
    
    /**
     * Handle color selection from the palette
     * @param {string} color - The selected color
     */
    function handlePaletteColorSelection(color) {
        updateSelectedColor(color);
    }
    
    /**
     * Update the selected color in the preview and call the callback
     * @param {string} color - The selected color
     */
    function updateSelectedColor(color) {
        // Find preview box and update it
        const previewBox = colorPickerContainer.querySelector('.preview-box');
        const colorValue = colorPickerContainer.querySelector('.color-value');
        
        if (previewBox) {
            previewBox.style.backgroundColor = color;
        }
        
        if (colorValue) {
            colorValue.textContent = color.toUpperCase();
        }
        
        // Call the callback
        if (currentCallback && currentTarget) {
            // Extract emotion and property from currentTarget
            const emotion = currentTarget.dataset.emotion;
            const property = currentTarget.dataset.property;
            
            // Call callback with color
            currentCallback(emotion, property, color);
        }
    }
    
    /**
     * Handler for closing the color picker
     */
    function closePickerHandler(e) {
        if (!e.target.closest('.color-picker') && !e.target.closest('.color-box')) {
            colorPickerContainer.innerHTML = '';
            document.removeEventListener('mousedown', closePickerHandler);
        }
    }

    /**
     * Draw the color spectrum on the canvas
     * @param {HTMLCanvasElement} canvas - The canvas element
     */
    function drawColorSpectrum(canvas) {
        const ctx = canvas.getContext('2d');
        
        // Create horizontal color spectrum using gradient
        const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradientH.addColorStop(0, '#FF0000'); // Red
        gradientH.addColorStop(1/6, '#FFFF00'); // Yellow
        gradientH.addColorStop(2/6, '#00FF00'); // Green
        gradientH.addColorStop(3/6, '#00FFFF'); // Cyan
        gradientH.addColorStop(4/6, '#0000FF'); // Blue
        gradientH.addColorStop(5/6, '#FF00FF'); // Magenta
        gradientH.addColorStop(1, '#FF0000'); // Red
        
        ctx.fillStyle = gradientH;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add white to black vertical gradient
        const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradientV.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradientV.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        gradientV.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradientV.addColorStop(1, 'rgba(0, 0, 0, 1)');
        
        ctx.fillStyle = gradientV;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Get color from canvas at a specific point
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {MouseEvent} event - The mouse event
     * @returns {string} The selected color as a hex string
     */
    function getColorFromCanvas(canvas, event) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        return ColorUtils.rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    }
    
    // Public API
    return {
        createColorPicker
    };
})();

// Export for use in other modules
window.ColorPicker = ColorPicker;