/**
 * CentralAdmin - Gestion des Couleurs
 * 
 * Gestion des color pickers natifs
 * Version: 3.0.0
 */

const CAFormColors = (function() {
  'use strict';
  
  /**
   * Initialise la gestion des couleurs
   */
  function init() {
    initColorPickers();
  }
  
  /**
   * Initialise les color pickers natifs
   */
  function initColorPickers() {
    const colorPickers = document.querySelectorAll('.ca-color-picker');
    
    colorPickers.forEach(function(picker) {
      const pickerId = picker.id;
      const textInputId = pickerId.replace('_picker', '_text');
      const textInput = document.getElementById(textInputId);
      
      if (!textInput) {
        console.warn('[CA Colors] Input texte non trouvé pour', pickerId);
        return;
      }
      
      // Synchronisation picker natif → input texte
      picker.addEventListener('input', function() {
        const hexValue = picker.value.toUpperCase();
        textInput.value = hexValue;
        
        // Déclencher l'événement pour la prévisualisation
        const event = new CustomEvent('color-change', { 
          detail: { color: hexValue, inputId: textInput.id } 
        });
        textInput.dispatchEvent(event);
      });
      
      // Synchronisation input texte → picker natif
      textInput.addEventListener('input', function() {
        if (/^#[0-9A-Fa-f]{6}$/i.test(textInput.value)) {
          picker.value = textInput.value;
          
          const event = new CustomEvent('color-change', { 
            detail: { color: textInput.value.toUpperCase(), inputId: textInput.id } 
          });
          textInput.dispatchEvent(event);
        }
      });
      
      // Validation au blur
      textInput.addEventListener('blur', function() {
        if (!/^#[0-9A-Fa-f]{6}$/i.test(textInput.value)) {
          textInput.value = picker.value.toUpperCase();
        }
      });
    });
    
    console.log('[CA Colors] Color pickers natifs initialisés:', colorPickers.length);
  }
  
  // API publique
  return {
    init: init,
    initColorPickers: initColorPickers
  };
})();