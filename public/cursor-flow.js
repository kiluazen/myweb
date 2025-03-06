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
    sessionId: null,
    navigationInProgress: false,
    lastUrl: window.location.pathname
  };

  /**
   * Initialize the cursor flow
   */
  function init() {
    console.log('Cursor Flow initializing...');
    
    // First check if we have an active session in progress
    const savedState = window.CursorFlowUtils.StateManager.restore();
    if (savedState) {
      state.isPlaying = savedState.isPlaying;
      state.currentStep = savedState.currentStep;
      state.sessionId = savedState.sessionId;
      
      console.log('Restored state:', { 
        isPlaying: state.isPlaying, 
        currentStep: state.currentStep,
        sessionId: state.sessionId
      });
    }
    
    // Log more info about current page and state
    console.log(`Current page: ${window.location.pathname}, Step: ${state.currentStep}`);
    
    // Set up navigation detection for Next.js
    setupNavigationDetection();
    
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
   * Set up navigation detection for Next.js
   */
  function setupNavigationDetection() {
    // Store the current URL
    state.lastUrl = window.location.pathname;
    
    // Listen for Next.js route changes
    if (typeof window !== 'undefined' && window.next) {
      console.log('Next.js detected, setting up router change listeners');
      
      try {
        // For newer versions of Next.js
        window.next.router.events.on('routeChangeStart', handleRouteChangeStart);
        window.next.router.events.on('routeChangeComplete', handleRouteChangeComplete);
      } catch (e) {
        console.log('Could not attach to Next.js router events directly');
      }
    }
    
    // Fallback: Observe the body for changes, which happens during navigation
    const bodyObserver = new MutationObserver((mutations) => {
      const currentUrl = window.location.pathname;
      if (currentUrl !== state.lastUrl) {
        console.log(`URL changed from ${state.lastUrl} to ${currentUrl}`);
        state.lastUrl = currentUrl;
        handleRouteChangeComplete(currentUrl);
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
        console.log(`History pushState: URL changed to ${currentUrl}`);
        state.lastUrl = currentUrl;
        state.navigationInProgress = true;
        
        // Handle completion after a delay
        setTimeout(() => {
          state.navigationInProgress = false;
          handleRouteChangeComplete(currentUrl);
        }, 500);
      }
    };
  }

  /**
   * Handle route change start
   */
  function handleRouteChangeStart(url) {
    console.log(`Route change starting to: ${url}`);
    state.navigationInProgress = true;
  }

  /**
   * Handle route change complete
   */
  function handleRouteChangeComplete(url) {
    console.log(`Route change completed to: ${url}`);
    state.navigationInProgress = false;
    
    // If we're playing and on the right step, resume after navigation
    if (state.isPlaying && state.recording) {
      setTimeout(() => {
        const currentStep = state.recording.interactions[state.currentStep];
        if (currentStep && currentStep.pageInfo && currentStep.pageInfo.path === window.location.pathname) {
          console.log('Page matches next step, attempting to resume playback');
          playNextStep();
        } else {
          console.log('Page does not match expected path for current step');
        }
      }, 800); // Reduced from 1500ms
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
          window.CursorFlowUtils.StateManager.save(state);
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
        window.CursorFlowUtils.StateManager.save(state);
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
    window.CursorFlowUtils.StateManager.save(state);
    
    console.log('Playback stopped');
  }

  /**
   * Position the highlight around an element
   */
  function highlightElement(element) {
    if (!element || !state.highlight) return;
    
    console.log(`Highlighting element: ${element.tagName} with text "${element.textContent.trim()}"`);
    
    // Immediately position the highlight first
    const rect = element.getBoundingClientRect();
    state.highlight.style.position = 'fixed';
    state.highlight.style.left = `${rect.left - 4}px`;
    state.highlight.style.top = `${rect.top - 4}px`;
    state.highlight.style.width = `${rect.width + 8}px`;
    state.highlight.style.height = `${rect.height + 8}px`;
    state.highlight.style.display = 'block';
    state.highlight.style.animation = 'pulse 1.5s infinite';
    
    // Scroll element into view if needed
    if (typeof element.scrollIntoView === 'function') {
      try {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        console.log('Could not scroll element into view:', e.message);
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
    
    // Store the current target element
    state.targetElement = element;
    
    // Start the update loop
    requestAnimationFrame(window.__cursorFlowUpdateHighlight);
  }

  /**
   * Move the cursor to an element
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
    window.CursorFlowUtils.StateManager.save(state);
    
    // Track what the next step should be (for debugging)
    if (state.recording && state.recording.interactions[state.currentStep]) {
      const nextStep = state.recording.interactions[state.currentStep];
      console.log(`Next element will be: ${nextStep.element.tagName} with text "${nextStep.element.textContent}"`);
      console.log(`Next page should be: ${nextStep.pageInfo?.path}`);
    }
    
    // Navigation will be detected by the navigation observer
  }

  /**
   * Play the next step in the recording
   */
  function playNextStep() {
    if (!state.isPlaying || !state.recording) return;
    
    // If navigation is in progress, wait
    if (state.navigationInProgress) {
      console.log('Navigation in progress, delaying next step');
      setTimeout(playNextStep, 1000);
      return;
    }
    
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
    
    // Check if we need to navigate to a different page
    const currentPath = window.location.pathname;
    const interactionPath = interaction.pageInfo?.path;
    
    if (interactionPath && currentPath !== interactionPath) {
      console.log(`⚠️ Page mismatch! Current: ${currentPath}, Expected: ${interactionPath}`);
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
      
      setTimeout(() => alertEl.remove(), 5000);
      return;
    }
    
    // KEY CHANGE: For dynamic Next.js routes, check content loading state
    const checkForContent = () => {
      const blogPostsContainer = document.querySelector('h2 a, main a');
      if (!blogPostsContainer && (currentPath.includes('/writing/ideas') || currentPath.includes('/writing'))) {
        console.log('Blog post container not found yet, waiting for content to load...');
        setTimeout(checkForContent, 500);
        return;
      }
      
      findAndHighlightElement(interaction);
    };
    
    // Wait longer for /writing/ideas page which has dynamic content
    if (currentPath === '/writing/ideas') {
      setTimeout(checkForContent, 1000); // Reduced from 2000ms
    } else {
      setTimeout(checkForContent, 500); // Reduced from 1000ms
    }
  }
  
  /**
   * Find and highlight a target element
   */
  function findAndHighlightElement(interaction) {
    // Log DOM state for debugging
    const tagName = interaction.element.tagName;
    const allElements = document.querySelectorAll(tagName);
    console.log(`Found ${allElements.length} ${tagName} elements in DOM`);

    // Debugging long text content
    if (interaction.element.textContent.length > 30) {
      const searchText = interaction.element.textContent.substring(0, 15);
      const foundElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent.includes(searchText)
      );
      console.log(`Elements containing "${searchText}": ${foundElements.length}`);
      
      if (foundElements.length > 0) {
        console.log('First matching element:', foundElements[0].outerHTML);
      }
    }
    
    // Find the target element
    console.log('Finding element with ElementUtils...');
    const targetElement = window.CursorFlowUtils.ElementUtils.findElementFromInteraction(interaction, document);
    
    if (!targetElement) {
      console.warn('Could not find target element, will retry after delay');
      
      // Dump all links for debugging
      console.log('All links on page:');
      const links = document.querySelectorAll('a');
      Array.from(links).slice(0, 5).forEach((link, i) => {
        console.log(`Link ${i+1}: ${link.getAttribute('href')} - "${link.textContent.substring(0, 30)}..."`);
      });
      
      // Try one more time with a longer delay
      setTimeout(() => {
        console.log('Retrying element find...');
        const secondAttempt = window.CursorFlowUtils.ElementUtils.findElementFromInteraction(interaction, document);
        if (secondAttempt) {
          console.log('Found element on second attempt!');
          completeStep(secondAttempt);
        } else {
          console.warn('Still could not find element, continuing to next step');
          state.currentStep++;
          window.CursorFlowUtils.StateManager.save(state);
          setTimeout(playNextStep, 1000);
        }
      }, 1500); // Reduced from 3000ms
      return;
    }
    
    completeStep(targetElement);
  }
  
  /**
   * Complete the current step with the found element
   */
  function completeStep(element) {
    console.log('Completing step with element:', element.outerHTML);
    
    // Move cursor to the element
    moveCursorToElement(element);
    
    // Highlight the element
    highlightElement(element);
    
    // Add click listener to the target element
    element.addEventListener('click', handleTargetClick);
  }

  // Load utilities first, then initialize
  if (window.CursorFlowUtils) {
    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } else {
    // Load utilities script first
    const script = document.createElement('script');
    script.src = '/cursor-flow-utils.js';
    script.onload = () => {
      console.log('Utilities loaded');
      init();
    };
    document.head.appendChild(script);
  }
})();
