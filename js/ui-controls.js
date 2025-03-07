/**
 * UI Controls module for the Emotion Visualization App
 * Handles user interface elements, sliders, and buttons
 */

// DOM elements
const emotionInput = document.getElementById('emotion-input');
const clearButton = document.getElementById('clear-btn');
const analyzeButton = document.getElementById('analyze-btn');
const detectedEmotionsContainer = document.getElementById('detected-emotions');
const quickEmotionsContainer = document.getElementById('quick-emotions');
const colorTableBody = document.getElementById('color-table-body');
const fontFamilyDropdown = document.getElementById('font-family');
const fontStyleDropdown = document.getElementById('font-style');

// Layer visibility toggles
const textVisibilityToggle = document.getElementById('text-visibility-toggle');
const gradientVisibilityToggle = document.getElementById('gradient-visibility-toggle');
const backgroundVisibilityToggle = document.getElementById('background-visibility-toggle');

// Slider elements
const animationSpeedSlider = document.getElementById('animation-speed');
const gradientMaxSizeSlider = document.getElementById('gradient-max-size');
const gradientMinSizeSlider = document.getElementById('gradient-min-size');
const gradientFeatherSizeSlider = document.getElementById('gradient-feather-size');
const fontSizeSlider = document.getElementById('font-size');
const fontKerningSlider = document.getElementById('font-kerning');
const fontWeightSlider = document.getElementById('font-weight');
const lineHeightSlider = document.getElementById('line-height');
const transitionSpeedSlider = document.getElementById('transition-speed');
const bgTransitionSpeedSlider = document.getElementById('bg-transition-speed');

// Layer DOM elements
const textOpacitySlider = document.getElementById('text-opacity');
const textOpacityValue = document.getElementById('text-opacity-value');
const textBlendModeDropdown = document.getElementById('text-blend-mode');

const gradientOpacitySlider = document.getElementById('gradient-opacity');
const gradientOpacityValue = document.getElementById('gradient-opacity-value');
const gradientBlendModeDropdown = document.getElementById('gradient-blend-mode');

const backgroundOpacitySlider = document.getElementById('background-opacity');
const backgroundOpacityValue = document.getElementById('background-opacity-value');
const backgroundBlendModeDropdown = document.getElementById('background-blend-mode');

// Slider value displays
const animationSpeedValue = document.getElementById('animation-speed-value');
const gradientMaxSizeValue = document.getElementById('gradient-max-size-value');
const gradientMinSizeValue = document.getElementById('gradient-min-size-value');
const gradientFeatherSizeValue = document.getElementById('gradient-feather-size-value');
const fontSizeValue = document.getElementById('font-size-value');
const fontKerningValue = document.getElementById('font-kerning-value');
const fontWeightValue = document.getElementById('font-weight-value');
const lineHeightValue = document.getElementById('line-height-value');
const transitionSpeedValue = document.getElementById('transition-speed-value');
const bgTransitionSpeedValue = document.getElementById('bg-transition-speed-value');

/**
 * Initialize all UI controls
 */
function initUIControls() {
    initQuickEmotions();
    initColorTable();
    initSliders();
    initEventListeners();
    initLayerVisibilityToggles();
    updateEmotionBars(getCurrentEmotionState().emotionScores);
}

/**
 * Initialize quick emotion buttons
 */
function initQuickEmotions() {
    quickEmotionsContainer.innerHTML = '';
    
    Object.keys(emotions).forEach(emotion => {
        const button = document.createElement('button');
        button.className = 'emotion-btn';
        button.textContent = emotion;
        // Removed tooltip with example text
        button.addEventListener('click', () => {
            emotionInput.value = examples[emotion];
            const result = analyzeEmotion(examples[emotion], true);
            
            if (result.emotionChanged) {
                window.startEmotionTransition(
                    emotions[result.prevCurrentEmotion]?.bg || "#9E9E9E",
                    emotions[result.prevSecondaryEmotion]?.bg || "#9E9E9E",
                    emotions[result.currentEmotion]?.bg || "#FF0000",
                    emotions[result.secondaryEmotion]?.bg || "#0000FF",
                    result.prevCurrentEmotion,
                    result.currentEmotion
                );
            }
            
            if (result.isButtonClick) {
                window.startTypewriter(examples[emotion]);
            }
            
            updateEmotionBars(result.emotionScores);
        });
        
        quickEmotionsContainer.appendChild(button);
    });
}

/**
 * Initialize color table
 */
function initColorTable() {
    colorTableBody.innerHTML = '';
    
    Object.keys(emotions).forEach(emotion => {
        const row = document.createElement('tr');
        
        // Emotion name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = emotion;
        row.appendChild(nameCell);
        
        // Background color cell
        const bgCell = document.createElement('td');
        const bgBox = document.createElement('div');
        bgBox.className = 'color-box';
        bgBox.style.backgroundColor = emotions[emotion].bg;
        bgBox.dataset.emotion = emotion;
        bgBox.dataset.property = 'bg';
        bgBox.addEventListener('click', handleColorBoxClick);
        bgCell.appendChild(bgBox);
        row.appendChild(bgCell);
        
        // Text color cell
        const textCell = document.createElement('td');
        const textBox = document.createElement('div');
        textBox.className = 'color-box';
        textBox.style.backgroundColor = emotions[emotion].text;
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
        
        animationOptions.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option;
            optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            if (option === emotions[emotion].animation) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });
        
        animationCell.appendChild(select);
        row.appendChild(animationCell);
        
        // Animation settings cell (intensity and duration)
        const settingsCell = document.createElement('td');
        settingsCell.id = `settings-cell-${emotion}`;
        settingsCell.style.width = '160px'; // Make sure this cell is wide enough
        row.appendChild(settingsCell);
        
        // Add the row to the table body
        colorTableBody.appendChild(row);
        
        // Initialize animation controls for this row
        updateAnimationControls(emotion);
        
        // Set up change listener for animation dropdown
        select.addEventListener('change', (e) => {
            emotions[emotion].animation = e.target.value;
            console.log(`Changed animation for ${emotion} to ${e.target.value}`);
            updateAnimationControls(emotion);
            window.updateDisplay();
        });
    });
}

/**
 * Update animation controls based on the current animation setting
 * @param {string} emotion - The emotion to update controls for
 */
function updateAnimationControls(emotion) {
    const settingsCell = document.getElementById(`settings-cell-${emotion}`);
    const animationType = emotions[emotion].animation;
    
    console.log(`Updating controls for ${emotion}, animation: ${animationType}`);
    
    // Clear existing content
    settingsCell.innerHTML = '';
    
    if (animationType !== 'none') {
        const animationControls = document.createElement('div');
        animationControls.className = 'animation-controls';
        
        // Intensity slider
        const intensityContainer = document.createElement('div');
        intensityContainer.className = 'slider-container-animation';
        const intensityLabel = document.createElement('label');
        intensityLabel.textContent = 'Intensity: ' + emotions[emotion].intensity;
        intensityLabel.style.fontSize = '12px';
        intensityLabel.style.display = 'block';
        intensityLabel.style.color = '#bbb';
        
        const intensitySlider = document.createElement('input');
        intensitySlider.type = 'range';
        intensitySlider.min = '10';
        intensitySlider.max = '100';
        intensitySlider.value = emotions[emotion].intensity;
        intensitySlider.className = 'animation-slider';
        
        intensitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            emotions[emotion].intensity = value;
            intensityLabel.textContent = 'Intensity: ' + value;
            window.updateAnimationIntensity(emotion);
        });
        
        intensityContainer.appendChild(intensityLabel);
        intensityContainer.appendChild(intensitySlider);
        
        // Duration slider
        const durationContainer = document.createElement('div');
        durationContainer.className = 'slider-container-animation';
        const durationLabel = document.createElement('label');
        durationLabel.textContent = 'Duration: ' + 
            (emotions[emotion].duration >= 100 ? 'Infinite' : emotions[emotion].duration/10 + 's');
        durationLabel.style.fontSize = '12px';
        durationLabel.style.display = 'block';
        durationLabel.style.color = '#bbb';
        
        const durationSlider = document.createElement('input');
        durationSlider.type = 'range';
        durationSlider.min = '1';
        durationSlider.max = '100';
        durationSlider.value = emotions[emotion].duration;
        durationSlider.className = 'animation-slider';
        
        durationSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            emotions[emotion].duration = value;
            durationLabel.textContent = 'Duration: ' + 
                (value >= 100 ? 'Infinite' : value/10 + 's');
            window.updateAnimationDuration(emotion);
        });
        
        durationContainer.appendChild(durationLabel);
        durationContainer.appendChild(durationSlider);
        
        animationControls.appendChild(intensityContainer);
        animationControls.appendChild(durationContainer);
        settingsCell.appendChild(animationControls);
    } else {
        settingsCell.textContent = 'N/A';
        settingsCell.style.color = '#666';
        settingsCell.style.fontStyle = 'italic';
        settingsCell.style.fontSize = '12px';
        settingsCell.style.textAlign = 'center';
        settingsCell.style.verticalAlign = 'middle';
    }
}

/**
 * Initialize layer visibility toggles
 */
function initLayerVisibilityToggles() {
    // Set up initial state (all visible)
    window.updateLayerVisibility('text', true);
    window.updateLayerVisibility('gradient', true);
    window.updateLayerVisibility('background', true);
    
    // Text layer visibility toggle
    textVisibilityToggle.addEventListener('click', () => {
        const isVisible = !textVisibilityToggle.classList.contains('hidden');
        textVisibilityToggle.classList.toggle('hidden');
        window.updateLayerVisibility('text', !isVisible);
    });
    
    // Gradient layer visibility toggle
    gradientVisibilityToggle.addEventListener('click', () => {
        const isVisible = !gradientVisibilityToggle.classList.contains('hidden');
        gradientVisibilityToggle.classList.toggle('hidden');
        window.updateLayerVisibility('gradient', !isVisible);
    });
    
    // Background layer visibility toggle
    backgroundVisibilityToggle.addEventListener('click', () => {
        const isVisible = !backgroundVisibilityToggle.classList.contains('hidden');
        backgroundVisibilityToggle.classList.toggle('hidden');
        window.updateLayerVisibility('background', !isVisible);
    });
}

/**
 * Handle color box click to show color picker
 * @param {Event} e - Click event
 */
function handleColorBoxClick(e) {
    const emotion = e.target.dataset.emotion;
    const property = e.target.dataset.property;
    const currentColor = emotions[emotion][property];
    
    createColorPicker(e.target, emotion, property, currentColor, (emotion, property, color) => {
        // Apply color change immediately
        emotions[emotion][property] = color;
        const colorBox = document.querySelector(`.color-box[data-emotion="${emotion}"][data-property="${property}"]`);
        if (colorBox) {
            colorBox.style.backgroundColor = color;
        }
        
        // Update display
        window.updateDisplay();
    });
}

/**
 * Initialize all sliders with event listeners
 */
function initSliders() {
    // Animation Speed
    animationSpeedSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        animationSpeedValue.textContent = value;
        window.updateSliderValue('animationSpeed', value);
    });
    
    // Gradient Max Size
    gradientMaxSizeSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        gradientMaxSizeValue.textContent = value;
        window.updateSliderValue('gradientMaxSize', value);
    });
    
    // Gradient Min Size
    gradientMinSizeSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        gradientMinSizeValue.textContent = value;
        window.updateSliderValue('gradientMinSize', value);
    });
    
    // Gradient Feather Size
    gradientFeatherSizeSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        gradientFeatherSizeValue.textContent = value;
        window.updateSliderValue('gradientFeatherSize', value);
    });
    
    // Font Size
    fontSizeSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        fontSizeValue.textContent = value;
        window.updateSliderValue('fontSize', value);
    });
    
    // Font Kerning
    fontKerningSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        fontKerningValue.textContent = value;
        window.updateSliderValue('fontKerning', value);
    });
    
    // Font Weight
    fontWeightSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        fontWeightValue.textContent = value;
        window.updateSliderValue('fontWeight', value);
    });
    
    // Line Height
    lineHeightSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        lineHeightValue.textContent = value;
        window.updateSliderValue('lineHeight', value);
    });
    
    // Transition Speed affects text typing animation
    transitionSpeedSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        transitionSpeedValue.textContent = value;
        window.updateSliderValue('transitionSpeed', value);
    });
    
    // Background Transition Speed slider
    bgTransitionSpeedSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        // Calculate actual milliseconds for transition duration
        const msDuration = 2000 - (value * 30);
        bgTransitionSpeedValue.textContent = msDuration + 'ms';
        window.updateSliderValue('backgroundTransitionSpeed', value);
    });
    
    // Font Family
    fontFamilyDropdown.addEventListener('change', function() {
        const value = this.value;
        window.updateSliderValue('fontFamily', value);
    });
    
    // Font Style
    fontStyleDropdown.addEventListener('change', function() {
        const value = this.value;
        window.updateSliderValue('fontStyle', value);
    });
    
    // Layer Controls
    
    // Text layer controls
    textOpacitySlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        textOpacityValue.textContent = value + '%';
        window.updateSliderValue('textOpacity', value);
    });

    textBlendModeDropdown.addEventListener('change', function() {
        const value = this.value;
        window.updateSliderValue('textBlendMode', value);
    });

    // Gradient layer controls
    gradientOpacitySlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        gradientOpacityValue.textContent = value + '%';
        window.updateSliderValue('gradientOpacity', value);
    });

    gradientBlendModeDropdown.addEventListener('change', function() {
        const value = this.value;
        window.updateSliderValue('gradientBlendMode', value);
    });

    // Background layer controls
    backgroundOpacitySlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        backgroundOpacityValue.textContent = value + '%';
        window.updateSliderValue('backgroundOpacity', value);
    });

    backgroundBlendModeDropdown.addEventListener('change', function() {
        const value = this.value;
        window.updateSliderValue('backgroundBlendMode', value);
    });
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Clear button
    clearButton.addEventListener('click', () => {
        emotionInput.value = '';
        emotionInput.focus();
        
        // Analyze empty text to reset
        const result = analyzeEmotion('', true);
        
        if (result.emotionChanged) {
            window.startEmotionTransition(
                emotions[result.prevCurrentEmotion]?.bg || "#9E9E9E",
                emotions[result.prevSecondaryEmotion]?.bg || "#9E9E9E",
                emotions[result.currentEmotion]?.bg || "#FF0000",
                emotions[result.secondaryEmotion]?.bg || "#0000FF",
                result.prevCurrentEmotion,
                result.currentEmotion
            );
        }
        
        // Start typewriter animation with default text
        window.startTypewriter("Enter an emotion to visualize");
        
        // Update display
        updateEmotionBars(result.emotionScores);
    });
    
    // Analyze button
    analyzeButton.addEventListener('click', () => {
        const result = analyzeEmotion(emotionInput.value, true);
        
        if (result.emotionChanged) {
            window.startEmotionTransition(
                emotions[result.prevCurrentEmotion]?.bg || "#9E9E9E",
                emotions[result.prevSecondaryEmotion]?.bg || "#9E9E9E",
                emotions[result.currentEmotion]?.bg || "#FF0000",
                emotions[result.secondaryEmotion]?.bg || "#0000FF",
                result.prevCurrentEmotion,
                result.currentEmotion
            );
        }
        
        if (result.isButtonClick) {
            window.startTypewriter(emotionInput.value);
        }
        
        updateEmotionBars(result.emotionScores);
    });
    
    // Real-time analysis as user types
    emotionInput.addEventListener('input', () => {
        const result = analyzeEmotion(emotionInput.value);
        
        if (result.emotionChanged) {
            window.startEmotionTransition(
                emotions[result.prevCurrentEmotion]?.bg || "#9E9E9E",
                emotions[result.prevSecondaryEmotion]?.bg || "#9E9E9E",
                emotions[result.currentEmotion]?.bg || "#FF0000",
                emotions[result.secondaryEmotion]?.bg || "#0000FF",
                result.prevCurrentEmotion,
                result.currentEmotion
            );
        }
        
        if (result.textChanged && !result.isButtonClick) {
            window.updateTextDisplay(emotionInput.value);
        }
        
        updateEmotionBars(result.emotionScores);
    });
    
    // Enter key to analyze
    emotionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const result = analyzeEmotion(emotionInput.value, true);
            
            if (result.emotionChanged) {
                window.startEmotionTransition(
                    emotions[result.prevCurrentEmotion]?.bg || "#9E9E9E",
                    emotions[result.prevSecondaryEmotion]?.bg || "#9E9E9E",
                    emotions[result.currentEmotion]?.bg || "#FF0000",
                    emotions[result.secondaryEmotion]?.bg || "#0000FF",
                    result.prevCurrentEmotion,
                    result.currentEmotion
                );
            }
            
            window.startTypewriter(emotionInput.value);
            updateEmotionBars(result.emotionScores);
        }
    });
}

/**
 * Update emotion bars
 * @param {Object} scores - Emotion scores
 */
function updateEmotionBars(scores) {
    detectedEmotionsContainer.innerHTML = '';
    
    const sortedEmotions = Object.keys(scores)
        .filter(emotion => scores[emotion] > 0.5) // Filter out very low scores
        .sort((a, b) => scores[b] - scores[a]);
    
    // Only show the top two emotions
    const topEmotions = sortedEmotions.slice(0, 2);
    
    topEmotions.forEach(emotion => {
        const score = scores[emotion];
        const percentage = Math.min(Math.round(score), 100);
        const displayWidth = Math.min(percentage, 100);
        const bgColor = emotions[emotion]?.bg || "#9E9E9E";
        
        const emotionBar = document.createElement('div');
        emotionBar.className = 'emotion-bar';
        
        const emotionHeader = document.createElement('div');
        emotionHeader.className = 'emotion-header';
        
        const emotionName = document.createElement('span');
        emotionName.className = 'emotion-name';
        emotionName.textContent = emotion;
        
        const emotionPercent = document.createElement('span');
        emotionPercent.className = 'emotion-percent';
        emotionPercent.textContent = percentage + '%';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = displayWidth + '%';
        progressFill.style.backgroundColor = bgColor;
        
        emotionHeader.appendChild(emotionName);
        emotionHeader.appendChild(emotionPercent);
        progressBar.appendChild(progressFill);
        emotionBar.appendChild(emotionHeader);
        emotionBar.appendChild(progressBar);
        
        detectedEmotionsContainer.appendChild(emotionBar);
    });
}
