/**
 * Color utility functions for Emotion Visualization App
 */

const ColorUtils = (function() {
    /**
     * Convert RGB to Hex color
     * @param {number} r - Red value (0-255)
     * @param {number} g - Green value (0-255)
     * @param {number} b - Blue value (0-255)
     * @returns {string} Hex color code
     */
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    /**
     * Interpolate between two colors
     * @param {string} color1 - Starting hex color
     * @param {string} color2 - Ending hex color
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {string} Interpolated hex color
     */
    function interpolateColor(color1, color2, factor) {
        if (factor === 0) return color1;
        if (factor === 1) return color2;
        
        // Parse hex colors
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
        
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
        
        // Interpolate RGB values
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        
        // Convert back to hex
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    /**
     * Shade a color (positive percent brightens, negative darkens)
     * @param {string} color - Hex color to shade
     * @param {number} percent - Percentage to adjust brightness (-100 to 100)
     * @returns {string} Modified hex color
     */
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1,3), 16);
        let G = parseInt(color.substring(3,5), 16);
        let B = parseInt(color.substring(5,7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;  
        G = (G < 255) ? G : 255;  
        B = (B < 255) ? B : 255;  

        R = (R > 0) ? R : 0;
        G = (G > 0) ? G : 0;
        B = (B > 0) ? B : 0;

        return "#" + (16777216 + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }

    /**
     * Get complementary color
     * @param {string} hexColor - Original hex color
     * @returns {string} Complementary hex color
     */
    function getComplementaryColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.substring(1, 3), 16);
        const g = parseInt(hexColor.substring(3, 5), 16);
        const b = parseInt(hexColor.substring(5, 7), 16);
        
        // Get complementary colors (255 - value)
        const rComp = 255 - r;
        const gComp = 255 - g;
        const bComp = 255 - b;
        
        // Convert back to hex
        return rgbToHex(rComp, gComp, bComp);
    }

    // Public API
    return {
        rgbToHex,
        interpolateColor,
        shadeColor,
        getComplementaryColor
    };
})();

// Export for use in other modules
window.ColorUtils = ColorUtils;
