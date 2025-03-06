/**
 * Cursor Flow
 * 
 * Plays back recorded user interactions with an animated cursor.
 * Guides users through a workflow with visual cues.
 * Maintains state across page navigation.
 * Requires user to click on highlighted elements to proceed.
 */

(function() {
  // Prevent multiple initializations
  if (window.__CURSOR_FLOW_INITIALIZED__) {
    console.log('Cursor Flow already initialized');
    return;
  }
  window.__CURSOR_FLOW_INITIALIZED__ = true;

  // Configuration
  const config = {
    cursorSize: 20,
    cursorColor: '#22c55e', // Green
    highlightColor: 'rgba(34, 197, 94, 0.3)',
    highlightBorderColor: '#22c55e',
    animationDuration: 800, // ms
    startButtonColor: '#22c55e',
    defaultSession: null // Will be set by API
  };

  // State
  let state = {
    isPlaying: false,
    currentStep: 0,
    recording: null,
    cursor: null,
    highlight: null,
    startButton: null,
    targetElement: null,
    sessionId: null
  };

  /**
   * Initialize the cursor flow
   */
  function init() {
    console.log('Cursor Flow initializing...');
    
    // First check if we have an active session in progress
    restoreState();
    
    // Log more info about current page and state
    console.log(`Current page: ${window.location.pathname}, Step: ${state.currentStep}`);
    
    // First fetch the index to get the latest session if we don't have one
    if (!state.sessionId) {
      fetchSessionIndex()
        .then(createStartButton)
        .catch(error => {
          console.error('Failed to initialize Cursor Flow:', error);
        });
    } else {
      // We're continuing a session
      console.log(`Continuing session ${state.sessionId}, step ${state.currentStep}`);
      createStartButton();
      
      // If we were playing, resume after a short delay to allow the page to render
      if (state.isPlaying) {
        setTimeout(() => {
          loadRecording(state.sessionId)
            .then(() => {
              createVisualElements();
              // Log the current step and intended target before playing
              if (state.recording && state.recording.interactions[state.currentStep]) {
                const nextStep = state.recording.interactions[state.currentStep];
                console.log(`Attempting to highlight element: ${nextStep.element.tagName} with text "${nextStep.element.textContent}"`);
                console.log(`Target should be on page: ${nextStep.pageInfo?.path}`);
              }
              playNextStep();
            });
        }, 1000);
      }
    }
  }

  /**
   * Restore state from sessionStorage
   */
  function restoreState() {
    try {
      const savedState = sessionStorage.getItem('cursorFlowState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Restore the important parts of state
        state.isPlaying = parsedState.isPlaying;
        state.currentStep = parsedState.currentStep;
        state.sessionId = parsedState.sessionId;
        
        console.log('Restored state:', { 
          isPlaying: state.isPlaying, 
          currentStep: state.currentStep,
          sessionId: state.sessionId
        });
      }
    } catch (error) {
      console.error('Failed to restore state:', error);
    }
  }

  /**
   * Save state to sessionStorage
   */
  function saveState() {
    try {
      // Only save the essentials
      const stateToSave = {
        isPlaying: state.isPlaying,
        currentStep: state.currentStep,
        sessionId: state.sessionId
      };
      
      sessionStorage.setItem('cursorFlowState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  /**
   * Fetch the session index to get available recordings
   */
  function fetchSessionIndex() {
    return fetch('/cursor-recording/index.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch session index: ${response.status}`);
        }
        return response.json();
      })
      .then(indexData => {
        if (indexData.sessions && indexData.sessions.length > 0) {
          // Use the most recent session by default
          state.sessionId = indexData.sessions[0].id;
          console.log(`Using latest session: ${state.sessionId}`);
          saveState();
          return state.sessionId;
        } else {
          throw new Error('No recording sessions found');
        }
      });
  }

  /**
   * Create visual elements (cursor and highlight)
   */
  function createVisualElements() {
    if (!state.cursor) createCursor();
    if (!state.highlight) createHighlight();
  }

  /**
   * Create the floating start button
   */
  function createStartButton() {
    // Create the button element
    const button = document.createElement('button');
    button.id = 'cursor-flow-start-button';
    button.textContent = state.isPlaying ? 'Stop Guide' : 'Start Guide';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 10px 15px;
      background-color: ${config.startButtonColor};
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
    
    // Don't create duplicate buttons
    const existingButton = document.getElementById('cursor-flow-start-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Add hover effect
    button.onmouseover = () => {
      button.style.transform = 'scale(1.05)';
    };
    button.onmouseout = () => {
      button.style.transform = 'scale(1)';
    };
    
    // Add click handler
    button.onclick = () => {
      if (state.isPlaying) {
        stopPlayback();
        button.textContent = 'Start Guide';
      } else {
        startPlayback();
        button.textContent = 'Stop Guide';
      }
    };
    
    // Add to document
    document.body.appendChild(button);
    state.startButton = button;
    
    console.log('Start button created');
    return button;
  }

  /**
   * Create the cursor element
   */
  function createCursor() {
    // Remove existing cursor if any
    const existingCursor = document.getElementById('cursor-flow-cursor');
    if (existingCursor) {
      existingCursor.remove();
    }
    
    const cursor = document.createElement('div');
    cursor.id = 'cursor-flow-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: ${config.cursorSize}px;
      height: ${config.cursorSize}px;
      border-radius: 50%;
      background-color: ${config.cursorColor};
      opacity: 0.8;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
      transition: left ${config.animationDuration}ms, top ${config.animationDuration}ms;
      transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
      display: none;
    `;
    document.body.appendChild(cursor);
    state.cursor = cursor;
    return cursor;
  }

  /**
   * Create the highlight element
   */
  function createHighlight() {
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
    state.highlight = highlight;
    
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
  }

  /**
   * Load a recording session
   */
  function loadRecording(sessionId) {
    const sessionFile = `/cursor-recording/session-${sessionId}.json`;
    console.log(`Loading recording from ${sessionFile}`);
    
    return fetch(sessionFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load recording: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        state.recording = data.recording;
        console.log(`Loaded recording with ${state.recording.interactions.length} interactions`);
        return data.recording;
      });
  }

  /**
   * Start playback of the recording
   */
  function startPlayback() {
    if (state.isPlaying) return;
    
    // Create visual elements if they don't exist
    createVisualElements();
    
    // Load the recording and start
    loadRecording(state.sessionId)
      .then(() => {
        state.isPlaying = true;
        saveState();
        playNextStep();
      })
      .catch(error => {
        console.error('Failed to start playback:', error);
      });
  }

  /**
   * Stop playback
   */
  function stopPlayback() {
    state.isPlaying = false;
    
    // Stop the highlight update loop
    if (window.__cursorFlowUpdateHighlight) {
      window.__cursorFlowUpdateHighlight = null;
    }
    
    // Hide cursor and highlight
    if (state.cursor) {
      state.cursor.style.display = 'none';
    }
    if (state.highlight) {
      state.highlight.style.display = 'none';
    }
    
    // Remove event listeners
    if (state.targetElement) {
      state.targetElement.removeEventListener('click', handleTargetClick);
      state.targetElement = null;
    }
    
    // Update button
    if (state.startButton) {
      state.startButton.textContent = 'Start Guide';
    }
    
    // Save state
    saveState();
    
    console.log('Playback stopped');
  }

  /**
   * Find an element based on various selectors from the recorded interaction
   */
  function findElementFromInteraction(interaction) {
    const element = interaction.element;
    let targetElement = null;
    
    console.log('Looking for element:', {
      tagName: element.tagName,
      text: element.textContent,
      selector: element.cssSelector,
      path: element.path ? element.path.join(' > ') : 'none'
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
        // Check if link contains a significant portion of the text
        if (links[i].textContent.includes(element.textContent.substring(5, 25))) {
          console.log('Found link by significant substring match');
          return links[i];
        }
      }
    }
    
    // Try by DOM path (added for Puppeteer recordings)
    if (element.path && element.path.length) {
      try {
        const pathSelector = element.path.join(' > ');
        targetElement = document.querySelector(pathSelector);
        if (targetElement) {
          console.log('Found element by DOM path:', pathSelector);
          return targetElement;
        }
        
        // Try simplified path - just the last 3 parts which are often more stable
        if (element.path.length > 3) {
          const simplifiedPath = element.path.slice(-3).join(' > ');
          console.log('Trying simplified path:', simplifiedPath);
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
    
    // Try by CSS selector (Puppeteer often uses a:contains())
    if (element.cssSelector) {
      try {
        // Add jQuery-like :contains selector if it doesn't exist
        if (!document.querySelector(':contains') && element.cssSelector.includes(':contains(')) {
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
        
        targetElement = document.querySelector(element.cssSelector);
        if (targetElement) {
          console.log('Found element by CSS selector:', element.cssSelector);
          return targetElement;
        }
      } catch (e) {
        console.log('Error with selector, trying alternatives:', e.message);
      }
    }
    
    // Try by text content + tag name
    if (element.tagName && element.textContent) {
      const elements = document.getElementsByTagName(element.tagName);
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent.trim() === element.textContent.trim()) {
          console.log('Found element by tag + exact text:', element.tagName, element.textContent);
          return elements[i];
        }
      }
      
      // Try partial match for links and buttons (helps with longer text items)
      if (element.tagName === 'A' || element.tagName === 'BUTTON') {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].textContent.includes(element.textContent.trim().substring(0, 20))) {
            console.log('Found element by tag + partial text:', element.tagName, element.textContent.substring(0, 20));
            return elements[i];
          }
        }
      }
    }
    
    // Try by position as last resort for specific cases like this long blog title
    if (element.elementRect && (element.textContent.length > 30)) {
      console.log('Trying to find element by position as last resort');
      const rect = element.elementRect;
      const x = rect.left + (rect.width / 2);
      const y = rect.top + (rect.height / 2);
      
      // Get element at position
      const elementsAtPoint = document.elementsFromPoint(x, y);
      if (elementsAtPoint.length > 0) {
        // Find the first clickable element
        for (let i = 0; i < elementsAtPoint.length; i++) {
          if (elementsAtPoint[i].tagName === 'A' || 
              elementsAtPoint[i].tagName === 'BUTTON' ||
              elementsAtPoint[i].onclick) {
            console.log('Found clickable element at position');
            return elementsAtPoint[i];
          }
        }
        console.log('Found element at position (might not be clickable)');
        return elementsAtPoint[0];
      }
    }
    
    console.warn('Could not find element using identification methods');
    return null;
  }

  /**
   * Position the highlight around an element
   */
  function highlightElement(element) {
    if (!element || !state.highlight) return;
    
    console.log(`Highlighting element: ${element.tagName} with text "${element.textContent.trim()}"`);
    
    // Create or update positioning function
    if (!window.__cursorFlowUpdateHighlight) {
      // Define a function to update the highlight position
      window.__cursorFlowUpdateHighlight = function() {
        if (!state.targetElement || !state.highlight) return;
        
        const rect = state.targetElement.getBoundingClientRect();
        const highlight = state.highlight;
        
        highlight.style.position = 'fixed'; // Change to fixed to follow viewport
        highlight.style.left = `${rect.left - 4}px`;
        highlight.style.top = `${rect.top - 4}px`;
        highlight.style.width = `${rect.width + 4}px`;
        highlight.style.height = `${rect.height + 4}px`;
        highlight.style.display = 'block';
        
        // Request next frame for smooth animation
        requestAnimationFrame(window.__cursorFlowUpdateHighlight);
      };
    }
    
    // Store the current target element
    state.targetElement = element;
    
    // Start the update loop
    state.highlight.style.animation = 'pulse 1.5s infinite';
    window.__cursorFlowUpdateHighlight();
  }

  /**
   * Move the cursor to an element (not to fixed coordinates)
   */
  function moveCursorToElement(element) {
    if (!element || !state.cursor) return;
    
    const rect = element.getBoundingClientRect();
    
    // Position cursor near the center of the element
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);
    
    state.cursor.style.display = 'block';
    state.cursor.style.left = `${x}px`;
    state.cursor.style.top = `${y}px`;
  }

  /**
   * Handle click on the target element
   */
  function handleTargetClick(event) {
    console.log('Target clicked, proceeding to next step');
    
    // Remove click listener from this element
    if (state.targetElement) {
      state.targetElement.removeEventListener('click', handleTargetClick);
    }
    
    // Increment the step counter
    state.currentStep++;
    console.log(`Advanced to step ${state.currentStep}`);
    
    // Save state before navigation happens
    saveState();
    
    // Track what the next step should be (for debugging)
    if (state.recording && state.recording.interactions[state.currentStep]) {
      const nextStep = state.recording.interactions[state.currentStep];
      console.log(`Next element will be: ${nextStep.element.tagName} with text "${nextStep.element.textContent}"`);
      console.log(`Next page should be: ${nextStep.pageInfo?.path}`);
    }
    
    // Let the navigation happen naturally
  }

  /**
   * Play the next step in the recording
   */
  function playNextStep() {
    if (!state.isPlaying || !state.recording) return;
    
    // Double-check we're on the right step
    console.log(`---------------------`);
    console.log(`Playing step ${state.currentStep + 1}/${state.recording.interactions.length}`);
    
    // Check if we've reached the end
    if (state.currentStep >= state.recording.interactions.length) {
      console.log('Playback complete');
      stopPlayback();
      return;
    }
    
    // Get the current interaction
    const interaction = state.recording.interactions[state.currentStep];
    console.log(`Step ${state.currentStep + 1} type: ${interaction.type}`);
    console.log(`Target element: ${interaction.element.tagName} with text "${interaction.element.textContent}"`);
    console.log(`Current page: ${window.location.pathname}`);
    console.log(`Expected page: ${interaction.pageInfo?.path}`);
    
    // Add DOM ready check
    console.log(`DOM ready state: ${document.readyState}`);
    console.log(`Is document fully interactive: ${document.readyState === 'interactive' || document.readyState === 'complete'}`);
    
    // Check if we need to navigate to a different page
    const currentPath = window.location.pathname;
    const interactionPath = interaction.pageInfo?.path;
    
    if (interactionPath && currentPath !== interactionPath) {
      console.log(`⚠️ Page mismatch! Current: ${currentPath}, Expected: ${interactionPath}`);
      // Alert the user about the page mismatch
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
      alertEl.textContent = `This guide requires you to be on page: ${interactionPath}`;
      document.body.appendChild(alertEl);
      
      // Remove after 5 seconds
      setTimeout(() => {
        alertEl.remove();
      }, 5000);
      
      return;
    }
    
    // Add delay to ensure DOM is ready
    console.log(`Waiting for DOM to stabilize before finding element...`);
    setTimeout(() => {
      // Check if target might be in the DOM
      const checkForTargetTag = document.querySelectorAll(interaction.element.tagName);
      console.log(`Found ${checkForTargetTag.length} ${interaction.element.tagName} elements in DOM`);
      
      if (interaction.element.textContent.length > 30) {
        console.log(`Long text content detected (${interaction.element.textContent.length} chars)`);
        
        // Search for any element containing the first 15 chars
        const searchText = interaction.element.textContent.substring(0, 15);
        const foundElements = Array.from(document.querySelectorAll('*')).filter(el => 
          el.textContent.includes(searchText)
        );
        console.log(`Elements containing "${searchText}": ${foundElements.length}`);
        foundElements.forEach((el, i) => {
          console.log(`  Match ${i+1}: <${el.tagName.toLowerCase()}> with text "${el.textContent.substring(0, 30)}..."`);
        });
      }
      
      // Find the target element
      console.log(`Attempting to find target element...`);
      const targetElement = findElementFromInteraction(interaction);
      if (!targetElement) {
        console.warn('❌ Could not find target element for interaction:', interaction);
        
        // Debug why element wasn't found
        console.log(`Dumping all links on page for debugging:`);
        const allLinks = document.querySelectorAll('a');
        console.log(`Total links found: ${allLinks.length}`);
        Array.from(allLinks).slice(0, 10).forEach((link, i) => {
          console.log(`  Link ${i+1}: href="${link.getAttribute('href')}" text="${link.textContent.substring(0, 30)}${link.textContent.length > 30 ? '...' : ''}"`);
        });
        
        // Try again after a longer delay before skipping
        console.log(`Trying again after a longer delay (2 seconds)...`);
        setTimeout(() => {
          const secondAttempt = findElementFromInteraction(interaction);
          if (secondAttempt) {
            console.log(`✅ Found element on second attempt!`);
            continueWithElement(secondAttempt, interaction);
          } else {
            console.warn(`❌ Still couldn't find element after delay, skipping step`);
            // Skip to next step
            state.currentStep++;
            saveState();
            setTimeout(playNextStep, 500);
          }
        }, 2000);
        return;
      }
      
      console.log(`✅ Found target element:`, {
        tagName: targetElement.tagName,
        text: targetElement.textContent.substring(0, 30) + (targetElement.textContent.length > 30 ? '...' : ''),
        href: targetElement.getAttribute ? targetElement.getAttribute('href') : 'N/A',
        isVisible: isElementVisible(targetElement)
      });
      
      continueWithElement(targetElement, interaction);
    }, 1000); // Delay to ensure page is ready
  }

  // Helper to continue with a found element
  function continueWithElement(targetElement, interaction) {
    // Move cursor to the element (not using fixed coordinates)
    moveCursorToElement(targetElement);
    
    // Highlight the element
    highlightElement(targetElement);
    
    // Add click listener to the target element
    targetElement.addEventListener('click', handleTargetClick);
  }

  // Helper to check if element is visible
  function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
