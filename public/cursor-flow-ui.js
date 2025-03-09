/**
 * Cursor Flow UI Components
 * 
 * Handles all visual elements of the Cursor Flow system including:
 * - Cursor creation and movement
 * - Element highlighting
 * - Notifications and alerts
 * - User interface components
 */

(function() {
  /**
   * Create the start button
   */
  function createButton(text, color, onClick) {
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
  }
  
  /**
   * Create the cursor element
   */
  function createCursor(config) {
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
  }
  
  /**
   * Create the highlight element
   */
  function createHighlight(config) {
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
  }
  
  /**
   * Move the cursor to an element
   */
  function moveCursorToElement(element, cursor, interaction) {
    if (!element || !cursor) return;
    
    const rect = element.getBoundingClientRect();
    
    // Position cursor at the bottom right of the element
    const x = rect.right;
    const y = rect.bottom;
    
    cursor.style.display = 'flex';
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    
    // Update text content if interaction is provided
    if (interaction) {
      updateCursorText(cursor, interaction);
    }
  }
  
  /**
   * Update the cursor text based on the current interaction
   */
  function updateCursorText(cursor, interaction) {
    if (!cursor || !interaction) return;
    
    const textEl = cursor.querySelector('#cursor-flow-text');
    if (!textEl) return;
    
    const elementName = interaction.element.textContent || 'this element';
    const pagePath = interaction.pageInfo.path;
    
    // Add additional context for external sites
    let pageInfo = `<span style="font-size: 11px; opacity: 0.8;">Page: ${pagePath}</span>`;
    if (pagePath.includes('/machine_learning') || !pagePath.startsWith('/')) {
      pageInfo = `<span style="font-size: 11px; opacity: 0.8; color: #e74c3c;">External site: ${interaction.pageInfo.url}</span>`;
    }
    
    textEl.innerHTML = `<strong>Click:</strong> "${elementName.length > 25 ? elementName.substring(0, 25) + '...' : elementName}"<br>${pageInfo}`;
  }
  
  /**
   * Position the highlight around an element
   */
  function highlightElement(element, highlight, state) {
    if (!element || !highlight) return;
    
    // Store the target element in state for position updates
    state.targetElement = element;
    
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
  }
  
  /**
   * Show a notification or popup with optional buttons
   * @param {Object} options - Configuration options
   * @param {string} options.title - Title text (optional)
   * @param {string} options.message - Main message text
   * @param {string} options.type - Type of notification ('info', 'warning', 'action')
   * @param {Array} options.buttons - Array of button objects {text, onClick, primary}
   * @param {number} options.autoClose - Auto close after ms (0 to disable)
   */
  function showNotification(options) {
    const defaults = {
      title: '',
      message: '',
      type: 'info',
      buttons: [],
      autoClose: 4000
    };
    
    const settings = {...defaults, ...options};
    
    // Remove existing notification
    const existingNotification = document.getElementById('cursor-flow-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create container element
    const notificationEl = document.createElement('div');
    notificationEl.id = 'cursor-flow-notification';
    
    // Set id if provided
    if (settings.id) {
      notificationEl.id = settings.id;
    }
    
    // Set styles based on type
    const colors = {
      info: '#22c55e',     // Green
      warning: '#f97316',  // Orange
      action: '#3b82f6'    // Blue
    };
    
    // Position next to the guide button
    const guideButton = document.getElementById('cursor-flow-start-button');
    const leftPosition = guideButton ? guideButton.offsetWidth + 30 : 20;
    
    notificationEl.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: ${leftPosition}px;
      max-width: 320px;
      background-color: ${colors[settings.type]};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: cursorFlowFadeIn 0.3s ease;
    `;
    
    // Create content
    let contentHTML = '';
    
    if (settings.title) {
      contentHTML += `<h3 style="margin-top: 0; color: white; font-size: 16px; margin-bottom: 8px;">${settings.title}</h3>`;
    }
    
    contentHTML += `<p style="color: white; margin: 0; margin-bottom: ${settings.buttons.length > 0 ? '12px' : '0'};">${settings.message}</p>`;
    
    // Add buttons if any
    if (settings.buttons && settings.buttons.length > 0) {
      contentHTML += '<div style="display: flex; justify-content: flex-start; gap: 10px; margin-top: 12px;">';
      
      settings.buttons.forEach(button => {
        const isPrimary = button.primary !== false;
        const buttonStyle = isPrimary ? 
          `background-color: white; color: ${colors[settings.type]}; font-weight: bold;` : 
          `background-color: rgba(255,255,255,0.2); color: white;`;
          
        contentHTML += `<button class="cursor-flow-notification-btn" style="
          ${buttonStyle}
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;"
        >${button.text}</button>`;
      });
      
      contentHTML += '</div>';
    }
    
    notificationEl.innerHTML = contentHTML;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: rgba(255,255,255,0.8);
      line-height: 1;
      padding: 0;
      width: 20px;
      height: 20px;
    `;
    closeBtn.onclick = () => notificationEl.remove();
    notificationEl.appendChild(closeBtn);
    
    // Add button click handlers
    notificationEl.querySelectorAll('.cursor-flow-notification-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (typeof settings.buttons[index].onClick === 'function') {
          settings.buttons[index].onClick();
        }
        notificationEl.remove();
      });
    });
    
    // Add to DOM
    document.body.appendChild(notificationEl);
    
    // Make sure animation styles exist
    if (!document.getElementById('cursor-flow-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'cursor-flow-notification-styles';
      style.textContent = `
        @keyframes cursorFlowFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Auto close if enabled
    if (settings.autoClose > 0) {
      setTimeout(() => {
        notificationEl.style.opacity = '0';
        notificationEl.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notificationEl.remove(), 500);
      }, settings.autoClose);
    }
    
    return notificationEl;
  }
  
  /**
   * Show external site alert
   */
  function showExternalSiteAlert(url) {
    return showNotification({
      title: 'External Site',
      message: `This guide continues on an external site:<br><a href="${url}" target="_blank" style="color: white; text-decoration: underline;">${url}</a>`,
      type: 'warning',
      autoClose: 8000
    });
  }
  
  /**
   * Show page mismatch alert
   */
  function showPageMismatchAlert(expectedPath) {
    return showNotification({
      title: 'Wrong Page',
      message: `This guide requires you to be on page: ${expectedPath}`,
      type: 'warning',
      autoClose: 0,
      buttons: [
        {
          text: 'Go There Now',
          onClick: () => {
            window.location.href = expectedPath;
          },
          primary: true
        }
      ]
    });
  }
  
  /**
   * Show notification when starting from the middle of a flow
   */
  function showMidFlowNotification(stepNumber, totalSteps) {
    return showNotification({
      message: `Starting from step ${stepNumber} of ${totalSteps}`,
      type: 'info',
      autoClose: 4000
    });
  }

  /**
   * Show navigation prompt when user is not on any walkthrough page
   */
  function showHomePageNavigationPrompt() {
    return showNotification({
      title: 'Not on Guide Path',
      message: 'This guide starts from the home page.',
      type: 'action',
      autoClose: 0,
      buttons: [
        {
          text: 'Go to Home Page',
          onClick: () => {
            window.location.href = '/';
          },
          primary: true
        },
        {
          text: 'Cancel Guide',
          onClick: () => {
            window.CursorFlow.stop();
          }
        }
      ]
    });
  }
  
  /**
   * Show custom navigation prompt to a specific path
   */
  function showNavigationPrompt(path, message) {
    return showNotification({
      title: 'Navigation Required',
      message: message || `Please navigate to ${path} to continue.`,
      type: 'action',
      autoClose: 0,
      buttons: [
        {
          text: 'Go to Page',
          onClick: () => {
            window.location.href = path;
          },
          primary: true
        },
        {
          text: 'Cancel Guide',
          onClick: () => {
            window.CursorFlow.stop();
          }
        }
      ]
    });
  }
  
  /**
   * Show resumption notification when flow continues from user's current position
   */
  function showFlowResumptionNotification(currentStep, totalSteps) {
    return showNotification({
      message: `Continuing from step ${currentStep} of ${totalSteps}`,
      type: 'info',
      autoClose: 4000
    });
  }
  
  // Export UI components
  window.CursorFlowUI = {
    createButton,
    createCursor,
    createHighlight,
    moveCursorToElement,
    highlightElement,
    updateCursorText,
    showNotification,
    showExternalSiteAlert,
    showPageMismatchAlert,
    showMidFlowNotification,
    showHomePageNavigationPrompt,
    showNavigationPrompt,
    showFlowResumptionNotification
  };
})(); 