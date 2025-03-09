/**
 * Cursor Flow - Core Initialization & Flow Control
 * 
 * Main entry point that orchestrates the cursor flow experience.
 * Handles session management, playback control, and core logic.
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

  // Core state
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
    const savedState = CursorFlowHelpers.StateManager.restore();
    if (savedState) {
      state.isPlaying = savedState.isPlaying;
      state.currentStep = savedState.currentStep;
      state.sessionId = savedState.sessionId;
    }
    
    // Set up navigation detection
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

  /**
   * Setup navigation detection
   */
  function setupNavigationDetection() {
    CursorFlowHelpers.NavigationUtils.setup(
      state, 
      handleRouteChangeStart, 
      handleRouteChangeComplete
    );
  }

  function handleRouteChangeStart(url) {
    state.navigationInProgress = true;
  }

  function handleRouteChangeComplete(url) {
    state.navigationInProgress = false;
    
    // If we're playing and on the right step, resume after navigation
    if (state.isPlaying && state.recording) {
      setTimeout(() => {
        // Check if new page matches any step in the flow
        const matchedStep = CursorFlowHelpers.ElementUtils.matchPageToStep(state.recording);
        
        if (matchedStep !== -1) {
          // User navigated to a page that's part of our flow
          if (matchedStep !== state.currentStep) {
            // User jumped ahead or back in the flow
            state.currentStep = matchedStep;
            CursorFlowHelpers.StateManager.save(state);
            
            CursorFlowUI.showNotification({
              message: `Continuing from step ${matchedStep + 1}`,
              type: "info",
              autoClose: 3000
            });
          }
          
          // Continue the flow from this step
          playNextStep();
        } else {
          // User navigated to a page not in our flow
          const currentStep = state.recording.interactions[state.currentStep];
          if (currentStep && currentStep.pageInfo) {
            CursorFlowUI.showNotification({
              title: 'Off Guide Path',
              message: `This page is not part of the guide. Return to ${currentStep.pageInfo.path} to continue.`,
              type: 'warning',
              autoClose: 8000,
              buttons: [
                {
                  text: 'Return to Guide',
                  onClick: () => {
                    window.location.href = currentStep.pageInfo.path;
                  },
                  primary: true
                }
              ]
            });
          }
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
          CursorFlowHelpers.StateManager.save(state);
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
    if (!state.cursor) state.cursor = CursorFlowUI.createCursor(config);
    if (!state.highlight) state.highlight = CursorFlowUI.createHighlight(config);
  }

  /**
   * Create the floating start button
   */
  function createStartButton() {
    state.startButton = CursorFlowUI.createButton(
      state.isPlaying ? 'Stop Guide' : 'Start Guide',
      config.startButtonColor,
      () => {
        if (state.isPlaying) {
          stopPlayback();
          state.startButton.textContent = 'Start Guide';
        } else {
          startPlayback();
          state.startButton.textContent = 'Stop Guide';
        }
      }
    );
    
    return state.startButton;
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
        
        // Check if user is already at a specific step in the flow
        // This checks the current page and determines where to start
        const currentPosition = CursorFlowHelpers.ElementUtils.matchPageToStep(state.recording);
        
        if (currentPosition > 0) {
          // User is already at a middle step
          state.currentStep = currentPosition;
          CursorFlowUI.showMidFlowNotification(
            currentPosition + 1, 
            state.recording.interactions.length
          );
        } else if (currentPosition === -1) {
          // Current page is not recognized as part of the flow
          checkForNavigationToStart();
          return; // Don't continue until user navigates to the start
        }
        
        CursorFlowHelpers.StateManager.save(state);
        playNextStep();
      })
      .catch(error => {
        console.error('Failed to start playback:', error);
      });
  }

  /**
   * Check if user needs to navigate to the starting point of the flow
   */
  function checkForNavigationToStart() {
    if (!state.recording || !state.recording.interactions || 
        state.recording.interactions.length === 0) {
      return;
    }
    
    // Get starting point of the flow
    const firstStep = state.recording.interactions[0];
    if (!firstStep || !firstStep.pageInfo) {
      return;
    }
    
    // Current page is not recognized, determine how to help user navigate
    const startPath = firstStep.pageInfo.path;
    
    if (startPath === '/') {
      // Flow starts at home page
      CursorFlowUI.showHomePageNavigationPrompt();
    } else {
      // Flow starts at another page
      CursorFlowUI.showNavigationPrompt(
        startPath, 
        `This guide starts on: ${startPath}`
      );
    }
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
    
    CursorFlowHelpers.StateManager.save(state);
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
    CursorFlowHelpers.StateManager.save(state);
    
    // Continue to next step
    setTimeout(playNextStep, 500);
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
      CursorFlowUI.showNotification({
        message: "Guide complete! Thanks for following along.",
        type: "info"
      });
      stopPlayback();
      return;
    }
    
    // Get the current interaction
    const interaction = state.recording.interactions[state.currentStep];
    
    // Check if we need to navigate to a different page
    const currentPath = window.location.pathname;
    const interactionPath = interaction.pageInfo?.path;
    
    if (interactionPath && currentPath !== interactionPath) {
      // Try to find if current page matches any part of the flow
      const matchedStep = CursorFlowHelpers.ElementUtils.matchPageToStep(state.recording);
      
      if (matchedStep !== -1 && matchedStep !== state.currentStep) {
        // We found that user is at a different step than expected
        state.currentStep = matchedStep;
        CursorFlowHelpers.StateManager.save(state);
        
        // Notify the user and continue from here
        CursorFlowUI.showNotification({
          message: `Continuing from step ${matchedStep + 1}`,
          type: "info",
          autoClose: 3000
        });
        
        // Get the updated interaction
        const newInteraction = state.recording.interactions[state.currentStep];
        executeStep(newInteraction, currentPath);
        return;
      }
      
      // Current page doesn't match any step in the flow
      CursorFlowUI.showPageMismatchAlert(interactionPath);
      return;
    }
    
    // Check for content and position the cursor/highlight
    executeStep(interaction, currentPath);
  }
  
  /**
   * Execute the current step
   */
  function executeStep(interaction, currentPath) {
    // Wait for dynamic content to load if needed
    if (CursorFlowHelpers.ElementUtils.shouldWaitForContent(currentPath)) {
      setTimeout(() => executeStep(interaction, currentPath), 500);
      return;
    }
    
    // Find the target element
    const targetElement = CursorFlowHelpers.ElementUtils.findElementFromInteraction(interaction, document);
    
    if (!targetElement) {
      // Try one more time with a longer delay
      setTimeout(() => {
        const secondAttempt = CursorFlowHelpers.ElementUtils.findElementFromInteraction(interaction, document);
        if (secondAttempt) {
          completeStep(secondAttempt, interaction);
        } else {
          // Skip this step if we can't find the element after retries
          state.currentStep++;
          CursorFlowHelpers.StateManager.save(state);
          setTimeout(playNextStep, 1000);
        }
      }, 1500);
      return;
    }
    
    completeStep(targetElement, interaction);
  }
  
  /**
   * Complete the current step with the found element
   */
  function completeStep(element, interaction) {
    // Move cursor to the element
    CursorFlowUI.moveCursorToElement(element, state.cursor, interaction);
    
    // Highlight the element
    CursorFlowUI.highlightElement(element, state.highlight, state);
    
    // Add click listener to the target element
    element.addEventListener('click', handleTargetClick);
    
    // Store the current target element
    state.targetElement = element;
  }

  // Make API available globally
  window.CursorFlow = {
    init: init,
    start: startPlayback,
    stop: stopPlayback,
    config: config,
    getState: () => ({ ...state })
  };
  
  // Make state accessible to utility functions
  window.CursorFlowState = state;
  
  // Load dependencies and initialize
  function loadDependencies() {
    const dependencies = [
      { src: '/cursor-flow-ui.js', global: 'CursorFlowUI' },
      { src: '/cursor-flow-helpers.js', global: 'CursorFlowHelpers' }
    ];
    
    let loaded = 0;
    
    dependencies.forEach(dep => {
      // Skip if already loaded
      if (window[dep.global]) {
        loaded++;
        if (loaded === dependencies.length) init();
        return;
      }
      
      // Load script
      const script = document.createElement('script');
      script.src = dep.src;
      script.onload = () => {
        loaded++;
        if (loaded === dependencies.length) init();
      };
      document.head.appendChild(script);
    });
  }
  
  // Start loading dependencies or initialize if they're already available
  if (window.CursorFlowUI && window.CursorFlowHelpers) {
    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } else {
    // Load dependencies first
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadDependencies);
    } else {
      loadDependencies();
    }
  }
})();
