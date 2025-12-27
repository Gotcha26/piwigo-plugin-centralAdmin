/**
 * CentralAdmin - Peuplement du débogueur
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      // Détecter Spectrum
      if (typeof jQuery !== 'undefined' && typeof jQuery.fn.spectrum !== 'undefined') {
        document.getElementById('spectrum-version').innerHTML = 
          '<span class="ca-debug-badge ca-badge-info">1.8.1 (CDN)</span>';
      } else {
        document.getElementById('spectrum-version').innerHTML = 
          '<span style="color: #dc3545;">❌ Non détecté</span>';
      }
      
      // Peupler les infos JS
      if (window.caThemeDebug) {
        const debug = window.caThemeDebug;
        
        document.getElementById('js-scheme-value').innerHTML = 
          '<span class="ca-debug-badge ca-badge-' + (debug.js === 'dark' ? 'dark' : 'light') + '">' + 
          debug.js + '</span>';
        
        document.getElementById('html-classes-value').textContent = debug.htmlClasses || '(vide)';
        document.getElementById('body-classes-value').textContent = debug.bodyClasses || '(vide)';
        document.getElementById('body-bgcolor-value').textContent = debug.bgColor;
        
        document.getElementById('concordance-value').innerHTML = debug.concordance 
          ? '✅ <strong style="color: #28a745;">Oui</strong>' 
          : '⚠️ <strong style="color: #ffa500;">Non (divergence)</strong>';
        
        document.getElementById('console-js-detection').innerHTML = '<strong>' + debug.js + '</strong>';
        document.getElementById('console-concordance').innerHTML = debug.concordance 
          ? '<strong style="color: #28a745;">Oui</strong>' 
          : '<strong style="color: #ffa500;">Non</strong>';
      }
    }, 100);
  });
})();