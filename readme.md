# Emotion Visualization App

A web application that visualizes emotions with dynamic colors and animations based on text input.

## Features

- Real-time emotion detection from text input
- Interactive visualization with customizable colors and animations
- Visual representation of emotions with dynamic gradient backgrounds
- Typewriter text animation effect
- Color picker for customizing emotion colors
- Adjustable animation and visual settings
- Enhanced font selection with 20 modern fonts
- Streamlined UI with improved space utilization

## Getting Started

### Installation

1. Clone or download this repository
2. No build process required - it's built with vanilla HTML, CSS, and JavaScript

### Usage

1. Open `index.html` in a modern web browser
2. Enter text describing your emotions in the text area
3. Click "Analyze" or press Enter to view the visualization
4. Use the sliders in the sidebar to adjust the visualization settings
5. Click on color boxes in the right panel to customize colors for each emotion
6. Save and load configurations with the controls at the top of the left panel

## How It Works

The app analyzes text input for keywords related to various emotions and calculates scores for each emotion. It then visualizes the primary and secondary detected emotions using dynamic color gradients, animations, and text styling.

### Customization Options

- **Configuration Controls**: Save and load your custom settings
- **Background Controls**: Adjust gradient appearance and animation speed
- **Font Settings**: Choose from 20 different fonts and adjust text appearance (size, kerning, weight, line height)
- **Transition Settings**: Control typing animation and color transition speeds
- **Emotion Colors**: Customize background and text colors for each emotion
- **Text Animations**: Apply various effects to displayed text:
  - **Big**: Text grows and shrinks
  - **Small**: Text shrinks and grows
  - **Shake**: Text shakes horizontally
  - **Nod**: Text rotates side to side
  - **Ripple**: Text has a pulsing light effect
  - **Bloom**: Text fades in with a growing animation
  - **Jitter**: Text shakes in multiple directions
  - **Pulse**: Text pulses in and out
  - **None**: No animation

## File Structure

```
emotion-app/
├── index.html                # Main HTML file
├── animation-demo.html       # Animation preview demo
├── css/
│   └── styles.css            # All styles
├── js/
│   ├── app.js                # Main application initialization
│   ├── config.js             # Configuration values
│   ├── ui-controls.js        # UI initialization
│   ├── emotion-analyzer.js   # Emotion detection logic
│   ├── visualization.js      # Canvas and animation rendering
│   ├── color-picker.js       # Color picker functionality
│   ├── config-manager.js     # Configuration saving and loading
│   └── utils.js              # Utility functions
└── README.md                 # Documentation
```

## Emotions Detected

- Anger
- Happy
- Peaceful
- Fear
- Sad
- Surprise
- Neutral

## UI Improvements

The latest version includes several UI improvements:
- Configuration controls moved to the top for easier access
- Expanded font selection with 20 modern serif and sans-serif options
- Background controls arranged in a space-saving two-column layout
- Layer controls optimized with horizontal layout for sliders and dropdowns
- Quick Emotions buttons with improved hover states
- Fixed scrollbar issues for better space utilization

## Browser Compatibility

The app works in modern browsers that support:
- HTML5 Canvas
- CSS3 Animations
- ES6 JavaScript features

## License

This project is open source and available for personal and educational use.

## Version

Current version: v1.008
