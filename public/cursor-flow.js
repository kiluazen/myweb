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
    }
    
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
      createStartButton();
      
      // If we were playing, resume after a short delay
      if (state.isPlaying) {
        setTimeout(() => {
          loadRecording(state.sessionId)
            .then(() => {
              createVisualElements();
              playNextStep();
            });
        }, 1000);
      }
    }
  }

  // Move navigation detection to utils file
  function setupNavigationDetection() {
    window.CursorFlowUtils.NavigationUtils.setup(state, handleRouteChangeStart, handleRouteChangeComplete);
  }

  function handleRouteChangeStart(url) {
    state.navigationInProgress = true;
  }

  function handleRouteChangeComplete(url) {
    state.navigationInProgress = false;
    
    // If we're playing and on the right step, resume after navigation
    if (state.isPlaying && state.recording) {
      setTimeout(() => {
        const currentStep = state.recording.interactions[state.currentStep];
        if (currentStep && currentStep.pageInfo && 
            currentStep.pageInfo.path === window.location.pathname) {
          playNextStep();
        }
      }, 800);
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
    const button = window.CursorFlowUtils.UIUtils.createButton(
      state.isPlaying ? 'Stop Guide' : 'Start Guide',
      config.startButtonColor,
      () => {
        if (state.isPlaying) {
          stopPlayback();
          button.textContent = 'Start Guide';
        } else {
          startPlayback();
          button.textContent = 'Stop Guide';
        }
      }
    );
    
    state.startButton = button;
    return button;
  }

  /**
   * Create the cursor element
   */
  function createCursor() {
    state.cursor = window.CursorFlowUtils.UIUtils.createCursor(config);
    return state.cursor;
  }

  /**
   * Create the highlight element
   */
  function createHighlight() {
    state.highlight = window.CursorFlowUtils.UIUtils.createHighlight(config);
    return state.highlight;
  }

  /**
   * Load a recording session
   */
  function loadRecording(sessionId) {
    const sessionFile = `/cursor-recording/session-${sessionId}.json`;
    
    return fetch(sessionFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load recording: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        state.recording = data.recording;
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
    
    window.CursorFlowUtils.StateManager.save(state);
  }

  /**
   * Handle click on the target element
   */
  function handleTargetClick(event) {
    // Remove click listener from this element
    if (state.targetElement) {
      state.targetElement.removeEventListener('click', handleTargetClick);
    }
    
    // Increment the step counter
    state.currentStep++;
    
    // Save state before navigation happens
    window.CursorFlowUtils.StateManager.save(state);
  }

  /**
   * Play the next step in the recording
   */
  function playNextStep() {
    if (!state.isPlaying || !state.recording) return;
    
    // If navigation is in progress, wait
    if (state.navigationInProgress) {
      setTimeout(playNextStep, 1000);
      return;
    }
    
    // Check if we've reached the end
    if (state.currentStep >= state.recording.interactions.length) {
      stopPlayback();
      return;
    }
    
    // Get the current interaction
    const interaction = state.recording.interactions[state.currentStep];
    
    // Check if we need to navigate to a different page
    const currentPath = window.location.pathname;
    const interactionPath = interaction.pageInfo?.path;
    
    if (interactionPath && currentPath !== interactionPath) {
      window.CursorFlowUtils.UIUtils.showPageMismatchAlert(interactionPath);
      return;
    }
    
    // Wait for dynamic content to load
    const checkForContent = () => {
      if (window.CursorFlowUtils.ElementUtils.shouldWaitForContent(currentPath)) {
        setTimeout(checkForContent, 500);
        return;
      }
      
      findAndHighlightElement(interaction);
    };
    
    // Adjust delay based on page path
    if (currentPath === '/writing/ideas') {
      setTimeout(checkForContent, 1000);
    } else {
      setTimeout(checkForContent, 500);
    }

    if (state.cursor) {
      window.CursorFlowUtils.UIUtils.updateCursorText(state.cursor, interaction);
    }
  }
  
  /**
   * Find and highlight a target element
   */
  function findAndHighlightElement(interaction) {
    const targetElement = window.CursorFlowUtils.ElementUtils.findElementFromInteraction(interaction, document);
    
    if (!targetElement) {
      // Try one more time with a longer delay
      setTimeout(() => {
        const secondAttempt = window.CursorFlowUtils.ElementUtils.findElementFromInteraction(interaction, document);
        if (secondAttempt) {
          completeStep(secondAttempt);
        } else {
          state.currentStep++;
          window.CursorFlowUtils.StateManager.save(state);
          setTimeout(playNextStep, 1000);
        }
      }, 1500);
      return;
    }
    
    completeStep(targetElement);
  }
  
  /**
   * Complete the current step with the found element
   */
  function completeStep(element) {
    // Move cursor to the element
    window.CursorFlowUtils.UIUtils.moveCursorToElement(element, state.cursor);
    
    // Highlight the element
    window.CursorFlowUtils.UIUtils.highlightElement(element, state.highlight, state);
    
    // Add click listener to the target element
    element.addEventListener('click', handleTargetClick);
    
    // Store the current target element
    state.targetElement = element;
  }

  // Make state accessible to utility functions
  window.CursorFlowState = state;

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
      init();
    };
    document.head.appendChild(script);
  }
})();
