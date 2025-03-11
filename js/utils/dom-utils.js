/**
 * DOM Utility functions for Emotion Visualization App
 */

const DOMUtils = (function() {
    /**
     * Create an element with attributes and children
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Attributes to set
     * @param {Array|string} children - Child elements or text content
     * @returns {HTMLElement} The created element
     */
    function createElement(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else if (key === 'dataset' && typeof value === 'object') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Add children
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof HTMLElement) {
                    element.appendChild(child);
                } else if (child !== null && child !== undefined) {
                    element.appendChild(document.createTextNode(String(child)));
                }
            });
        } else if (children !== null && children !== undefined) {
            element.textContent = String(children);
        }
        
        return element;
    }

    /**
     * Get multiple elements by selector
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (defaults to document)
     * @returns {Array} Array of matched elements
     */
    function getElements(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }

    /**
     * Add event listener with multiple events
     * @param {HTMLElement} element - Element to attach listeners to
     * @param {string|Array} events - Event or array of events
     * @param {Function} callback - Event handler function
     */
    function addEvents(element, events, callback) {
        const eventList = Array.isArray(events) ? events : [events];
        eventList.forEach(event => {
            element.addEventListener(event, callback);
        });
    }

    /**
     * Show a notification message
     * @param {string} message - Message to display
     * @param {string} type - 'success' or 'error'
     * @param {HTMLElement} container - Container element
     * @param {number} duration - Duration in ms (default 3000)
     */
    function showNotification(message, type, container, duration = 3000) {
        container.textContent = message;
        container.className = `notification notification-${type}`;
        
        setTimeout(() => {
            container.textContent = '';
            container.className = 'notification';
        }, duration);
    }

    /**
     * Set multiple style properties
     * @param {HTMLElement} element - Element to style
     * @param {Object} styles - Style properties object
     */
    function setStyles(element, styles) {
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
        });
    }
    
    /**
     * Debounce function to limit rate of execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Milliseconds to wait
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Public API
    return {
        createElement,
        getElements,
        addEvents,
        showNotification,
        setStyles,
        debounce
    };
})();

// Export for use in other modules
window.DOMUtils = DOMUtils;
