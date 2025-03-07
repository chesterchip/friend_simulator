/**
 * Main application file for Emotion Visualization App
 * Initializes and coordinates all modules
 */

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get app version safely from the config
    const version = typeof appVersion !== 'undefined' ? appVersion : '1.008';
    console.log(`Emotion Visualization App v${version} initializing...`);
    
    // Initialize UI controls first
    initUIControls();
    
    // Start the visualization (using window.startVisualization which is exposed by visualization.js)
    window.startVisualization();
    
    console.log(`Emotion Visualization App v${version} initialized successfully`);
});
