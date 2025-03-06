/**
 * Cursor Flow Utilities
 */

// Element finding utilities
const ElementUtils = {
  /**
   * Find an element based on various selectors from the recorded interaction
   */
  findElementFromInteraction: function(interaction, document) {
    const element = interaction.element;
    let targetElement = null;
    
    console.log('Looking for element:', {
      tagName: element.tagName,
      text: element.textContent,
      selector: element.cssSelector
    });
    
    // Try by ID first (most reliable)
    if (element.id) {
      targetElement = document.getElementById(element.id);
      if (targetElement) {
        console.log('Found element by ID:', element.id);
        return targetElement;
      }
    }
    
    // For long blog post titles, try with href attributes and partial text matching
    if (element.tagName === 'A' && element.textContent && element.textContent.length > 30) {
      console.log('Long text detected, trying partial text match for link');
      const links = document.querySelectorAll('a');
      
      // First try with the first 30 characters for a partial match
      const startText = element.textContent.substring(0, 30);
      for (let i = 0; i < links.length; i++) {
        if (links[i].textContent.startsWith(startText)) {
          console.log('Found link by partial text match (first 30 chars):', startText);
          return links[i];
        }
      }
      
      // Try with any significant substring
      for (let i = 0; i < links.length; i++) {
        if (links[i].textContent.includes(element.textContent.substring(5, 25))) {
          console.log('Found link by significant substring match');
          return links[i];
        }
      }
    }
    
    // Try by DOM path
    if (element.path && element.path.length) {
      try {
        const pathSelector = element.path.join(' > ');
        targetElement = document.querySelector(pathSelector);
        if (targetElement) {
          console.log('Found element by DOM path:', pathSelector);
          return targetElement;
        }
        
        // Try simplified path
        if (element.path.length > 3) {
          const simplifiedPath = element.path.slice(-3).join(' > ');
          targetElement = document.querySelector(simplifiedPath);
          if (targetElement) {
            console.log('Found element by simplified path');
            return targetElement;
          }
        }
      } catch (e) {
        console.log('Error with path selector:', e.message);
      }
    }
    
    // Try by CSS selector
    if (element.cssSelector) {
      try {
        // Add jQuery-like :contains selector if needed
        this.ensureContainsSelector(document);
        
        targetElement = document.querySelector(element.cssSelector);
        if (targetElement) {
          console.log('Found element by CSS selector');
          return targetElement;
        }
      } catch (e) {
        console.log('Error with selector:', e.message);
      }
    }
    
    // Try by tag and text content
    if (element.tagName && element.textContent) {
      const elements = document.getElementsByTagName(element.tagName);
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent.trim() === element.textContent.trim()) {
          console.log('Found element by tag + exact text');
          return elements[i];
        }
      }
      
      // Try partial match
      if (element.tagName === 'A' || element.tagName === 'BUTTON') {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].textContent.includes(element.textContent.substring(0, 20))) {
            console.log('Found element by tag + partial text');
            return elements[i];
          }
        }
      }
    }
    
    // Try by position as last resort
    if (element.elementRect) {
      const rect = element.elementRect;
      const x = rect.left + (rect.width / 2);
      const y = rect.top + (rect.height / 2);
      
      const elementsAtPoint = document.elementsFromPoint(x, y);
      if (elementsAtPoint.length > 0) {
        for (let i = 0; i < elementsAtPoint.length; i++) {
          if (elementsAtPoint[i].tagName === 'A' || 
              elementsAtPoint[i].tagName === 'BUTTON' ||
              elementsAtPoint[i].onclick) {
            console.log('Found clickable element at position');
            return elementsAtPoint[i];
          }
        }
        return elementsAtPoint[0];
      }
    }
    
    console.warn('Could not find element');
    return null;
  },
  
  /**
   * Ensure the :contains selector is available
   */
  ensureContainsSelector: function(document) {
    if (!document.querySelector(':contains') && document.querySelector.toString().indexOf(':contains') === -1) {
      document.querySelector = (function(orig) {
        return function(selector) {
          if (selector.includes(':contains(')) {
            const parts = selector.split(':contains(');
            const tag = parts[0];
            const text = parts[1].slice(0, -1).replace(/"/g, '');
            const elements = document.querySelectorAll(tag);
            for (let i = 0; i < elements.length; i++) {
              if (elements[i].textContent.includes(text)) {
                return elements[i];
              }
            }
            return null;
          }
          return orig.call(this, selector);
        };
      })(document.querySelector);
    }
  },
  
  /**
   * Check if element is visible
   */
  isElementVisible: function(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
};

// Create a utility to handle state persistence
const StateManager = {
  save: function(state) {
    try {
      const stateToSave = {
        isPlaying: state.isPlaying,
        currentStep: state.currentStep,
        sessionId: state.sessionId
      };
      
      sessionStorage.setItem('cursorFlowState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  },
  
  restore: function() {
    try {
      const savedState = sessionStorage.getItem('cursorFlowState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Failed to restore state:', error);
    }
    return null;
  }
};

// Export these utilities
window.CursorFlowUtils = {
  ElementUtils,
  StateManager
}; 