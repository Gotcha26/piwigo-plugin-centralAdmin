/**
 * CentralAdmin - Peuplement du débogueur
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      // Détecter jQuery
      if (typeof jQuery !== 'undefined') {
        const jqVersion = jQuery.fn.jquery || 'inconnu';
        document.getElementById('jquery-version').innerHTML = 
          '<span class="ca-debug-badge ca-badge-info">' + jqVersion + '</span>';
      } else {
        document.getElementById('jquery-version').innerHTML = 
          '<span style="color: #dc3545;">❌ Non chargé</span>';
      }

      // Vérifier l'ordre de chargement
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const spectrumScript = scripts.find(s => s.src.includes('spectrum'));
      const adminFormScript = scripts.find(s => s.src.includes('admin-form.js'));

      if (spectrumScript && adminFormScript) {
        const spectrumIndex = scripts.indexOf(spectrumScript);
        const adminFormIndex = scripts.indexOf(adminFormScript);
        
        console.log('[CentralAdmin Debug] Ordre de chargement :');
        console.log('  - admin-form.js : position', adminFormIndex);
        console.log('  - spectrum.min.js : position', spectrumIndex);
        
        if (spectrumIndex > adminFormIndex) {
          console.warn('⚠️ Spectrum chargé APRÈS admin-form.js (normal, géré par délai)');
        }
      }
      
      // Détecter jQuery Confirm
      if (typeof jQuery !== 'undefined' && typeof jQuery.confirm !== 'undefined') {
        document.getElementById('jquery-confirm-status').innerHTML = 
          '<span class="ca-debug-badge ca-badge-info">✅ Disponible</span>';
      } else {
        document.getElementById('jquery-confirm-status').innerHTML = 
          '<span style="color: #dc3545;">❌ Non disponible</span>';
      }
      
      // Message historique Spectrum
      const spectrumEl = document.getElementById('spectrum-version');
      if (spectrumEl) {
        spectrumEl.innerHTML = '<span style="color: #999;">Removed (native v2.9+)</span>';
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
        
        // Forcer la concordance sur la valeur PHP (prioritaire)
        const phpScheme = document.body.getAttribute('data-ca-theme');
        document.getElementById('concordance-value').innerHTML = 
          '<strong style="color: #3498db;">PHP prioritaire : ' + phpScheme + '</strong>';

        // Afficher la divergence si elle existe
        if (debug.js !== phpScheme) {
          document.getElementById('concordance-value').innerHTML += 
            '<br><small style="color: #ffa500;">⚠️ JS détecte : ' + debug.js + ' (Paramètre ignoré)</small>';
        }
        
        debug.concordance = (debug.js === phpScheme);
        document.getElementById('console-php-detection').innerHTML = '<strong>' + phpScheme + '</strong>';
        document.getElementById('console-js-detection').innerHTML = debug.js;
        document.getElementById('console-concordance').innerHTML = debug.concordance 
          ? '<strong style="color: #28a745;">Oui</strong>' 
          : '<strong style="color: #ffa500;">Non</strong>';
      }
    }, 100);
  });
})();