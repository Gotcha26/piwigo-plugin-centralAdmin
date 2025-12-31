/**
 * CentralAdmin - Gestion des Modales
 * 
 * Gestion des modales jQuery Confirm (crédits, etc)
 * Version: 3.0.0
 */

const CAModal = (function() {
  'use strict';
  
  /**
   * Initialise la gestion des modales
   */
  function init() {
    initCreditsModal();
  }
  
  /**
   * Initialise la modale des crédits
   */
  function initCreditsModal() {
    const creditsLink = document.getElementById('ca-credits-link');
    if (!creditsLink) return;
    
    creditsLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Vérifier que jQuery Confirm est chargé
      if (typeof jQuery === 'undefined' || typeof jQuery.confirm === 'undefined') {
        console.error('[CA Modal] jQuery Confirm non disponible');
        // Fallback : nouvelle fenêtre
        window.open('plugins/centralAdmin/config/credentials.html', 'credits', 'width=750');
        return;
      }
      
      // Charger le contenu HTML via AJAX
      jQuery.ajax({
        url: 'plugins/centralAdmin/config/credentials.html',
        dataType: 'html',
        success: function(html) {
          // Afficher avec jquery-confirm
          jQuery.confirm({
            title: '<span style="color: #3498db;">🎨 Crédits - centralAdmin</span>',
            content: html,
            type: 'blue',
            columnClass: 'large',
            boxWidth: '750px',
            useBootstrap: false,
            backgroundDismiss: true,
            escapeKey: true,
            animation: 'scale',
            closeAnimation: 'scale',
            animationSpeed: 300,
            animationBounce: 1.2,
            draggable: false,
            theme: 'material',
            buttons: {
              close: {
                text: 'Fermer',
                btnClass: 'btn-blue',
                keys: ['esc'],
                action: function() {
                  // Se ferme automatiquement
                }
              }
            },
            onOpenBefore: function() {
              // Ajouter le flou sur l'overlay
              jQuery('.jconfirm-bg').css({
                'backdrop-filter': 'blur(3px)',
                'background': 'rgba(0, 0, 0, 0.5)'
              });
              
              // Ajuster la hauteur de la modale
              jQuery('.jconfirm-box-container').css({
                'max-height': '85vh',
                'min-height': '400px'
              });
              
              // Rendre le contenu scrollable
              jQuery('.jconfirm-content').css({
                'max-height': 'calc(85vh - 120px)',
                'overflow-y': 'auto',
                'padding': '20px'
              });
            }
          });
        },
        error: function() {
          jQuery.alert({
            title: 'Erreur',
            content: 'Impossible de charger les crédits.',
            type: 'red'
          });
        }
      });
    });
    
    console.log('[CA Modal] Modale crédits initialisée');
  }
  
  // API publique
  return {
    init: init,
    initCreditsModal: initCreditsModal
  };
})();