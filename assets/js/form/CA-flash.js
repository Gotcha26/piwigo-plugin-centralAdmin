/**
 * CentralAdmin - Flash Notifications
 *
 * Lightweight toast notification system, inspired by Mosaic's mosaicFlash().
 * Provides caFlash() as a global function usable by centralAdmin core
 * and all modules (metaog, skyline, ca-patcher, etc.).
 *
 * Usage:
 *   caFlash('Settings saved.', 'success');
 *   caFlash('Network error.', 'error', 5000);
 *   caFlash('Info message.', 'info');
 *
 * Version: 1.0.0
 */

const CAFlash = (function() {
  'use strict';

  var el = null;
  var timer = null;

  /**
   * Show a flash notification.
   *
   * @param {string} message  - Text to display
   * @param {string} [type]   - 'success' | 'error' | 'info' (default: 'success')
   * @param {number} [duration] - Auto-hide delay in ms (default: 3000; 0 = sticky)
   */
  function flash(message, type, duration) {
    type     = type     || 'success';
    duration = (duration !== undefined) ? duration : 3000;

    if (!el) {
      el = document.createElement('div');
      el.id        = 'ca-flash';
      el.className = 'ca-flash';
      document.body.appendChild(el);
    }

    // Reset classes
    el.classList.remove('ca-flash--success', 'ca-flash--error', 'ca-flash--info', 'ca-flash--visible');
    el.textContent = message;

    // Force reflow to restart CSS transition
    void el.offsetWidth;

    // Apply type + show
    el.classList.add('ca-flash--' + type, 'ca-flash--visible');

    // Auto-hide
    clearTimeout(timer);
    if (duration > 0) {
      timer = setTimeout(function() {
        el.classList.remove('ca-flash--visible');
      }, duration);
    }
  }

  /**
   * Dismiss the current notification immediately.
   */
  function dismiss() {
    if (el) {
      clearTimeout(timer);
      el.classList.remove('ca-flash--visible');
    }
  }

  // Expose as global for modules
  window.caFlash = flash;

  return { flash: flash, dismiss: dismiss };
})();
