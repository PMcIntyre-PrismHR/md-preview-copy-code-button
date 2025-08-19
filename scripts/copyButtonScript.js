/**
 * This script enables copying code snippets to the clipboard.
 *
 * This script had to be written because the existing solutions were not flexible enough
 * to handle both block-level and inline code snippets seamlessly.
 */
(function () {
  'use strict';

  // Add click handlers to copy buttons
  document.addEventListener('click', (event) => {
    const target = event.target;

    // Handle fenced code block copy buttons
    if (target && target.classList && target.classList.contains('copy-button')) {
      const blockId = target.getAttribute('data-code-block-id');
      const codeBlock = blockId ? document.getElementById(blockId) : null;

      if (codeBlock) {
        const codeElement = codeBlock.querySelector('code');
        if (codeElement) {
          const code = codeElement.textContent || codeElement.innerText;
          copyToClipboard(code, target);
        }
      }
    }

    // Handle inline code copy buttons
    if (target && target.classList && target.classList.contains('copy-button-inline')) {
      const inlineId = target.getAttribute('data-inline-code-id');
      const inlineWrapper = inlineId ? document.getElementById(inlineId) : null;

      if (inlineWrapper) {
        const codeElement = inlineWrapper.querySelector('code');
        if (codeElement) {
          const code = codeElement.textContent || codeElement.innerText;
          copyToClipboard(code, target);
        }
      }
    }
  });

  /**
   * Copies the given text to the clipboard and provides feedback to the user.
   *
   * Uses the ClipboardAPI to handle copying the text, and uses `execCommand()`
   * as a fallback
   * @param {string} text
   * @param {HTMLElement} button
   */
  function copyToClipboard(text, button) {
    // Try to copy using the Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(button, 'Copied!');
      }).catch(err => {
        console.error('Failed to copy with Clipboard API: ', err);
        fallbackCopy(text, button);
      });
    } else {
      // Fallback for browsers that don't support Clipboard API
      fallbackCopy(text, button);
    }
  }

  /**
   * Fallback method for copying text to clipboard.
   * @param {string} text
   * @param {HTMLElement} button
   */
  function fallbackCopy(text, button) {
    try {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);

      // Copy the text by selecting the textarea content
      // and executing the copy command
      // Note: the `execCommand()` method is deprecated, but still works in most browsers
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        showCopyFeedback(button, 'Copied!');
      } else {
        showCopyFeedback(button, 'Copy failed', true);
      }
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      showCopyFeedback(button, 'Copy failed', true);
    }
  }

  /**
   * Shows feedback to the user after copying text.
   * @param {HTMLElement} button
   * @param {string} message
   * @param {boolean} isError
   */
  function showCopyFeedback(button, message, isError = false) {
    const originalText = button.textContent;
    const isInlineButton = button.classList.contains('copy-button-inline');

    if (isInlineButton) {
      // For inline buttons, show a tooltip-like feedback
      button.textContent = '✓';
      button.style.color = isError ? '#dc3545' : '#28a745';
    } else {
      // For block buttons, change the text
      button.textContent = message;
      button.style.background = isError ? '#dc3545' : '#28a745';
    }

    // Reset button text and styles after a timeout
    setTimeout(() => {
      button.textContent = originalText;
      if (isInlineButton) {
        button.style.color = '';
      } else {
        button.style.background = '#007acc';
      }
    }, 1500);
  }
})();