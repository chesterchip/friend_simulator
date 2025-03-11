/**
 * Distortion Effects for the Emotion Visualization App
 * Visual distortion filters and effects
 */

const DistortionEffects = (function() {
    /**
     * Apply film grain effect
     * @param {Uint8ClampedArray} data - Image data array
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} intensity - Effect intensity (0-100)
     */
    function applyFilmGrain(data, width, height, intensity) {
        const effectIntensity = intensity / 100 * 50; // Scale to reasonable value
        
        for (let i = 0; i < data.length; i += 4) {
            // Generate random noise value between -intensity and +intensity
            const noise = (Math.random() - 0.5) * effectIntensity * 2;
            
            // Apply to RGB channels
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
            // Don't modify alpha channel
        }
    }

    /**
     * Apply noise effect (colored noise)
     * @param {Uint8ClampedArray} data - Image data array
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} intensity - Effect intensity (0-100)
     */
    function applyNoise(data, width, height, intensity) {
        const effectIntensity = intensity / 100 * 70; // Scale to reasonable value
        
        for (let i = 0; i < data.length; i += 4) {
            // Generate random noise values for each channel
            const noiseR = (Math.random() - 0.5) * effectIntensity * 2;
            const noiseG = (Math.random() - 0.5) * effectIntensity * 2;
            const noiseB = (Math.random() - 0.5) * effectIntensity * 2;
            
            // Apply to RGB channels
            data[i] = Math.min(255, Math.max(0, data[i] + noiseR));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noiseG));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noiseB));
        }
    }

    /**
     * Apply scanlines effect
     * @param {Uint8ClampedArray} data - Image data array
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} intensity - Effect intensity (0-100)
     */
    function applyScanlines(data, width, height, intensity) {
        const effectIntensity = intensity / 100 * 0.7; // Scale to reasonable value
        const scanlineWidth = 2; // Width of each scanline
        
        for (let y = 0; y < height; y++) {
            // Determine if this row is a scanline
            if (y % (scanlineWidth * 2) < scanlineWidth) {
                for (let x = 0; x < width; x++) {
                    const i = (y * width + x) * 4;
                    // Darken pixels in scanline rows
                    data[i] = data[i] * (1 - effectIntensity);
                    data[i + 1] = data[i + 1] * (1 - effectIntensity);
                    data[i + 2] = data[i + 2] * (1 - effectIntensity);
                }
            }
        }
    }

    /**
     * Apply glitch effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Uint8ClampedArray} data - Image data array
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} intensity - Effect intensity (0-100)
     */
    function applyGlitch(ctx, data, width, height, intensity) {
        const effectIntensity = intensity / 100;
        
        // Number of glitch slices depends on intensity
        const numSlices = Math.floor(effectIntensity * 20) + 1;
        
        // Occasionally add color channel shift
        if (Math.random() < effectIntensity * 0.8) {
            const channelShift = Math.floor(effectIntensity * 10) + 1;
            
            for (let i = 0; i < data.length; i += 4) {
                // Shift red channel left or right
                const sourceI = i + (Math.random() > 0.5 ? channelShift * 4 : -channelShift * 4);
                if (sourceI >= 0 && sourceI < data.length) {
                    data[i] = data[sourceI];
                }
            }
        }
        
        // Create horizontal glitch slices
        for (let i = 0; i < numSlices; i++) {
            const y = Math.floor(Math.random() * height);
            const sliceHeight = Math.floor(Math.random() * 20) + 5;
            const shiftX = Math.floor((Math.random() - 0.5) * width * effectIntensity * 0.5);
            
            // Only create slices sometimes, based on intensity
            if (Math.random() < effectIntensity) {
                // Get slice image data
                const sliceData = ctx.getImageData(0, y, width, sliceHeight);
                
                // Clear the slice area
                ctx.clearRect(0, y, width, sliceHeight);
                
                // Draw the slice data shifted
                ctx.putImageData(sliceData, shiftX, y);
            }
        }
    }

    /**
     * Apply blur effect
     * @param {Uint8ClampedArray} data - Image data array
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} intensity - Effect intensity (0-100)
     */
    function applyBlur(data, width, height, intensity) {
        // Box blur implementation - simplified for performance
        const kernel = Math.floor(intensity / 100 * 10) + 1;
        const tempData = new Uint8ClampedArray(data.length);
        
        // Copy original data
        for (let i = 0; i < data.length; i++) {
            tempData[i] = data[i];
        }
        
        // Approximated box blur by sampling nearby pixels
        for (let y = kernel; y < height - kernel; y++) {
            for (let x = kernel; x < width - kernel; x++) {
                const idx = (y * width + x) * 4;
                
                let r = 0, g = 0, b = 0, a = 0, count = 0;
                
                // Sample a window of pixels
                for (let ky = -kernel; ky <= kernel; ky += kernel) {
                    for (let kx = -kernel; kx <= kernel; kx += kernel) {
                        const sampleIdx = ((y + ky) * width + (x + kx)) * 4;
                        r += tempData[sampleIdx];
                        g += tempData[sampleIdx + 1];
                        b += tempData[sampleIdx + 2];
                        a += tempData[sampleIdx + 3];
                        count++;
                    }
                }
                
                // Set pixel to average value
                data[idx] = r / count;
                data[idx + 1] = g / count;
                data[idx + 2] = b / count;
                data[idx + 3] = a / count;
            }
        }
    }

    /**
     * Apply warp effect (wavy distortion)
     * @param {Uint8ClampedArray} data - Image data array
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} intensity - Effect intensity (0-100)
     */
    function applyWarp(data, width, height, intensity) {
        const effectIntensity = intensity / 100 * 20;
        const tempData = new Uint8ClampedArray(data.length);
        
        // Copy original data
        for (let i = 0; i < data.length; i++) {
            tempData[i] = data[i];
        }
        
        // Get time-based animation value
        const time = Date.now() / 1000;
        
        // Apply wave distortion
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate wave distortion
                const distortX = Math.sin(y * 0.05 + time * 2) * effectIntensity;
                const distortY = Math.cos(x * 0.05 + time * 2) * effectIntensity;
                
                // Get source coordinates
                const sourceX = Math.floor(x + distortX);
                const sourceY = Math.floor(y + distortY);
                
                // Check if source is within bounds
                if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
                    const destIdx = (y * width + x) * 4;
                    const sourceIdx = (sourceY * width + sourceX) * 4;
                    
                    // Copy source pixel to destination
                    data[destIdx] = tempData[sourceIdx];
                    data[destIdx + 1] = tempData[sourceIdx + 1];
                    data[destIdx + 2] = tempData[sourceIdx + 2];
                    data[destIdx + 3] = tempData[sourceIdx + 3];
                }
            }
        }
    }

    /**
     * Apply pixelate effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} intensity - Effect intensity (0-100)
     */
    function applyPixelate(ctx, width, height, intensity) {
        // Calculate pixel size based on intensity
        const pixelSize = Math.max(2, Math.floor(intensity / 100 * 20));
        
        // Get current canvas content
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(ctx.canvas, 0, 0);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw pixelated version
        for (let y = 0; y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
                // Limit dimensions to prevent going out of bounds
                const pixelWidth = Math.min(pixelSize, width - x);
                const pixelHeight = Math.min(pixelSize, height - y);
                
                // Get the color of the first pixel in this block
                const pixelData = tempCtx.getImageData(x, y, 1, 1).data;
                
                // Draw a rectangle with that color
                ctx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                ctx.fillRect(x, y, pixelWidth, pixelHeight);
            }
        }
    }
    
    // Public API
    return {
        applyFilmGrain,
        applyNoise,
        applyScanlines,
        applyGlitch,
        applyBlur,
        applyWarp,
        applyPixelate
    };
})();

// Export for use in other modules
window.DistortionEffects = DistortionEffects;
