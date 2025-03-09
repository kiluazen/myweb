/**
 * Cursor Flow Helpers
 * 
 * Utilities for element finding, state management, navigation handling,
 * and DOM operations to support the Cursor Flow system.
 */

(function() {
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
    },
    
    /**
     * Get page fingerprint - a unique identifier for the current page
     * Useful for matching user's current position to steps in walkthrough
     */
    getPageFingerprint: function() {
      // Create a fingerprint based on URL, heading text, and key UI elements
      const url = window.location.pathname;
      
      // Get heading text
      const headings = [];
      document.querySelectorAll('h1, h2').forEach(h => {
        if (h.textContent) headings.push(h.textContent.trim());
      });
      
      // Get key navigation elements
      const navItems = [];
      document.querySelectorAll('nav a, .navigation a, .menu a').forEach(a => {
        if (a.textContent) navItems.push(a.textContent.trim());
      });
      
      // Get main content elements (helps identify the page context)
      const contentElements = [];
      document.querySelectorAll('main p, article p, .content p').forEach(p => {
        if (p.textContent && p.textContent.trim().length > 20) {
          contentElements.push(p.textContent.trim().substring(0, 50));
        }
      });
      
      // Get form elements if present (for forms/input pages)
      const formElements = [];
      document.querySelectorAll('form, input[type="text"], input[type="email"], button[type="submit"]').forEach(el => {
        if (el.id || el.name || el.placeholder) {
          formElements.push(`${el.tagName}:${el.id || el.name || el.placeholder}`);
        }
      });
      
      // Create fingerprint object
      return {
        url,
        headings,
        navItems,
        contentElements,
        formElements,
        timestamp: Date.now()
      };
    },
    
    /**
     * Match current page to a step in walkthrough
     * Returns the step index or -1 if no match
     */
    matchPageToStep: function(recording) {
      if (!recording || !recording.interactions || !recording.interactions.length) {
        return -1;
      }
      
      const currentUrl = window.location.pathname;
      const currentFingerprint = this.getPageFingerprint();
      
      // First pass: exact URL match
      for (let i = 0; i < recording.interactions.length; i++) {
        const interaction = recording.interactions[i];
        if (interaction.pageInfo && interaction.pageInfo.path === currentUrl) {
          return i;
        }
      }
      
      // Second pass: fingerprint matching for similar pages
      for (let i = 0; i < recording.interactions.length; i++) {
        const interaction = recording.interactions[i];
        if (!interaction.pageInfo) continue;
        
        // Skip if URLs are completely different domains
        if (interaction.pageInfo.url && 
            new URL(interaction.pageInfo.url).hostname !== window.location.hostname) {
          continue;
        }
        
        // Check for similarity in headings or content
        if (interaction.pageFingerprint) {
          const matchScore = this.compareFingerprints(currentFingerprint, interaction.pageFingerprint);
          if (matchScore > 0.7) { // 70% confidence threshold
            return i;
          }
        }
        
        // Check for similar path structure
        const interactionPath = interaction.pageInfo.path;
        if (interactionPath && this.comparePaths(currentUrl, interactionPath) > 0.6) {
          return i;
        }
      }
      
      return -1;
    },
    
    /**
     * Compare two page fingerprints and return similarity score (0-1)
     */
    compareFingerprints: function(fp1, fp2) {
      if (!fp1 || !fp2) return 0;
      
      let score = 0;
      let totalWeight = 0;
      
      // URL matching has highest weight
      if (fp1.url === fp2.url) {
        score += 0.4;
      } else if (this.comparePaths(fp1.url, fp2.url) > 0.7) {
        score += 0.3;
      }
      totalWeight += 0.4;
      
      // Heading matches
      if (fp1.headings && fp2.headings && fp1.headings.length && fp2.headings.length) {
        const headingMatch = this.compareArrays(fp1.headings, fp2.headings);
        score += headingMatch * 0.3;
        totalWeight += 0.3;
      }
      
      // Nav items
      if (fp1.navItems && fp2.navItems && fp1.navItems.length && fp2.navItems.length) {
        const navMatch = this.compareArrays(fp1.navItems, fp2.navItems);
        score += navMatch * 0.15;
        totalWeight += 0.15;
      }
      
      // Content elements
      if (fp1.contentElements && fp2.contentElements && 
          fp1.contentElements.length && fp2.contentElements.length) {
        const contentMatch = this.compareArrays(fp1.contentElements, fp2.contentElements);
        score += contentMatch * 0.15;
        totalWeight += 0.15;
      }
      
      // Normalize score based on weights applied
      return totalWeight > 0 ? score / totalWeight : 0;
    },
    
    /**
     * Compare two arrays of strings and return similarity (0-1)
     */
    compareArrays: function(arr1, arr2) {
      if (!arr1 || !arr2 || !arr1.length || !arr2.length) return 0;
      
      let matches = 0;
      
      // Look for exact matches
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i] === arr2[j]) {
            matches++;
            break;
          }
        }
      }
      
      // If low exact matches, try partial matching
      if (matches / Math.min(arr1.length, arr2.length) < 0.5) {
        matches = 0;
        for (let i = 0; i < arr1.length; i++) {
          for (let j = 0; j < arr2.length; j++) {
            // Check if one string contains the other
            if (arr1[i].includes(arr2[j]) || arr2[j].includes(arr1[i])) {
              matches += 0.7; // Partial match counts less than exact
              break;
            }
          }
        }
      }
      
      return matches / Math.min(arr1.length, arr2.length);
    },
    
    /**
     * Compare two URL paths for similarity (0-1)
     */
    comparePaths: function(path1, path2) {
      if (path1 === path2) return 1;
      
      // Remove trailing slashes for comparison
      path1 = path1.replace(/\/$/, '');
      path2 = path2.replace(/\/$/, '');
      
      // Split paths into segments
      const segments1 = path1.split('/').filter(s => s.length > 0);
      const segments2 = path2.split('/').filter(s => s.length > 0);
      
      if (segments1.length === 0 && segments2.length === 0) return 1;
      
      let matches = 0;
      const maxSegments = Math.max(segments1.length, segments2.length);
      
      // Compare segments
      for (let i = 0; i < maxSegments; i++) {
        if (i < segments1.length && i < segments2.length) {
          if (segments1[i] === segments2[i]) {
            matches++;
          } else if (this.isIdSegment(segments1[i]) && this.isIdSegment(segments2[i])) {
            // Both appear to be IDs (like UUIDs, numbers, etc.)
            matches += 0.8;
          }
        }
      }
      
      return matches / maxSegments;
    },
    
    /**
     * Check if a path segment appears to be an ID
     */
    isIdSegment: function(segment) {
      // Check for numeric IDs
      if (/^\d+$/.test(segment)) return true;
      
      // Check for UUID-like strings
      if (/^[0-9a-f-]{8,}$/.test(segment)) return true;
      
      // Check for slug-like strings with hyphens
      if (/^[a-z0-9]+-[a-z0-9-]+$/.test(segment)) return true;
      
      return false;
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
    },
    
    /**
     * Check if current page matches any step in the walkthrough
     * Returns the matching step index or -1
     */
    findMatchingStep: function(recording) {
      return ElementUtils.matchPageToStep(recording);
    },
    
    /**
     * Determine if user navigation matches expected flow
     * Returns true if navigation is on the expected path
     */
    isNavigationOnPath: function(currentPath, recording, currentStep) {
      if (!recording || !recording.interactions) return false;
      
      // Check if current path matches any upcoming step
      for (let i = currentStep; i < recording.interactions.length; i++) {
        const step = recording.interactions[i];
        if (step.pageInfo && step.pageInfo.path === currentPath) {
          return true;
        }
      }
      
      return false;
    }
  };

  // State management utilities
  const StateManager = {
    /**
     * Save cursor flow state to session storage
     */
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
    
    /**
     * Restore cursor flow state from session storage
     */
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
    },
    
    /**
     * Clear saved state
     */
    clear: function() {
      try {
        sessionStorage.removeItem('cursorFlowState');
      } catch (error) {
        console.error('Failed to clear state:', error);
      }
    }
  };

  // Export these utilities
  window.CursorFlowHelpers = {
    ElementUtils,
    StateManager,
    NavigationUtils
  };
})(); 