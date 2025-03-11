/**
 * Color Controls for the Emotion Visualization App
 * Handles color table UI and related controls
 */

const ColorControls = (function() {
    // DOM References
    const colorTableBody = document.getElementById('color-table-body');
    const colorsPanelContent = document.getElementById('colors-panel-content');
    
    // Current target for color selection
    let currentColorTarget = null;
    
    /**
     * Initialize color table and controls
     */
    function init() {
        refreshColorTable();
        initColorPalette();
    }
    
    /**
     * Initialize color palette component
     */
    function initColorPalette() {
        // Create container for color palette if it doesn't exist
        let paletteContainer = document.getElementById('color-palette-container');
        if (!paletteContainer && colorsPanelContent) {
            // Create palette header with title
            const paletteLabel = document.createElement('h3');
            paletteLabel.textContent = 'Color Palette (click to edit)';
            paletteLabel.style.fontSize = '14px';
            paletteLabel.style.fontWeight = '500';
            paletteLabel.style.color = '#bbb';
            paletteLabel.style.marginTop = '20px';
            paletteLabel.style.marginBottom = '8px';
            
            // Create palette container
            paletteContainer = document.createElement('div');
            paletteContainer.id = 'color-palette-container';
            
            // Add both elements to colors panel
            colorsPanelContent.appendChild(paletteLabel);
            colorsPanelContent.appendChild(paletteContainer);
            
            // Create the palette display
            createColorPalette(paletteContainer);
        }
    }
    
    /**
     * Create color palette display
     * @param {HTMLElement} container - Container element
     */
    function createColorPalette(container) {
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create color palette wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'color-palette-wrapper';
        wrapper.style.display = 'grid';
        wrapper.style.gridTemplateColumns = 'repeat(6, 1fr)';
        wrapper.style.gap = '4px';
        wrapper.style.marginBottom = '15px';
        
        // Get colors from Config
        const colors = Config.colorPalette || [
            "#FFEB3B", "#4CAF50", "#3A8C8C", "#2A7E7E", "#3F51B5", "#1A237E",
            "#5E1D85", "#AB4A8E", "#D54A4A", "#E53935", "#FF9800", "#FFB74D"
        ];
        
        // Create color swatches
        colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-palette-swatch';
            swatch.style.backgroundColor = color;
            swatch.style.height = '30px';
            swatch.style.borderRadius = '4px';
            swatch.style.cursor = 'pointer';
            swatch.style.border = '1px solid #444';
            
            // Store color and index as data attributes
            swatch.dataset.color = color;
            swatch.dataset.index = index;
            
            // Add hover effect
            swatch.addEventListener('mouseover', () => {
                swatch.style.transform = 'scale(1.05)';
                swatch.style.transition = 'transform 0.1s ease-in-out';
            });
            
            swatch.addEventListener('mouseout', () => {
                swatch.style.transform = 'scale(1)';
            });
            
            // Add click handlers depending on whether we have a current target
            swatch.addEventListener('click', (e) => {
                if (currentColorTarget) {
                    // If we have a target, use the palette color
                    handlePaletteColorSelect(e);
                } else {
                    // If no target, allow editing the palette color
                    handlePaletteColorEdit(e);
                }
            });
            
            wrapper.appendChild(swatch);
        });
        
        // Add palette to container
        container.appendChild(wrapper);
    }
    
    /**
     * Handle selection of a palette color for a color box
     * @param {Event} e - Click event
     */
    function handlePaletteColorSelect(e) {
        const color = e.target.dataset.color;
        
        if (color && currentColorTarget) {
            // Get data from target
            const emotion = currentColorTarget.dataset.emotion;
            const property = currentColorTarget.dataset.property;
            
            // Apply color change
            Config.emotions[emotion][property] = color;
            
            // Update color box
            currentColorTarget.style.backgroundColor = color;
            
            // Update display
            VisualizationManager.updateDisplay();
            
            // Reset current target
            currentColorTarget = null;
        }
    }
    
    /**
     * Handle editing a palette color
     * @param {Event} e - Click event
     */
    function handlePaletteColorEdit(e) {
        const index = parseInt(e.target.dataset.index);
        const currentColor = e.target.dataset.color;
        
        // Create a mock target with palette information
        const mockTarget = {
            getBoundingClientRect: () => e.target.getBoundingClientRect(),
            dataset: {
                emotion: 'palette',
                property: index.toString()
            }
        };
        
        // Show color picker for this palette color
        ColorPicker.createColorPicker(mockTarget, 'palette', index.toString(), currentColor, 
            (_, propIndex, color) => {
                // Update the color in the Config
                const colorIndex = parseInt(propIndex);
                Config.colorPalette[colorIndex] = color;
                
                // Update the swatch
                e.target.style.backgroundColor = color;
                e.target.dataset.color = color;
                
                // Refresh all UI elements that might use this color
                refreshColorTable();
            }
        );
    }
    
    /**
     * Refresh the entire color table UI
     */
    function refreshColorTable() {
        if (!colorTableBody) return;
        
        colorTableBody.innerHTML = '';
        
        Object.keys(Config.emotions).forEach(emotion => {
            const row = createEmotionRow(emotion);
            colorTableBody.appendChild(row);
        });
        
        // Also refresh the color palette
        const paletteContainer = document.getElementById('color-palette-container');
        if (paletteContainer) {
            createColorPalette(paletteContainer);
        }
    }
    
    /**
     * Create a table row for an emotion
     * @param {string} emotion - Emotion name
     * @returns {HTMLTableRowElement} Table row element
     */
    function createEmotionRow(emotion) {
        const row = document.createElement('tr');
        
        // Emotion name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = emotion;
        row.appendChild(nameCell);
        
        // Background color cell
        const bgCell = document.createElement('td');
        const bgBox = document.createElement('div');
        bgBox.className = 'color-box';
        bgBox.style.backgroundColor = Config.emotions[emotion].bg;
        bgBox.dataset.emotion = emotion;
        bgBox.dataset.property = 'bg';
        bgBox.addEventListener('click', handleColorBoxClick);
        bgCell.appendChild(bgBox);
        row.appendChild(bgCell);
        
        // Text color cell
        const textCell = document.createElement('td');
        const textBox = document.createElement('div');
        textBox.className = 'color-box';
        textBox.style.backgroundColor = Config.emotions[emotion].text;
        textBox.dataset.emotion = emotion;
        textBox.dataset.property = 'text';
        textBox.addEventListener('click', handleColorBoxClick);
        textCell.appendChild(textBox);
        row.appendChild(textCell);
        
        // Animation select cell
        const animationCell = document.createElement('td');
        const select = document.createElement('select');
        select.className = 'dropdown';
        select.id = `anim-select-${emotion}`;
        
        Config.animationOptions.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option;
            optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            if (option === Config.emotions[emotion].animation) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });
        
        animationCell.appendChild(select);
        row.appendChild(animationCell);
        
        // Animation settings cell (intensity and duration)
        const settingsCell = document.createElement('td');
        settingsCell.id = `settings-cell-${emotion}`;
        row.appendChild(settingsCell);
        
        // Initialize animation controls for this row
        updateAnimationControls(emotion);
        
        // Set up change listener for animation dropdown
        select.addEventListener('change', (e) => {
            Config.emotions[emotion].animation = e.target.value;
            updateAnimationControls(emotion);
            VisualizationManager.updateDisplay();
        });
        
        return row;
    }
    
    /**
     * Update animation controls based on the current animation setting
     * @param {string} emotion - The emotion to update controls for
     */
    function updateAnimationControls(emotion) {
        const settingsCell = document.getElementById(`settings-cell-${emotion}`);
        if (!settingsCell) return;
        
        const animationType = Config.emotions[emotion].animation;
        
        // Clear existing content
        settingsCell.innerHTML = '';
        
        if (animationType !== 'none') {
            // Create animation controls container
            const animationControls = DOMUtils.createElement('div', { 
                className: 'animation-controls' 
            });
            
            // Intensity slider
            const intensityContainer = DOMUtils.createElement('div', { 
                className: 'slider-container-animation' 
            });
            
            const intensityLabel = DOMUtils.createElement('label', {
                style: {
                    fontSize: '12px',
                    display: 'block',
                    color: '#bbb'
                }
            }, 'Intensity: ' + Config.emotions[emotion].intensity);
            
            const intensitySlider = DOMUtils.createElement('input', {
                type: 'range',
                min: '10',
                max: '100',
                value: Config.emotions[emotion].intensity,
                className: 'animation-slider',
                oninput: (e) => {
                    const value = parseInt(e.target.value);
                    Config.emotions[emotion].intensity = value;
                    intensityLabel.textContent = 'Intensity: ' + value;
                    VisualizationManager.updateDisplay();
                }
            });
            
            intensityContainer.appendChild(intensityLabel);
            intensityContainer.appendChild(intensitySlider);
            
            // Duration slider
            const durationContainer = DOMUtils.createElement('div', { 
                className: 'slider-container-animation' 
            });
            
            const durationLabel = DOMUtils.createElement('label', {
                style: {
                    fontSize: '12px',
                    display: 'block',
                    color: '#bbb'
                }
            }, 'Duration: ' + 
                (Config.emotions[emotion].duration >= 100 ? 'Infinite' : Config.emotions[emotion].duration/10 + 's'));
            
            const durationSlider = DOMUtils.createElement('input', {
                type: 'range',
                min: '1',
                max: '100',
                value: Config.emotions[emotion].duration,
                className: 'animation-slider',
                oninput: (e) => {
                    const value = parseInt(e.target.value);
                    Config.emotions[emotion].duration = value;
                    durationLabel.textContent = 'Duration: ' + 
                        (value >= 100 ? 'Infinite' : value/10 + 's');
                    VisualizationManager.updateDisplay();
                }
            });
            
            durationContainer.appendChild(durationLabel);
            durationContainer.appendChild(durationSlider);
            
            animationControls.appendChild(intensityContainer);
            animationControls.appendChild(durationContainer);
            settingsCell.appendChild(animationControls);
        } else {
            settingsCell.textContent = 'N/A';
            DOMUtils.setStyles(settingsCell, {
                color: '#666',
                fontStyle: 'italic',
                fontSize: '12px',
                textAlign: 'center',
                verticalAlign: 'middle'
            });
        }
    }
    
    /**
     * Handle color box click to show color picker
     * @param {Event} e - Click event
     */
    function handleColorBoxClick(e) {
        const emotion = e.target.dataset.emotion;
        const property = e.target.dataset.property;
        const currentColor = Config.emotions[emotion][property];
        
        // Store the current target for the palette
        currentColorTarget = e.target;
        
        // Show color picker first (traditional method)
        ColorPicker.createColorPicker(e.target, emotion, property, currentColor, (emotion, property, color) => {
            // Apply color change
            Config.emotions[emotion][property] = color;
            
            // Update color box in the UI
            const colorBox = document.querySelector(`.color-box[data-emotion="${emotion}"][data-property="${property}"]`);
            if (colorBox) {
                colorBox.style.backgroundColor = color;
            }
            
            // Update display
            VisualizationManager.updateDisplay();
        });
    }
    
    // Public API
    return {
        init,
        refreshColorTable,
        updateAnimationControls,
        createColorPalette
    };
})();

// Export for use in other modules
window.ColorControls = ColorControls;