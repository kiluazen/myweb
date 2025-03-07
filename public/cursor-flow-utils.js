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
    
    // Try by ID first (most reliable)
    if (element.id) {
      targetElement = document.getElementById(element.id);
      if (targetElement) return targetElement;
    }
    
    // For long blog post titles, try with href attributes and partial text matching
    if (element.tagName === 'A' && element.textContent && element.textContent.length > 30) {
      const links = document.querySelectorAll('a');
      
      // First try with the first 30 characters for a partial match
      const startText = element.textContent.substring(0, 30);
      for (let i = 0; i < links.length; i++) {
        if (links[i].textContent.startsWith(startText)) {
          return links[i];
        }
      }
      
      // Try with any significant substring
      for (let i = 0; i < links.length; i++) {
        if (links[i].textContent.includes(element.textContent.substring(5, 25))) {
          return links[i];
        }
      }
    }
    
    // Try by DOM path
    if (element.path && element.path.length) {
      try {
        const pathSelector = element.path.join(' > ');
        targetElement = document.querySelector(pathSelector);
        if (targetElement) return targetElement;
        
        // Try simplified path
        if (element.path.length > 3) {
          const simplifiedPath = element.path.slice(-3).join(' > ');
          targetElement = document.querySelector(simplifiedPath);
          if (targetElement) return targetElement;
        }
      } catch (e) {
        // Silently fail and try next method
      }
    }
    
    // Try by CSS selector
    if (element.cssSelector) {
      try {
        // Add jQuery-like :contains selector if needed
        this.ensureContainsSelector(document);
        
        targetElement = document.querySelector(element.cssSelector);
        if (targetElement) return targetElement;
      } catch (e) {
        // Silently fail and try next method
      }
    }
    
    // Try by tag and text content
    if (element.tagName && element.textContent) {
      const elements = document.getElementsByTagName(element.tagName);
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent.trim() === element.textContent.trim()) {
          return elements[i];
        }
      }
      
      // Try partial match
      if (element.tagName === 'A' || element.tagName === 'BUTTON') {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].textContent.includes(element.textContent.substring(0, 20))) {
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
            return elementsAtPoint[i];
          }
        }
        return elementsAtPoint[0];
      }
    }
    
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
  },
  
  /**
   * Check if we should wait for content to load
   */
  shouldWaitForContent: function(currentPath) {
    const blogPostsContainer = document.querySelector('h2 a, main a');
    if (!blogPostsContainer && (currentPath.includes('/writing/ideas') || currentPath.includes('/writing'))) {
      return true;
    }
    return false;
  }
};

// UI utilities
const UIUtils = {
  /**
   * Create the start button
   */
  createButton: function(text, color, onClick) {
    // Remove existing button if any
    const existingButton = document.getElementById('cursor-flow-start-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Create the button element
    const button = document.createElement('button');
    button.id = 'cursor-flow-start-button';
    button.textContent = text;
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 10px 15px;
      background-color: ${color};
      color: white;
      border: none;
      border-radius: 20px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 9998;
      transition: transform 0.2s, background-color 0.2s;
    `;
    
    // Add hover effect
    button.onmouseover = () => {
      button.style.transform = 'scale(1.05)';
    };
    button.onmouseout = () => {
      button.style.transform = 'scale(1)';
    };
    
    // Add click handler
    button.onclick = onClick;
    
    // Add to document
    document.body.appendChild(button);
    return button;
  },
  
  /**
   * Create the cursor element
   */
  createCursor: function(config) {
    // Remove existing cursor if any
    const existingCursor = document.getElementById('cursor-flow-cursor');
    if (existingCursor) {
      existingCursor.remove();
    }
    
    // Create cursor container
    const cursorContainer = document.createElement('div');
    cursorContainer.id = 'cursor-flow-cursor';
    cursorContainer.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      display: none;
      transition: left ${config.animationDuration}ms, top ${config.animationDuration}ms;
      transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 0;
    `;
    
    // Create SVG cursor
    const cursor = document.createElement('img');
    cursor.src = '/icons8-cursor.svg';
    cursor.style.cssText = `
      width: 28px;
      height: 28px;
      transform: translate(-7px, -7px); /* Adjust to position the tip precisely */
      margin: 0;
      padding: 0;
    `;
    
    // Create text box for context
    const textBox = document.createElement('div');
    textBox.id = 'cursor-flow-text';
    textBox.style.cssText = `
      background-color: #ffffff;
      border: 2px solid ${config.cursorColor};
      border-radius: 6px;
      padding: 6px 10px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      max-width: 220px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      margin: 0;
      margin-left: 1px;
      white-space: normal;
      line-height: 1.3;
    `;
    textBox.textContent = "Click this element to continue";
    
    // Add components to container
    cursorContainer.appendChild(cursor);
    cursorContainer.appendChild(textBox);
    document.body.appendChild(cursorContainer);
    
    return cursorContainer;
  },
  
  /**
   * Create the highlight element
   */
  createHighlight: function(config) {
    // Remove existing highlight if any
    const existingHighlight = document.getElementById('cursor-flow-highlight');
    if (existingHighlight) {
      existingHighlight.remove();
    }
    
    const highlight = document.createElement('div');
    highlight.id = 'cursor-flow-highlight';
    highlight.style.cssText = `
      position: absolute;
      pointer-events: none;
      z-index: 9997;
      background-color: ${config.highlightColor};
      border: 2px solid ${config.highlightBorderColor};
      border-radius: 4px;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
      display: none;
    `;
    document.body.appendChild(highlight);
    
    // Add animation styles if they don't exist
    if (!document.getElementById('cursor-flow-styles')) {
      const style = document.createElement('style');
      style.id = 'cursor-flow-styles';
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    return highlight;
  },
  
  /**
   * Move the cursor to an element
   */
  moveCursorToElement: function(element, cursor) {
    if (!element || !cursor) return;
    
    const rect = element.getBoundingClientRect();
    
    // Position cursor at the bottom right of the element
    const x = rect.right;
    const y = rect.bottom;
    
    cursor.style.display = 'flex';
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    
    // Update text content if we have interaction data
    if (window.CursorFlowState && window.CursorFlowState.recording && window.CursorFlowState.currentStep !== undefined) {
      const interaction = window.CursorFlowState.recording.interactions[window.CursorFlowState.currentStep];
      if (interaction) {
        this.updateCursorText(cursor, interaction);
      }
    }
  },
  
  /**
   * Position the highlight around an element
   */
  highlightElement: function(element, highlight, state) {
    if (!element || !highlight) return;
    
    // Immediately position the highlight first
    const rect = element.getBoundingClientRect();
    highlight.style.position = 'fixed';
    highlight.style.left = `${rect.left - 4}px`;
    highlight.style.top = `${rect.top - 4}px`;
    highlight.style.width = `${rect.width + 8}px`;
    highlight.style.height = `${rect.height + 8}px`;
    highlight.style.display = 'block';
    highlight.style.animation = 'pulse 1.5s infinite';
    
    // Scroll element into view if needed
    if (typeof element.scrollIntoView === 'function') {
      try {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        // Fallback if smooth scrolling not supported
      }
    }
    
    // Create or update positioning function
    if (!window.__cursorFlowUpdateHighlight) {
      // Define a function to update the highlight position
      window.__cursorFlowUpdateHighlight = function() {
        if (!state.targetElement || !state.highlight) return;
        
        const rect = state.targetElement.getBoundingClientRect();
        const highlight = state.highlight;
        
        highlight.style.position = 'fixed';
        highlight.style.left = `${rect.left - 4}px`;
        highlight.style.top = `${rect.top - 4}px`;
        highlight.style.width = `${rect.width + 8}px`;
        highlight.style.height = `${rect.height + 8}px`;
        highlight.style.display = 'block';
        
        // Request next frame for smooth animation
        if (window.__cursorFlowUpdateHighlight) {
          requestAnimationFrame(window.__cursorFlowUpdateHighlight);
        }
      };
    }
    
    // Start the update loop
    requestAnimationFrame(window.__cursorFlowUpdateHighlight);
  },
  
  /**
   * Show page mismatch alert
   */
  showPageMismatchAlert: function(expectedPath) {
    const alertEl = document.createElement('div');
    alertEl.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 20px;
      background-color: #f97316;
      color: white;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      text-align: center;
    `;
    alertEl.textContent = `This guide requires you to be on page: ${expectedPath}`;
    document.body.appendChild(alertEl);
    
    setTimeout(() => alertEl.remove(), 5000);
  },
  
  /**
   * Update the cursor text based on the current interaction
   */
  updateCursorText: function(cursor, interaction) {
    if (!cursor || !interaction) return;
    
    const textEl = cursor.querySelector('#cursor-flow-text');
    if (textEl) {
      const elementName = interaction.element.textContent || 'this element';
      const pagePath = interaction.pageInfo.path;
      
      // Add additional context for external sites
      let pageInfo = `<span style="font-size: 11px; opacity: 0.8;">Page: ${pagePath}</span>`;
      if (pagePath.includes('/machine_learning') || !pagePath.startsWith('/')) {
        pageInfo = `<span style="font-size: 11px; opacity: 0.8; color: #e74c3c;">External site: ${interaction.pageInfo.url}</span>`;
      }
      
      textEl.innerHTML = `<strong>Click:</strong> "${elementName.length > 25 ? elementName.substring(0, 25) + '...' : elementName}"<br>${pageInfo}`;
    }
  },
  
  /**
   * Show external site alert
   */
  showExternalSiteAlert: function(url) {
    const alertEl = document.createElement('div');
    alertEl.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 20px;
      background-color: #e74c3c;
      color: white;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      text-align: center;
    `;
    alertEl.innerHTML = `This guide continues on an external site:<br><a href="${url}" target="_blank" style="color: white; text-decoration: underline;">${url}</a>`;
    document.body.appendChild(alertEl);
    
    setTimeout(() => alertEl.remove(), 8000);
  }
};

// Navigation utilities
const NavigationUtils = {
  /**
   * Set up navigation detection
   */
  setup: function(state, onStart, onComplete) {
    // Store the current URL
    state.lastUrl = window.location.pathname;
    
    // Listen for Next.js route changes
    if (typeof window !== 'undefined' && window.next) {
      try {
        // For newer versions of Next.js
        window.next.router.events.on('routeChangeStart', onStart);
        window.next.router.events.on('routeChangeComplete', onComplete);
      } catch (e) {
        // Silently fail and use fallbacks
      }
    }
    
    // Fallback: Observe the body for changes, which happens during navigation
    const bodyObserver = new MutationObserver((mutations) => {
      const currentUrl = window.location.pathname;
      if (currentUrl !== state.lastUrl) {
        state.lastUrl = currentUrl;
        onComplete(currentUrl);
      }
    });
    
    bodyObserver.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    // Also monitor URL changes directly
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      
      // After pushState, check if navigation is happening
      const currentUrl = window.location.pathname;
      if (currentUrl !== state.lastUrl) {
        state.lastUrl = currentUrl;
        state.navigationInProgress = true;
        
        // Handle completion after a delay
        setTimeout(() => {
          state.navigationInProgress = false;
          onComplete(currentUrl);
        }, 500);
      }
    };
  }
};

// State management utilities
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
  StateManager,
  UIUtils,
  NavigationUtils
}; 