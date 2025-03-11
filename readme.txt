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

## Project Structure

```
emotion-app/
├── index.html                # Main HTML file
├── animation-demo.html       # Animation preview demo
├── css/
│   ├── main.css              # CSS entry point (imports all others)
│   ├── base.css              # Reset styles and common elements
│   ├── layout.css            # Grid layout and panels
│   ├── controls.css          # UI controls and forms
│   ├── animations.css        # Animation keyframes
│   └── visualization.css     # Visualization display styles
├── js/
│   ├── app.js                # Application entry point
│   ├── config/
│   │   ├── config.js         # Configuration values
│   │   └── config-manager.js # Configuration saving/loading
│   ├── ui/
│   │   ├── ui-manager.js     # UI initialization
│   │   ├── slider-controls.js # Slider handling
│   │   ├── color-controls.js  # Color table and picker
│   │   ├── layer-controls.js  # Layer visibility and blending
│   │   └── emotion-ui.js     # Emotion UI elements
│   ├── analyzer/
│   │   └── emotion-analyzer.js # Emotion detection
│   ├── visualization/
│   │   ├── visualization-manager.js # Main visualization handler
│   │   ├── canvas-renderer.js # Canvas drawing
│   │   ├── text-effects.js   # Text styling and animations
│   │   └── distortion-effects.js # Visual distortions
│   └── utils/
│       ├── color-utils.js    # Color manipulation
│       ├── dom-utils.js      # DOM utility functions
│       └── color-picker.js   # Color picker functionality
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

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **Config**: Configuration values and settings management
- **UI Manager**: Handles UI initialization and user interaction
- **Emotion Analyzer**: Processes text to detect emotions
- **Visualization Manager**: Coordinates canvas rendering and animations
- **Utilities**: Helper functions for colors, DOM manipulation, etc.

Each module has a single responsibility and communicates with other modules through well-defined interfaces. This architecture makes the code more maintainable, testable, and extensible.

## Browser Compatibility

The app works in modern browsers that support:
- HTML5 Canvas
- CSS3 Animations
- ES6 JavaScript features

## License

This project is open source and available for personal and educational use.

## Version

Current version: v1.008
