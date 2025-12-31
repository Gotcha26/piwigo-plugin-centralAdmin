/**
 * CentralAdmin - Initialisation Principale
 * 
 * Coordonne l'initialisation de tous les modules
 * Version: 3.0.0
 */

(function() {
  'use strict';
  
  console.log('[CentralAdmin] Chargement v3.0...');
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[CentralAdmin] Initialisation des modules...');
    
    // Initialiser les contrôles du formulaire
    if (typeof CAFormControls !== 'undefined') {
      CAFormControls.init();
      console.log('[CentralAdmin] ✓ Contrôles formulaire initialisés');
    }
    
    // Initialiser les couleurs
    if (typeof CAFormColors !== 'undefined') {
      CAFormColors.init();
      console.log('[CentralAdmin] ✓ Gestion couleurs initialisée');
    }
    
    // Initialiser la prévisualisation
    if (typeof CAFormPreview !== 'undefined') {
      CAFormPreview.init();
      console.log('[CentralAdmin] ✓ Prévisualisation initialisée');
    }
    
    // Initialiser le module modal
    if (typeof CAModal !== 'undefined') {
      CAModal.init();
      console.log('[CentralAdmin] ✓ Gestion modales initialisée');
    }
    
    // Initialiser le module debug
    if (typeof CADebug !== 'undefined') {
      CADebug.init({ 
        enableConsoleLog: true,
        enableDOMInjection: true,
        enablePerformanceMetrics: true
      });
      console.log('[CentralAdmin] ✓ Module debug initialisé');
      
      // Détecter le thème
      CADebug.detectTheme();
      
      // Peupler le DOM avec les infos debug
      setTimeout(function() {
        CADebug.populateDOM();
      }, 100);
    }
    
    console.log('[CentralAdmin] ✓ Tous les modules initialisés avec succès');
  });
})();