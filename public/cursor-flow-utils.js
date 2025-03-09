/**
 * Cursor Flow Utils
 * 
 * Additional utilities for the Cursor Flow system,
 * focused on tracking user progress, optimizing performance,
 * and handling edge cases.
 */

(function() {
  /**
   * Track and analyze user progress through steps
   */
  const ProgressTracker = {
    /**
     * Mark a step as completed
     */
    markStepComplete: function(stepIndex, recording, userInitiated = false) {
      if (!recording || !recording.interactions) return;
      
      // Store in session that this step is complete
      try {
        const completedSteps = this.getCompletedSteps();
        if (!completedSteps.includes(stepIndex)) {
          completedSteps.push(stepIndex);
          sessionStorage.setItem('cursorFlowCompletedSteps', JSON.stringify(completedSteps));
        }
        
        // Log for analytics if needed
        if (userInitiated) {
          console.log(`User completed step ${stepIndex} manually`);
        }
      } catch (e) {
        console.error('Error marking step complete:', e);
      }
    },
    
    /**
     * Get array of completed step indices
     */
    getCompletedSteps: function() {
      try {
        const saved = sessionStorage.getItem('cursorFlowCompletedSteps');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    },
    
    /**
     * Check if a step is already completed
     */
    isStepCompleted: function(stepIndex) {
      return this.getCompletedSteps().includes(stepIndex);
    },
    
    /**
     * Reset completed steps tracking
     */
    resetProgress: function() {
      try {
        sessionStorage.removeItem('cursorFlowCompletedSteps');
      } catch (e) {
        console.error('Error resetting progress:', e);
      }
    },
    
    /**
     * Find first incomplete step from current position
     */
    findNextIncompleteStep: function(currentStep, recording) {
      if (!recording || !recording.interactions) return currentStep;
      
      const completedSteps = this.getCompletedSteps();
      for (let i = currentStep; i < recording.interactions.length; i++) {
        if (!completedSteps.includes(i)) {
          return i;
        }
      }
      
      return currentStep; // Stay at current if all completed
    }
  };
  
  /**
   * Helper for detecting if user has already completed an action
   */
  const ActionDetector = {
    /**
     * Check if the target element for this step is already in desired state
     */
    isActionAlreadyCompleted: function(interaction, document) {
      if (!interaction || !interaction.element) return false;
      
      // Find the element first
      const element = CursorFlowHelpers.ElementUtils.findElementFromInteraction(interaction, document);
      if (!element) return false;
      
      // For form inputs, check if they're already filled
      if (interaction.element.tagName === 'INPUT' && interaction.element.value) {
        return element.value === interaction.element.value;
      }
      
      // For checkboxes, check if already checked/unchecked
      if (interaction.element.tagName === 'INPUT' && 
          interaction.element.type === 'checkbox') {
        return element.checked === interaction.element.checked;
      }
      
      // For selects, check if already selected
      if (interaction.element.tagName === 'SELECT' && interaction.element.value) {
        return element.value === interaction.element.value;
      }
      
      // For other elements, we can't easily tell if the action is done
      return false;
    },
    
    /**
     * Check if a page transition has already happened
     */
    hasPageTransitionOccurred: function(interaction) {
      // If current URL matches the next step's URL, transition happened
      if (!interaction || !interaction.pageInfo) return false;
      
      return window.location.pathname === interaction.pageInfo.path;
    }
  };
  
  // Export these utilities
  window.CursorFlowUtils = {
    ProgressTracker,
    ActionDetector
  };
})();
