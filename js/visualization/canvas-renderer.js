/**
 * Canvas Renderer for the Emotion Visualization App
 * Handles canvas drawing and effects
 */

const CanvasRenderer = (function() {
    // Animation variables
    let animationOffset = 0;

    // Transition animation variables
    let isTransitioning = false;
    let transitionStartTime = 0;
    let transitionDuration = Config.defaultValues.defaultTransitionDuration;
    let previousPrimaryColor = Config.emotions.neutral.bg;
    let previousSecondaryColor = Config.emotions.neutral.bg;
    let targetPrimaryColor = Config.emotions.neutral.bg;
    let targetSecondaryColor = Config.emotions.neutral.bg;
    
    // Advanced gradient transition variables
    let isAdvGradientTransitioning = false;
    let advGradientTransitionStartTime = 0;
    let advGradientTransitionDuration = Config.defaultValues.gradientColorTransitionSpeed;
    let prevAdvGradientColors = {
        primary: "#ff5e3a",
        secondary: "#ff2a68",
        background: "#4b00c8"
    };
    let targetAdvGradientColors = {
        primary: "#ff5e3a",
        secondary: "#ff2a68",
        background: "#4b00c8"
    };
    
    /**
     * Render all canvas layers
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {Object} emotionState - Current emotion state
     * @param {Object} settings - Current settings
     */
    function renderLayers(canvas, emotionState, settings) {
        const ctx = canvas.getContext('2d');
        
        // Get canvas dimensions
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate current colors based on transition
        let primaryColor, secondaryColor;
        
        if (isTransitioning) {
            // Calculate how far we are through the transition (0 to 1)
            const now = Date.now();
            const elapsed = now - transitionStartTime;
            const progress = Math.min(elapsed / transitionDuration, 1);
            
            // Interpolate between colors
            primaryColor = ColorUtils.interpolateColor(previousPrimaryColor, targetPrimaryColor, progress);
            secondaryColor = ColorUtils.interpolateColor(previousSecondaryColor, targetSecondaryColor, progress);
            
            // Check if transition is complete
            if (progress >= 1) {
                isTransitioning = false;
                previousPrimaryColor = targetPrimaryColor;
                previousSecondaryColor = targetSecondaryColor;
            }
        } else {
            // Use current emotion colors
            primaryColor = Config.emotions[emotionState.currentEmotion]?.bg || "#FF0000";
            secondaryColor = Config.emotions[emotionState.secondaryEmotion]?.bg || "#0000FF";
        }
        
        // Create a darker version of the secondary color for the background
        const darkerSecondary = ColorUtils.shadeColor(secondaryColor, -30); // 30% darker
        
        // Apply background layer with opacity and blend mode (if visible)
        if (settings.backgroundLayerVisible) {
            ctx.globalCompositeOperation = "source-over"; // Reset to default
            ctx.globalAlpha = settings.backgroundOpacity / 100;
            ctx.fillStyle = darkerSecondary;
            ctx.fillRect(0, 0, width, height);
            
            // Apply distortion to background if enabled
            if (settings.distortionLayerVisible && 
                settings.distortionEffect !== 'none' && 
                settings.distortBackground) {
                const layerCanvas = document.createElement('canvas');
                layerCanvas.width = width;
                layerCanvas.height = height;
                const layerCtx = layerCanvas.getContext('2d');
                
                // Copy the background to the temporary canvas
                layerCtx.drawImage(canvas, 0, 0);
                
                // Apply distortion to the temporary canvas
                applyDistortionToLayer(layerCtx, width, height, settings);
                
                // Clear the main canvas and redraw with the distorted layer
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(layerCanvas, 0, 0);
            }
        }
        
        // Apply gradient layer (if visible)
        if (settings.gradientLayerVisible) {
            // Create a new canvas for the gradient layer - make it much larger to prevent edge artifacts
            const gradientCanvas = document.createElement('canvas');
            
            // MODIFIED: Increase scale factor based on tilt to ensure gradient covers entire canvas even when tilted
            const baseFactor = 6; // Increased base scale factor
            const tiltFactor = Math.max(
                Math.abs(settings.gradientTiltH), 
                Math.abs(settings.gradientTiltV)
            ) / 10; // Additional factor based on tilt amount
            
            const scaleFactor = baseFactor + tiltFactor; // Dynamic scale factor
            
            gradientCanvas.width = width * scaleFactor;
            gradientCanvas.height = height * scaleFactor;
            const gradientCtx = gradientCanvas.getContext('2d');
            
            // Set blend mode for gradient layer
            gradientCtx.globalCompositeOperation = settings.gradientBlendMode;
            
            // Calculate gradient position based on animation
            const gradientCenterX = gradientCanvas.width/2 + Math.sin(animationOffset) * (width/4);
            const gradientCenterY = gradientCanvas.height/2 + Math.cos(animationOffset) * (height/4);
            
            // Apply gradient layer with opacity
            gradientCtx.globalAlpha = settings.gradientOpacity / 100;
            
            // Create gradient with configurable size
            const minGradientSize = 50;
            const maxGradientSize = 1500 * scaleFactor; // Scale the max size to match scale factor
            const gradientSizeRange = maxGradientSize - minGradientSize;
            const gradientSize = minGradientSize + (gradientSizeRange * (settings.gradientMaxSize / 100));
            
            // Make gradient large enough to ensure it covers the entire canvas even when tilted
            const gradient = gradientCtx.createRadialGradient(
                gradientCenterX, gradientCenterY, settings.gradientMinSize * 2,
                gradientCenterX, gradientCenterY, gradientSize
            );
            
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(settings.gradientFeatherSize / 100, primaryColor);
            gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Transparent at the edge
            
            gradientCtx.fillStyle = gradient;
            gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
            
            // Apply distortion to gradient if enabled
            if (settings.distortionLayerVisible && 
                settings.distortionEffect !== 'none' && 
                settings.distortGradient) {
                applyDistortionToLayer(gradientCtx, gradientCanvas.width, gradientCanvas.height, settings);
            }
            
            // Only apply tilt if either tilt value is non-zero
            if (settings.gradientTiltH !== 0 || settings.gradientTiltV !== 0) {
                // Save the current state
                ctx.save();
                
                // Translate to center of canvas for rotation
                ctx.translate(width / 2, height / 2);
                
                // Apply rotations based on tilt values (convert degrees to radians)
                const hTiltRad = (settings.gradientTiltH * Math.PI) / 180;
                const vTiltRad = (settings.gradientTiltV * Math.PI) / 180;
                
                ctx.rotate(-vTiltRad); // Horizontal axis rotation
                ctx.rotate(hTiltRad);  // Vertical axis rotation
                
                // Apply a perspective scale for 3D effect - adjust the scale based on tilt angle
                const maxTilt = Math.max(Math.abs(settings.gradientTiltH), Math.abs(settings.gradientTiltV));
                const perspectiveScale = 1 - maxTilt / 200; // Less aggressive scaling
                ctx.scale(perspectiveScale, perspectiveScale);
                
                // Translate back
                ctx.translate(-width / 2, -height / 2);
                
                // Calculate source rectangle position to keep gradient centered
                const offsetX = (gradientCanvas.width - width) / 2;
                const offsetY = (gradientCanvas.height - height) / 2;
                
                // Draw the gradient with the calculated offsets
                ctx.drawImage(
                    gradientCanvas,
                    offsetX, offsetY, width, height, // Source rectangle
                    0, 0, width, height  // Destination rectangle
                );
                
                ctx.restore();
            } else {
                // No tilt, just draw the center portion of the gradient
                const offsetX = (gradientCanvas.width - width) / 2;
                const offsetY = (gradientCanvas.height - height) / 2;
                
                ctx.drawImage(
                    gradientCanvas,
                    offsetX, offsetY, width, height, // Source rectangle
                    0, 0, width, height  // Destination rectangle
                );
            }
        }
        
        // Reset opacity for future drawing operations
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = "source-over";
        
        // Return a thumbnail version of the canvas for the layer preview
        return createThumbnail(canvas);
    }

    /**
     * Render advanced gradient based on configuration
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} config - Gradient configuration
     */
    function renderAdvancedGradient(ctx, width, height, config) {
        if (!config || !config.advancedGradient) return;
        
        const advGradient = {...config.advancedGradient};
        
        // Handle color transitions for advanced gradient
        if (isAdvGradientTransitioning) {
            // Calculate progress
            const now = Date.now();
            const elapsed = now - advGradientTransitionStartTime;
            const progress = Math.min(elapsed / advGradientTransitionDuration, 1);
            
            // Create temporary colors object with interpolated values
            const currentColors = {
                primary: ColorUtils.interpolateColor(
                    prevAdvGradientColors.primary, 
                    targetAdvGradientColors.primary, 
                    progress
                ),
                secondary: ColorUtils.interpolateColor(
                    prevAdvGradientColors.secondary, 
                    targetAdvGradientColors.secondary, 
                    progress
                ),
                background: ColorUtils.interpolateColor(
                    prevAdvGradientColors.background, 
                    targetAdvGradientColors.background, 
                    progress
                )
            };
            
            // Use the interpolated colors for rendering
            advGradient.colors = currentColors;
            
            // Check if transition is complete
            if (progress >= 1) {
                isAdvGradientTransitioning = false;
                prevAdvGradientColors = {...targetAdvGradientColors};
                
                // Update the actual settings object with final values
                if (config.advancedGradient && config.advancedGradient.colors) {
                    config.advancedGradient.colors = {...targetAdvGradientColors};
                }
            }
        }
        
        // Add animation intensity to the advanced gradient config
        advGradient.animationIntensity = config.animationSpeed || 50;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fill background
        const bgColor = advGradient.colors.background || '#4b00c8';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Apply based on gradient type
        switch (advGradient.type) {
            case 'radial':
                renderRadialGradient(ctx, width, height, advGradient);
                break;
            case 'dual-radial':
                renderDualRadialGradient(ctx, width, height, advGradient);
                break;
            case 'linear':
            default:
                renderLinearGradient(ctx, width, height, advGradient);
                break;
        }
    }

    /**
     * Render a linear gradient with animation
     */
    function renderLinearGradient(ctx, width, height, config) {
        // Add animation to the linear gradient endpoints
        const animScale = 0.1;
        
        const baseX1 = width * (config.point1.x / 100);
        const baseY1 = height * (config.point1.y / 100);
        const x1 = baseX1 + Math.sin(animationOffset) * (width * animScale);
        const y1 = baseY1 + Math.cos(animationOffset) * (height * animScale);
        
        const baseX2 = width * (config.point2.x / 100);
        const baseY2 = height * (config.point2.y / 100);
        const x2 = baseX2 + Math.sin(animationOffset + 2) * (width * animScale);
        const y2 = baseY2 + Math.cos(animationOffset + 2) * (height * animScale);
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, config.colors.primary);
        gradient.addColorStop(1, config.colors.secondary);
        
        // Apply glow/bloom effect
        ctx.globalCompositeOperation = 'screen';
        const glowStrength = config.glow / 100;
        ctx.globalAlpha = 0.8 * glowStrength;
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
    }

    /**
     * Render a radial gradient with animation
     */
    function renderRadialGradient(ctx, width, height, config) {
        // Get base position from config
        const baseX = width * (config.point1.x / 100);
        const baseY = height * (config.point1.y / 100);
        
        // Add animation offset for gentle movement
        const centerX = baseX + Math.sin(animationOffset) * (width/10);
        const centerY = baseY + Math.cos(animationOffset) * (height/10);
        
const radius = Math.min(width, height) * ((config.point1.size * 2) / 100);
        
        // Main gradient
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        gradient.addColorStop(0, config.colors.primary);
        gradient.addColorStop(0.7, config.colors.secondary);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        // Apply the gradient with glow effect
        const bloomSize = config.bloom / 100;
        const glowStrength = config.glow / 100;
        
        // First pass - main shape
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Second pass - bloom/glow effect
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.7 * glowStrength;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (1 + bloomSize), 0, Math.PI * 2);
        ctx.fill();
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
    }

    /**
     * Render a dual radial gradient with animation
     */
    function renderDualRadialGradient(ctx, width, height, config) {
        // Calculate animation scale based on animation speed
        const animScale = Math.min(0.15, (config.animationIntensity || 50) / 500);
        
        // First gradient point with animation
        const baseX1 = width * (config.point1.x / 100);
        const baseY1 = height * (config.point1.y / 100);
        const centerX1 = baseX1 + Math.sin(animationOffset) * (width * animScale);
        const centerY1 = baseY1 + Math.cos(animationOffset * 0.8) * (height * animScale);
        
        // Second gradient point with inverse animation
        const baseX2 = width * (config.point2.x / 100);
        const baseY2 = height * (config.point2.y / 100);
        const centerX2 = baseX2 + Math.sin(animationOffset * 1.2 + 1) * (width * animScale);
        const centerY2 = baseY2 + Math.cos(animationOffset + 1) * (height * animScale);
        
        const radius1 = Math.min(width, height) * ((config.point1.size * 2) / 100);
		const radius2 = Math.min(width, height) * ((config.point2.size * 2) / 100);
        
        // Glow and bloom parameters
        const bloomSize = config.bloom / 100;
        const glowStrength = config.glow / 100;
        const blendFactor = config.blend / 100;
        
        // Create first radial gradient
        const gradient1 = ctx.createRadialGradient(
            centerX1, centerY1, 0,
            centerX1, centerY1, radius1
        );
        
        gradient1.addColorStop(0, config.colors.primary);
        gradient1.addColorStop(0.7, ColorUtils.interpolateColor(
            config.colors.primary, 
            config.colors.secondary, 
            blendFactor
        ));
        gradient1.addColorStop(1, 'rgba(0,0,0,0)');
        
        // Create second radial gradient
        const gradient2 = ctx.createRadialGradient(
            centerX2, centerY2, 0,
            centerX2, centerY2, radius2
        );
        
        gradient2.addColorStop(0, config.colors.secondary);
        gradient2.addColorStop(0.7, ColorUtils.interpolateColor(
            config.colors.secondary, 
            config.colors.primary, 
            blendFactor
        ));
        gradient2.addColorStop(1, 'rgba(0,0,0,0)');
        
        // Apply first radial gradient with glow
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1.0;
        
        // Draw first gradient
        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.arc(centerX1, centerY1, radius1, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw first glow
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.8 * glowStrength;
        ctx.beginPath();
        ctx.arc(centerX1, centerY1, radius1 * (1 + bloomSize), 0, Math.PI * 2);
        ctx.fill();
        
        // Draw second gradient
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.arc(centerX2, centerY2, radius2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw second glow
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.8 * glowStrength;
        ctx.beginPath();
        ctx.arc(centerX2, centerY2, radius2 * (1 + bloomSize), 0, Math.PI * 2);
        ctx.fill();
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
    }
    
    /**
     * Create a thumbnail of the canvas for layer previews
     * @param {HTMLCanvasElement} canvas - Source canvas
     * @returns {HTMLCanvasElement} Thumbnail canvas
     */
    function createThumbnail(canvas) {
        // MODIFIED: Use the same aspect ratio as the main canvas
        const thumbnailWidth = 44;  // Match the CSS width of layer-thumbnail
        const thumbnailHeight = 96; // Match the CSS height of layer-thumbnail
        
        const thumbnail = document.createElement('canvas');
        thumbnail.width = thumbnailWidth;
        thumbnail.height = thumbnailHeight;
        
        const thumbCtx = thumbnail.getContext('2d');
        thumbCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, thumbnailWidth, thumbnailHeight);
        
        return thumbnail;
    }
    
    /**
     * Apply distortion effect to a specific layer
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} settings - Current settings
     */
    function applyDistortionToLayer(ctx, width, height, settings) {
        // Get the current canvas image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Apply different effects based on selection
        switch (settings.distortionEffect) {
            case 'filmGrain':
                DistortionEffects.applyFilmGrain(data, width, height, settings.distortionIntensity);
                break;
            case 'noise':
                DistortionEffects.applyNoise(data, width, height, settings.distortionIntensity);
                break;
            case 'scanlines':
                DistortionEffects.applyScanlines(data, width, height, settings.distortionIntensity);
                break;
            case 'glitch':
                DistortionEffects.applyGlitch(ctx, data, width, height, settings.distortionIntensity);
                break;
            case 'blur':
                DistortionEffects.applyBlur(data, width, height, settings.distortionIntensity);
                break;
            case 'warp':
                DistortionEffects.applyWarp(data, width, height, settings.distortionIntensity);
                break;
            case 'pixelate':
                DistortionEffects.applyPixelate(ctx, width, height, settings.distortionIntensity);
                return; // Pixelate applies directly to canvas, no need to put image data back
        }
        
        // Put the modified image data back on the canvas
        ctx.putImageData(imageData, 0, 0);
    }
    
    /**
     * Start emotion transition animation
     * @param {string} fromPrimary - Starting primary color
     * @param {string} fromSecondary - Starting secondary color
     * @param {string} toPrimary - Target primary color
     * @param {string} toSecondary - Target secondary color
     * @param {number} duration - Transition duration in ms
     */
    function startEmotionTransition(fromPrimary, fromSecondary, toPrimary, toSecondary, duration) {
        previousPrimaryColor = fromPrimary;
        previousSecondaryColor = fromSecondary;
        targetPrimaryColor = toPrimary;
        targetSecondaryColor = toSecondary;
        
        // Set transition duration
        transitionDuration = duration;
        transitionStartTime = Date.now();
        isTransitioning = true;
    }
    
    /**
     * Start advanced gradient color transition
     * @param {Object} fromColors - Starting colors object
     * @param {Object} toColors - Target colors object
     * @param {number} duration - Transition duration in ms
     */
    function startAdvGradientTransition(fromColors, toColors, duration) {
        prevAdvGradientColors = {...fromColors};
        targetAdvGradientColors = {...toColors};
        
        // Set transition duration
        advGradientTransitionDuration = duration;
        advGradientTransitionStartTime = Date.now();
        isAdvGradientTransitioning = true;
    }
    
    /**
     * Update animation offset
     * @param {number} speed - Animation speed value (0-100)
     */
    function updateAnimationOffset(speed) {
        // Animation speed: lower values = faster animation (reversed)
        const animationFactor = 0.005 * ((speed + 1) / 50 + 0.5);
        animationOffset += animationFactor;
        
        // Prevent potential overflow for extremely long sessions
        if (animationOffset > 1000000) {
            animationOffset = 0;
        }
    }
    
    /**
     * Check if canvas is currently animating
     * @returns {boolean} True if animation is in progress
     */
    function isAnimating() {
        return isTransitioning || isAdvGradientTransitioning;
    }
    
    // Public API
    return {
        renderLayers,
        renderAdvancedGradient,
        startEmotionTransition,
        startAdvGradientTransition,
        updateAnimationOffset,
        isAnimating
    };
})();

// Export for use in other modules
window.CanvasRenderer = CanvasRenderer;