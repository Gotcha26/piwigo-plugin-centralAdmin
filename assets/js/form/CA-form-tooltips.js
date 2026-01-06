/**
 * CentralAdmin - Gestion des Tooltips
 * Positionnement intelligent des tooltips
 * Version: 3.0.0
 */

const CATooltips = (function() {
  'use strict';
  
  function init() {
    const helps = document.querySelectorAll('.ca-help');
    
    helps.forEach(help => {
      const tooltip = help.parentElement.querySelector('.help-tooltip');
      if (!tooltip) return;
      
      help.addEventListener('mouseenter', () => {
        positionTooltip(help, tooltip);
      });
      
      // Repositionner au scroll/resize
      window.addEventListener('scroll', () => {
        if (tooltip.style.opacity === '1') {
          positionTooltip(help, tooltip);
        }
      }, { passive: true });
    });
    
    console.log('[CA Tooltips] Tooltips intelligents initialisés');
  }
  
  function positionTooltip(trigger, tooltip) {
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = rect.bottom + 6;
    let left = rect.left;
    
    // Ajustement horizontal si débordement à droite
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    
    // Ajustement horizontal si débordement à gauche
    if (left < 10) {
      left = 10;
    }
    
    // Ajustement vertical si débordement en bas
    if (top + tooltipRect.height > viewportHeight - 10) {
      // Afficher au-dessus du bouton
      top = rect.top - tooltipRect.height - 6;
    }
    
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }
  
  return {
    init: init
  };
})();