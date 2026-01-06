/**
 * CentralAdmin - Initialisation Principale
 * 
 * Coordonne l'initialisation de tous les modules
 * Version: 3.0.0
 */

(function() {
  'use strict';
  
  
  document.addEventListener('DOMContentLoaded', function() {
    
    // Initialiser les contrôles du formulaire
    if (typeof CAFormControls !== 'undefined') {
      CAFormControls.init();
    }
    
    // Initialiser les couleurs
    if (typeof CAFormColors !== 'undefined') {
      CAFormColors.init();
    }
    
    // Initialiser la prévisualisation
    if (typeof CAFormPreview !== 'undefined') {
      CAFormPreview.init();
    }

    // Initialiser les tooltips intelligents
    if (typeof CATooltips !== 'undefined') {
      CATooltips.init();
    }
    
    // Initialiser le module modal
    if (typeof CAModal !== 'undefined') {
      CAModal.init();
    }
    
    // Initialiser le module debug
    if (typeof CADebug !== 'undefined') {
      CADebug.init({ 
        enableConsoleLog: true,
        enableDOMInjection: true,
        enablePerformanceMetrics: true
      });
      
      // Détecter le thème
      CADebug.detectTheme();
      
      // Peupler le DOM avec les infos debug
      setTimeout(function() {
        CADebug.populateDOM();
      }, 100);
    }
    
  });
})();