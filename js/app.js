/**
 * Initialize panel toggle functionality
 */
function initPanelToggles() {
    // Find all panel headers
    const panelHeaders = document.querySelectorAll('.panel-header');
    
    panelHeaders.forEach(header => {
        // Check if toggle icon exists, if not, add it at the beginning
        if (!header.querySelector('.toggle-icon')) {
            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'toggle-icon';
            toggleIcon.textContent = '▼';
            header.insertBefore(toggleIcon, header.firstChild);
        }
        
        const content = header.nextElementSibling;
        if (content && content.classList.contains('panel-content')) {
            // Set up click event
            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                content.classList.toggle('collapsed');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Get app version from config
    const version = Config.appVersion;
    console.log(`Emotion Visualization App v${version} initializing...`);
    
    // Initialize modules in the correct order
    
    // 1. First initialize UI generator to create dynamic controls
    UIGenerator.init();
    
    // 2. Initialize UI manager and controls
    UIManager.init();
    
    // 3. Initialize configuration manager
    ConfigManager.init();
    
    // 4. Initialize visualization manager and start visualization
    VisualizationManager.init();
    
    // 5. Initialize panel toggle functionality (new)
    initPanelToggles();
    
    console.log(`Emotion Visualization App v${version} initialized successfully`);
});