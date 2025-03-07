/**
 * Color picker functionality for the Emotion Visualization App
 */

// DOM References
const colorPickerContainer = document.getElementById('color-picker-container');

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
    
    // Create color picker container
    const picker = document.createElement('div');
    picker.className = 'color-picker';
    
    // Position the picker
    const rect = target.getBoundingClientRect();
    picker.style.top = `${rect.bottom + 5}px`;
    picker.style.left = `${rect.left}px`;
    
    // Create color canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'color-canvas';
    canvas.width = 180;
    canvas.height = 180;
    
    // Create preview elements
    const preview = document.createElement('div');
    preview.className = 'color-preview';
    
    const previewBox = document.createElement('div');
    previewBox.className = 'preview-box';
    previewBox.style.backgroundColor = currentColor;
    
    const colorValue = document.createElement('span');
    colorValue.className = 'color-value';
    colorValue.textContent = currentColor.toUpperCase();
    
    preview.appendChild(previewBox);
    preview.appendChild(colorValue);
    
    picker.appendChild(canvas);
    picker.appendChild(preview);
    colorPickerContainer.appendChild(picker);
    
    // Draw color spectrum
    drawColorSpectrum(canvas);
    
    // Add click handler to select colors
    canvas.addEventListener('click', (e) => {
        const color = getColorFromCanvas(canvas, e);
        
        // Update preview
        previewBox.style.backgroundColor = color;
        colorValue.textContent = color.toUpperCase();
        
        // Call the callback
        if (onColorSelected) {
            onColorSelected(emotion, property, color);
        }
    });
    
    // Close picker when clicking outside
    document.addEventListener('mousedown', function closePickerHandler(e) {
        if (!e.target.closest('.color-picker') && !e.target.closest('.color-box')) {
            colorPickerContainer.innerHTML = '';
            document.removeEventListener('mousedown', closePickerHandler);
        }
    });
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
    return rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
}
