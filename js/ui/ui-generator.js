/**
 * UI Generator for Emotion Visualization App
 * Dynamically creates UI elements based on configuration
 */

const UIGenerator = (function() {
    /**
     * Generate gradient animation controls
     */
    function generateGradientAnimationControls() {
        const animationControlsContainer = document.getElementById('gradient-animation-controls');
        if (!animationControlsContainer) return;
        
        // Create animation speed control
        const animationSpeedControl = createSliderControl({
            id: 'animation-speed',
            label: 'Animation Speed',
            valueId: 'animation-speed-value',
            defaultValue: Config.defaultValues.animationSpeed,
            min: 0,
            max: 100
        });
        
        animationControlsContainer.appendChild(animationSpeedControl);
    }

    /**
     * Generate text controls based on configuration
     */
    function generateTextControls() {
        const textControlsContainer = document.getElementById('text-controls');
        if (!textControlsContainer) return;
        
        const controls = [
            {
                column: 'left',
                controls: [
                    {
                        type: 'dropdown',
                        id: 'font-family',
                        label: 'Font Family',
                        options: [
                            'SF Pro', 'SF Pro Rounded', 'Arial', 'Helvetica', 'Roboto',
                            'Open Sans', 'Montserrat', 'Lato', 'Poppins', 'Inter',
                            'Georgia', 'Times New Roman', 'Merriweather', 'Playfair Display',
                            'Garamond', 'Baskerville', 'Proxima Nova', 'Futura', 'Gill Sans', 'Verdana'
                        ],
                        defaultValue: Config.defaultValues.fontFamily
                    },
                    {
                        id: 'font-size',
                        label: 'Font Size',
                        valueId: 'font-size-value',
                        defaultValue: Config.defaultValues.fontSize,
                        min: 0,
                        max: 100
                    },
                    {
                        id: 'font-kerning',
                        label: 'Font Kerning',
                        valueId: 'font-kerning-value',
                        defaultValue: Config.defaultValues.fontKerning,
                        min: 0,
                        max: 100
                    }
                ]
            },
            {
                column: 'right',
                controls: [
                    {
                        type: 'dropdown',
                        id: 'font-style',
                        label: 'Font Style',
                        options: ['normal', 'bold', 'italic', 'underline', 'bold-italic'],
                        defaultValue: Config.defaultValues.fontStyle
                    },
                    {
                        id: 'font-weight',
                        label: 'Font Weight',
                        valueId: 'font-weight-value',
                        defaultValue: Config.defaultValues.fontWeight,
                        min: 0,
                        max: 100
                    },
                    {
                        id: 'line-height',
                        label: 'Line Height',
                        valueId: 'line-height-value',
                        defaultValue: Config.defaultValues.lineHeight,
                        min: 0,
                        max: 100
                    }
                ]
            }
        ];
        
        // Create left and right columns
        const leftColumn = document.createElement('div');
        leftColumn.className = 'text-controls-column';
        
        const rightColumn = document.createElement('div');
        rightColumn.className = 'text-controls-column';
        
        // Generate controls for each column
        controls.forEach(column => {
            const columnElement = column.column === 'left' ? leftColumn : rightColumn;
            
            column.controls.forEach(control => {
                if (control.type === 'dropdown') {
                    const dropdownContainer = createDropdownControl(control);
                    columnElement.appendChild(dropdownContainer);
                } else {
                    const sliderContainer = createSliderControl(control);
                    columnElement.appendChild(sliderContainer);
                }
            });
        });
        
        // Add columns to container
        textControlsContainer.appendChild(leftColumn);
        textControlsContainer.appendChild(rightColumn);
    }
    
/**
 * Generate transition controls based on configuration
 */
function generateTransitionControls() {
    const transitionControlsContainer = document.getElementById('transition-controls');
    if (!transitionControlsContainer) return;
    
    const controls = [
        {
            id: 'transition-speed',
            label: 'Text Typing Speed',
            valueId: 'transition-speed-value',
            defaultValue: Config.defaultValues.transitionSpeed,
            min: 0,
            max: 50
        },
        {
            id: 'bg-transition-speed',
            label: 'Background Transition',
            valueId: 'bg-transition-speed-value',
            defaultValue: Config.defaultValues.backgroundTransitionSpeed,
            min: 100,
            max: 2000,
            step: 50,
            unit: 'ms'
        },
        {
            id: 'gradient-color-transition-speed',
            label: 'Gradient Color Speed',
            valueId: 'gradient-color-transition-speed-value',
            defaultValue: Config.defaultValues.gradientColorTransitionSpeed,
            min: 100,
            max: 2000,
            step: 50,
            unit: 'ms'
        },
        {
            id: 'text-color-transition-speed',
            label: 'Text Color Speed',
            valueId: 'text-color-transition-speed-value',
            defaultValue: Config.defaultValues.textColorTransitionSpeed,
            min: 100,
            max: 2000,
            step: 50,
            unit: 'ms'
        }
    ];
    
    // Generate controls in a 2x2 grid
    controls.forEach(control => {
        const sliderContainer = createSliderControl(control);
        transitionControlsContainer.appendChild(sliderContainer);
    });
}
    
    /**
     * Generate layer controls based on configuration
     */
    function generateLayerControls() {
        const layerControlsContainer = document.getElementById('layer-controls');
        if (!layerControlsContainer) return;
        
        const layers = [
            {
                id: 'distortion',
                name: 'Distortions',
                thumbnailId: 'distortion-layer-thumbnail',
                opacity: {
                    id: 'distortion-intensity',
                    valueId: 'distortion-intensity-value',
                    defaultValue: Config.defaultValues.distortionIntensity
                },
                dropdown: {
                    id: 'distortion-effect',
                    options: ['none', 'filmGrain', 'noise', 'scanlines', 'glitch', 'blur', 'warp', 'pixelate']
                },
                hasExtendedOptions: true,
                extendedOptions: [
                    { id: 'distort-text', label: 'Apply to Text', defaultValue: Config.defaultValues.distortText },
                    { id: 'distort-gradient', label: 'Apply to Gradient', defaultValue: Config.defaultValues.distortGradient },
                    { id: 'distort-background', label: 'Apply to Background', defaultValue: Config.defaultValues.distortBackground }
                ]
            },
            {
                id: 'text',
                name: 'Text',
                thumbnailId: 'text-layer-thumbnail',
                opacity: {
                    id: 'text-opacity',
                    valueId: 'text-opacity-value',
                    defaultValue: Config.defaultValues.textOpacity
                },
                dropdown: {
                    id: 'text-blend-mode',
                    options: [
                        'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
                        'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
                        'exclusion', 'hue', 'saturation', 'color', 'luminosity'
                    ]
                }
            },
            {
                id: 'gradient',
                name: 'Gradient',
                thumbnailId: 'gradient-layer-thumbnail',
                opacity: {
                    id: 'gradient-opacity',
                    valueId: 'gradient-opacity-value',
                    defaultValue: Config.defaultValues.gradientOpacity
                },
                dropdown: {
                    id: 'gradient-blend-mode',
                    options: [
                        'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
                        'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
                        'exclusion', 'hue', 'saturation', 'color', 'luminosity'
                    ]
                }
            },
            {
                id: 'background',
                name: 'Background',
                thumbnailId: 'background-layer-thumbnail',
                opacity: {
                    id: 'background-opacity',
                    valueId: 'background-opacity-value',
                    defaultValue: Config.defaultValues.backgroundOpacity
                },
                dropdown: {
                    id: 'background-blend-mode',
                    options: [
                        'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
                        'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
                        'exclusion', 'hue', 'saturation', 'color', 'luminosity'
                    ]
                }
            }
        ];
        
        // Generate layer items
        layers.forEach(layer => {
            const layerItem = createLayerItem(layer);
            layerControlsContainer.appendChild(layerItem);
        });
    }
    
    /**
     * Create a slider control
     * @param {Object} config - Slider configuration
     * @returns {HTMLElement} Slider container element
     */
    function createSliderControl(config) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        const sliderHeader = document.createElement('div');
        sliderHeader.className = 'slider-header';
        
        const sliderLabel = document.createElement('span');
        sliderLabel.className = 'slider-label';
        sliderLabel.textContent = config.label;
        
        const sliderValue = document.createElement('span');
        sliderValue.className = 'slider-value';
        sliderValue.id = config.valueId;
        sliderValue.textContent = config.defaultValue + (config.unit || '');
        
        // Add reset button if needed
        if (config.hasResetButton) {
            const resetButton = document.createElement('button');
            resetButton.className = 'reset-button';
            resetButton.id = 'reset-' + config.id;
            resetButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
            
            sliderHeader.appendChild(sliderLabel);
            sliderHeader.appendChild(resetButton);
            sliderHeader.appendChild(sliderValue);
        } else {
            sliderHeader.appendChild(sliderLabel);
            sliderHeader.appendChild(sliderValue);
        }
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = config.id;
        slider.className = 'slider';
        slider.min = config.min;
        slider.max = config.max;
        slider.value = config.defaultValue;
        if (config.step) slider.step = config.step;
        
        sliderContainer.appendChild(sliderHeader);
        sliderContainer.appendChild(slider);
        
        return sliderContainer;
    }
    
    /**
     * Create a dropdown control
     * @param {Object} config - Dropdown configuration
     * @returns {HTMLElement} Dropdown container element
     */
    function createDropdownControl(config) {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'slider-container';
        
        const dropdownHeader = document.createElement('div');
        dropdownHeader.className = 'slider-header';
        
        const dropdownLabel = document.createElement('span');
        dropdownLabel.className = 'slider-label';
        dropdownLabel.textContent = config.label;
        
        dropdownHeader.appendChild(dropdownLabel);
        
        const dropdown = document.createElement('select');
        dropdown.id = config.id;
        dropdown.className = 'dropdown';
        
        config.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, ' ');
            if (option === config.defaultValue) {
                optionElement.selected = true;
            }
            dropdown.appendChild(optionElement);
        });
        
        dropdownContainer.appendChild(dropdownHeader);
        dropdownContainer.appendChild(dropdown);
        
        return dropdownContainer;
    }
    
/**
 * Create a layer control item
 * @param {Object} config - Layer configuration
 * @returns {HTMLElement} Layer item element
 */
function createLayerItem(config) {
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item compact'; // Always use compact style
    
    const layerHeader = document.createElement('div');
    layerHeader.className = 'layer-header';
    
    const layerTitle = document.createElement('div');
    layerTitle.className = 'layer-title';
    
    // Thumbnail
    const thumbnail = document.createElement('div');
    thumbnail.id = config.thumbnailId;
    thumbnail.className = 'layer-thumbnail';
    
    // Default thumbnail content
    if (config.id === 'distortion') {
        thumbnail.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="70" fill="#888888"><path d="M21 17v-6.9L12 15 3 10.1V17h18zm0-9c0-.5-.4-1-1-1H4c-.5 0-1 .5-1 1v1.1L12 13l9-4.9V8zm-1-3H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/></svg>';
    } else if (config.id === 'text') {
        thumbnail.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="70" fill="#ffffff"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>';
    } else if (config.id === 'gradient') {
        thumbnail.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="70"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(0,0,255);stop-opacity:1" /></linearGradient></defs><rect width="24" height="24" fill="url(#grad)" /></svg>';
    } else if (config.id === 'background') {
        thumbnail.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="70" fill="#333333"><rect width="24" height="24" /></svg>';
    }
    
    const layerControlsRight = document.createElement('div');
    layerControlsRight.className = 'layer-controls-right';
    
    const layerHeaderTop = document.createElement('div');
    layerHeaderTop.className = 'layer-header-top';
    
    // Visibility toggle
    const visibilityToggle = document.createElement('button');
    visibilityToggle.className = 'visibility-toggle';
    visibilityToggle.id = `${config.id}-visibility-toggle`;
    visibilityToggle.title = 'Toggle visibility';
    visibilityToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';
    
    const layerName = document.createElement('span');
    layerName.className = 'layer-name';
    layerName.textContent = config.name;
    
    const opacityValue = document.createElement('span');
    opacityValue.className = 'layer-opacity-value';
    opacityValue.id = config.opacity.valueId;
    opacityValue.textContent = config.opacity.defaultValue + '%';
    
    layerHeaderTop.appendChild(visibilityToggle);
    layerHeaderTop.appendChild(layerName);
    layerHeaderTop.appendChild(opacityValue);
    
    const layerOptions = document.createElement('div');
    layerOptions.className = 'layer-options horizontal';
    
    const layerSlider = document.createElement('div');
    layerSlider.className = 'layer-slider';
    
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.id = config.opacity.id;
    opacitySlider.className = 'slider';
    opacitySlider.min = 0;
    opacitySlider.max = 100;
    opacitySlider.value = config.opacity.defaultValue;
    
    layerSlider.appendChild(opacitySlider);
    const dropdown = document.createElement('select');
    dropdown.id = config.dropdown.id;
    dropdown.className = 'dropdown';
    
    config.dropdown.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, ' ');
        dropdown.appendChild(optionElement);
    });
    
    layerOptions.appendChild(layerSlider);
    layerOptions.appendChild(dropdown);
    
    layerControlsRight.appendChild(layerHeaderTop);
    layerControlsRight.appendChild(layerOptions);
    
    layerTitle.appendChild(thumbnail);
    layerTitle.appendChild(layerControlsRight);
    
    layerHeader.appendChild(layerTitle);
    layerItem.appendChild(layerHeader);
    
    // Add extended options if needed
    if (config.hasExtendedOptions && config.extendedOptions) {
        const extendedOptions = document.createElement('div');
        extendedOptions.className = 'distortion-layer-options';
        
        config.extendedOptions.forEach(option => {
            const checkbox = document.createElement('div');
            checkbox.className = 'distortion-layer-checkbox';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = option.id;
            input.checked = option.defaultValue;
            
            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.label;
            
            checkbox.appendChild(input);
            checkbox.appendChild(label);
            extendedOptions.appendChild(checkbox);
        });
        
        layerItem.appendChild(extendedOptions);
    }
    
    return layerItem;
}
    
    /**
     * Initialize all UI controls
     */
    function init() {
        generateGradientAnimationControls();
        generateAdvancedGradientControls();
        generateTextControls();
        generateTransitionControls();
        generateLayerControls();
    }
    
    /**
     * Generate advanced gradient controls
     */
    function generateAdvancedGradientControls() {
        const advancedGradientContainer = document.getElementById('advanced-gradient-controls');
        if (!advancedGradientContainer) return;
        
        // Set up default advanced gradient values in Config if not already there
if (!Config.defaultValues.advancedGradient) {
    Config.defaultValues.advancedGradient = {
        type: 'dual-radial',
        point1: { x: 50, y: 30, size: 40 },  // <-- CHANGE 40 TO 20 HERE
        point2: { x: 50, y: 70, size: 40 },  // <-- CHANGE 40 TO 20 HERE
        glow: 50,
        bloom: 30,
        blend: 50,
        colors: {
            primary: '#ff5e3a',
            secondary: '#ff2a68',
            background: '#4b00c8'
        }
    };
}
        
        // Also ensure it's in the visualization manager settings
        if (VisualizationManager && VisualizationManager.settings) {
            if (!VisualizationManager.settings.advancedGradient) {
                VisualizationManager.settings.advancedGradient = { ...Config.defaultValues.advancedGradient };
            }
        }
        
        // Initialize event listeners for controls
        initAdvancedGradientListeners();
        
        // Update visibility of secondary point based on gradient type
        updateSecondaryPointVisibility();
    }
    
    /**
     * Initialize event listeners for advanced gradient controls
     */
    function initAdvancedGradientListeners() {
        // Gradient type change
        const gradientTypeSelect = document.getElementById('gradient-type');
        if (gradientTypeSelect) {
            gradientTypeSelect.addEventListener('change', function() {
                updateSecondaryPointVisibility();
                updateAdvancedGradient();
            });
        }
        
        // Position sliders
        setupRangeSlider('gradient-point1-x', 'gradient-point1-x-value', updateAdvancedGradient);
        setupRangeSlider('gradient-point1-y', 'gradient-point1-y-value', updateAdvancedGradient);
        setupRangeSlider('gradient-point1-size', 'gradient-point1-size-value', updateAdvancedGradient);
        setupRangeSlider('gradient-point2-x', 'gradient-point2-x-value', updateAdvancedGradient);
        setupRangeSlider('gradient-point2-y', 'gradient-point2-y-value', updateAdvancedGradient);
        setupRangeSlider('gradient-point2-size', 'gradient-point2-size-value', updateAdvancedGradient);
        
        // Effect sliders
        setupRangeSlider('gradient-glow', 'gradient-glow-value', updateAdvancedGradient);
        setupRangeSlider('gradient-bloom', 'gradient-bloom-value', updateAdvancedGradient);
        setupRangeSlider('gradient-blend', 'gradient-blend-value', updateAdvancedGradient);
        
        // Color pickers
        setupColorPicker('gradient-color1', 'primary');
        setupColorPicker('gradient-color2', 'secondary');
        setupColorPicker('gradient-color-bg', 'background');
        
        // Color source dropdowns
        setupColorSourceDropdown('gradient-color1-source', 'gradient-color1', 'primary');
        setupColorSourceDropdown('gradient-color2-source', 'gradient-color2', 'secondary');
        setupColorSourceDropdown('gradient-color-bg-source', 'gradient-color-bg', 'background');
    }
    
    /**
     * Set up color source dropdown for linking emotions to gradient colors
     * @param {string} dropdownId - ID of the dropdown element
     * @param {string} colorBoxId - ID of the associated color box
     * @param {string} colorType - Type of color (primary, secondary, background)
     */
    function setupColorSourceDropdown(dropdownId, colorBoxId, colorType) {
        const dropdown = document.getElementById(dropdownId);
        const colorBox = document.getElementById(colorBoxId);
        
        if (dropdown && colorBox) {
            dropdown.addEventListener('change', function() {
                const source = this.value;
                let color;
                
                // Get emotion state from analyzer
                const emotionState = EmotionAnalyzer.getCurrentState();
                
                // Set color based on dropdown selection
                if (source === 'primary') {
                    // Use primary emotion background color
                    color = Config.emotions[emotionState.currentEmotion]?.bg || "#FF0000";
                } else if (source === 'secondary') {
                    // Use secondary emotion background color
                    color = Config.emotions[emotionState.secondaryEmotion]?.bg || "#0000FF";
                } else {
                    // Use custom color (keep current color)
                    color = colorBox.style.backgroundColor;
                }
                
                // Update color box
                colorBox.style.backgroundColor = color;
                
                // Store the color in Config
                if (!Config.defaultValues.advancedGradient) {
                    Config.defaultValues.advancedGradient = {};
                }
                if (!Config.defaultValues.advancedGradient.colors) {
                    Config.defaultValues.advancedGradient.colors = {};
                }
                Config.defaultValues.advancedGradient.colors[colorType] = color;
                
                // Update advanced gradient
                updateAdvancedGradient();
            });
        }
    }
    
    /**
     * Update secondary point visibility based on gradient type
     */
    function updateSecondaryPointVisibility() {
        const gradientType = document.getElementById('gradient-type').value;
        const secondaryPointControls = document.getElementById('secondary-point-controls');
        
        if (secondaryPointControls) {
            secondaryPointControls.style.display = gradientType === 'dual-radial' ? 'block' : 'none';
        }
    }
    
    /**
     * Set up a range slider with value display
     */
    function setupRangeSlider(sliderId, valueId, callback) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
                if (callback) callback();
            });
        }
    }
    
    /**
     * Set up color picker for gradient colors
     */
    function setupColorPicker(elementId, colorType) {
        const colorBox = document.getElementById(elementId);
        
        if (colorBox) {
            colorBox.addEventListener('click', function() {
                // Use the existing color picker from the app
                ColorPicker.createColorPicker(
                    colorBox, 
                    'advancedGradient', 
                    colorType, 
                    this.style.backgroundColor,
                    function(_, colorType, color) {
                        // Update the color box
                        colorBox.style.backgroundColor = color;
                        
                        // Store the color in Config
                        if (!Config.defaultValues.advancedGradient) {
                            Config.defaultValues.advancedGradient = {};
                        }
                        if (!Config.defaultValues.advancedGradient.colors) {
                            Config.defaultValues.advancedGradient.colors = {};
                        }
                        Config.defaultValues.advancedGradient.colors[colorType] = color;
                        
                        // Update the gradient
                        updateAdvancedGradient();
                    }
                );
            });
        }
    }
    
    /**
     * Update advanced gradient values and trigger visualization update
     */
    function updateAdvancedGradient() {
        console.log("updateAdvancedGradient called");
        
        // Get current values from UI
        const values = {
            type: document.getElementById('gradient-type').value,
            point1: {
                x: parseInt(document.getElementById('gradient-point1-x').value),
                y: parseInt(document.getElementById('gradient-point1-y').value),
                size: parseInt(document.getElementById('gradient-point1-size').value)
            },
            point2: {
                x: parseInt(document.getElementById('gradient-point2-x').value),
                y: parseInt(document.getElementById('gradient-point2-y').value),
                size: parseInt(document.getElementById('gradient-point2-size').value)
            },
            glow: parseInt(document.getElementById('gradient-glow').value),
            bloom: parseInt(document.getElementById('gradient-bloom').value),
            blend: parseInt(document.getElementById('gradient-blend').value),
            colors: {
                primary: getComputedStyle(document.getElementById('gradient-color1')).backgroundColor,
                secondary: getComputedStyle(document.getElementById('gradient-color2')).backgroundColor,
                background: getComputedStyle(document.getElementById('gradient-color-bg')).backgroundColor
            }
        };
        
        console.log("Advanced gradient updated with:", values);
        
        // Update the configuration
        Config.defaultValues.advancedGradient = values;
        
        // IMPORTANT: Directly update the VisualizationManager's settings to ensure changes take effect
        if (VisualizationManager && VisualizationManager.settings) {
            VisualizationManager.settings.advancedGradient = { ...values };
            console.log("Updated VisualizationManager.settings.advancedGradient");
        }
        
        // Trigger visualization update
        if (VisualizationManager && VisualizationManager.updateDisplay) {
            console.log("Calling VisualizationManager.updateDisplay()");
            VisualizationManager.updateDisplay();
        } else {
            console.error("VisualizationManager or updateDisplay not available");
        }
    }
    
    // Public API
    return {
        init,
        generateGradientAnimationControls,
        generateAdvancedGradientControls,
        generateTextControls,
        generateTransitionControls,
        generateLayerControls
    };
})();

// Export for use in other modules
window.UIGenerator = UIGenerator;