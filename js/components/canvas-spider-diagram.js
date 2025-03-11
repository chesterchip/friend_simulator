/**
 * Canvas-based Spider Diagram for Emotion Visualization
 * This version doesn't rely on React or Recharts and removes Primary/Secondary indicators
 */

const EmotionSpiderDiagram = (function() {
    // Canvas element
    let canvas = null;
    let ctx = null;
    
    // Configuration
    const config = {
        canvasId: 'emotion-spider-canvas',
        width: 300,
        height: 300,
        padding: 50,
        animationSpeed: 5,
        maxValue: 100,
        levels: 5,
        labelFactor: 1.2
    };
    
    // Current emotion scores
    let currentScores = {
        anger: 10,
        happy: 10, 
        peaceful: 10, 
        fear: 10, 
        sad: 10, 
        surprise: 10, 
        neutral: 80
    };
    
    // Target emotion scores (for animation)
    let targetScores = { ...currentScores };
    
    // Animation frame
    let animationFrame = null;
    
    /**
     * Initialize the spider diagram
     * @param {string|HTMLElement} container - Container to append canvas to
     */
    function init(container) {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        if (!container) {
            console.error('Spider diagram container not found');
            return;
        }
        
        // Create canvas element
        canvas = document.createElement('canvas');
        canvas.id = config.canvasId;
        canvas.width = config.width;
        canvas.height = config.height;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        
        // Append to container
        container.appendChild(canvas);
        
        // Get context
        ctx = canvas.getContext('2d');
        
        // Set up event listener for emotion updates
        window.addEventListener('emotionScoresUpdated', handleEmotionUpdate);
        
        // Start update loop
        startUpdateLoop();
        
        // Initial draw
        draw();
        
        console.log('Spider diagram initialized successfully');
    }
    
    /**
     * Handle emotion update event
     * @param {CustomEvent} event - Custom event with emotion scores
     */
    function handleEmotionUpdate(event) {
        if (event.detail) {
            // Set target scores for animation
            targetScores = { ...event.detail };
        }
    }
    
    /**
     * Start update loop to check for emotion changes
     */
    function startUpdateLoop() {
        // Check EmotionAnalyzer periodically
        setInterval(() => {
            if (window.EmotionAnalyzer) {
                const emotionState = window.EmotionAnalyzer.getCurrentState();
                if (emotionState && emotionState.emotionScores) {
                    // Set target scores for animation
                    targetScores = { ...emotionState.emotionScores };
                }
            }
        }, 300);
        
        // Start animation loop
        animateLoop();
    }
    
    /**
     * Animation loop
     */
    function animateLoop() {
        // Check if scores need to be updated
        let needsUpdate = false;
        
        // Animate current scores towards target scores
        for (const emotion in targetScores) {
            if (currentScores[emotion] !== targetScores[emotion]) {
                const diff = targetScores[emotion] - currentScores[emotion];
                const step = diff / config.animationSpeed;
                
                if (Math.abs(diff) < 0.5) {
                    currentScores[emotion] = targetScores[emotion];
                } else {
                    currentScores[emotion] += step;
                    needsUpdate = true;
                }
            }
        }
        
        // Redraw if needed
        if (needsUpdate) {
            draw();
        }
        
        // Continue animation loop
        animationFrame = requestAnimationFrame(animateLoop);
    }
    
    /**
     * Draw the spider diagram
     */
    function draw() {
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, config.width, config.height);
        
        // Calculate center and radius
        const centerX = config.width / 2;
        const centerY = config.height / 2;
        const radius = Math.min(centerX, centerY) - config.padding;
        
        // Get emotion data
        const emotions = Object.keys(currentScores);
        const numEmotions = emotions.length;
        
        // Calculate angles for each emotion
        const angleStep = (Math.PI * 2) / numEmotions;
        
        // Draw background levels
        drawLevels(centerX, centerY, radius, numEmotions, angleStep);
        
        // Draw grid lines
        drawAxisLines(centerX, centerY, radius, emotions, angleStep);
        
        // Draw labels
        drawLabels(centerX, centerY, radius, emotions, angleStep);
        
        // Draw data polygon
        drawDataPolygon(centerX, centerY, radius, emotions, angleStep);
    }
    
    /**
     * Draw background levels (concentric polygons)
     */
    function drawLevels(centerX, centerY, radius, numEmotions, angleStep) {
        ctx.strokeStyle = 'rgba(180, 180, 180, 0.4)';
        ctx.fillStyle = 'rgba(60, 60, 60, 0.2)'; // Dark transparent fill
        ctx.lineWidth = 1;
        
        for (let level = 0; level < config.levels; level++) {
            const levelRadius = radius * ((level + 1) / config.levels);
            
            ctx.beginPath();
            for (let i = 0; i < numEmotions; i++) {
                const angle = i * angleStep - Math.PI / 2; // Start at top (subtract 90 degrees)
                const x = centerX + levelRadius * Math.cos(angle);
                const y = centerY + levelRadius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    /**
     * Draw axis lines (from center to each emotion)
     */
    function drawAxisLines(centerX, centerY, radius, emotions, angleStep) {
        ctx.strokeStyle = 'rgba(180, 180, 180, 0.4)';
        ctx.lineWidth = 1;
        
        emotions.forEach((_, i) => {
            const angle = i * angleStep - Math.PI / 2; // Start at top (subtract 90 degrees)
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + radius * Math.cos(angle),
                centerY + radius * Math.sin(angle)
            );
            ctx.stroke();
        });
    }
    
    /**
     * Draw axis labels
     */
    function drawLabels(centerX, centerY, radius, emotions, angleStep) {
        ctx.fillStyle = '#ccc';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        emotions.forEach((emotion, i) => {
            const angle = i * angleStep - Math.PI / 2; // Start at top (subtract 90 degrees)
            const labelRadius = radius * config.labelFactor;
            
            const labelX = centerX + labelRadius * Math.cos(angle);
            const labelY = centerY + labelRadius * Math.sin(angle);
            
            // Capitalize first letter
            const label = emotion.charAt(0).toUpperCase() + emotion.slice(1);
            
            ctx.fillText(label, labelX, labelY);
        });
    }
    
    /**
     * Draw data polygon representing current emotion scores
     */
    function drawDataPolygon(centerX, centerY, radius, emotions, angleStep) {
        // Find primary emotion for determining color
        const primaryEmotion = Object.keys(currentScores)
            .reduce((a, b) => currentScores[a] > currentScores[b] ? a : b);
        
        // Get emotion color from Config
        let polygonColor = '#ff5e3a'; // Default fallback
        
        if (window.Config && window.Config.emotions && window.Config.emotions[primaryEmotion]) {
            polygonColor = window.Config.emotions[primaryEmotion].bg;
        }
        
        // Draw polygon
        ctx.fillStyle = polygonColor + '66'; // Add 40% transparency
        ctx.strokeStyle = polygonColor;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        
        emotions.forEach((emotion, i) => {
            const angle = i * angleStep - Math.PI / 2; // Start at top (subtract 90 degrees)
            const value = currentScores[emotion] / config.maxValue; // Normalize to 0-1
            const valueRadius = radius * Math.min(value, 1); // Cap at max radius
            
            const x = centerX + valueRadius * Math.cos(angle);
            const y = centerY + valueRadius * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#fff';
        
        emotions.forEach((emotion, i) => {
            const angle = i * angleStep - Math.PI / 2; // Start at top (subtract 90 degrees)
            const value = currentScores[emotion] / config.maxValue; // Normalize to 0-1
            const valueRadius = radius * Math.min(value, 1); // Cap at max radius
            
            const x = centerX + valueRadius * Math.cos(angle);
            const y = centerY + valueRadius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    }
    
    /**
     * Clean up resources when removing the component
     */
    function cleanup() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        window.removeEventListener('emotionScoresUpdated', handleEmotionUpdate);
    }
    
    // Public API
    return {
        init,
        cleanup
    };
})();

// Make the component available globally
window.EmotionSpiderDiagram = EmotionSpiderDiagram;