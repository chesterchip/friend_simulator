/**
 * Mount script for the Canvas-based EmotionSpiderDiagram
 */

// Function to mount the emotion spider diagram
function mountEmotionSpiderDiagram(container) {
  if (!container || !window.EmotionSpiderDiagram) {
    console.error('Cannot mount spider diagram - missing dependencies');
    return;
  }
  
  try {
    // Create a new container if needed
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    
    if (!container) {
      console.error('Spider diagram container not found');
      return;
    }
    
    // Initialize the diagram
    window.EmotionSpiderDiagram.init(container);
    
    console.log('Spider diagram mounted successfully');
  } catch (error) {
    console.error('Error mounting spider diagram:', error);
  }
}

// Expose the function globally
window.mountEmotionSpiderDiagram = mountEmotionSpiderDiagram;

// Auto-mount when the document is ready if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('spider-diagram-container');
  if (container) {
    // Wait a short time to ensure all dependencies are loaded
    setTimeout(() => mountEmotionSpiderDiagram(container), 300);
  }
});