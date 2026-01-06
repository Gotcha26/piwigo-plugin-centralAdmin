/**
 * CentralAdmin - Gestion des Tooltips
 * Positionnement intelligent au clic
 * Version: 3.0.1
 */

const CATooltips = (function() {
  'use strict';
  
  let activeTooltip = null;
  
  function init() {
    initAllTooltips();
    
    // Fermer au clic extérieur
    document.addEventListener('click', function(e) {
      if (activeTooltip && !e.target.closest('.ca-help-container')) {
        closeActiveTooltip();
      }
    });
    
  }
  
  function initAllTooltips() {
    const helps = document.querySelectorAll('.ca-help');
    helps.forEach(help => {
      initTooltip(help);
    });
  }
  
  function initSection(sectionContent) {
    if (!sectionContent) return;
    
    const helps = sectionContent.querySelectorAll('.ca-help');
    helps.forEach(help => {
      initTooltip(help);
    });
    
  }
  
  function initTooltip(help) {
    const container = help.parentElement;
    const tooltip = container.querySelector('.help-tooltip');
    
    if (!tooltip) return;
    
    // Vérifier si le tooltip est vide
    const tooltipText = tooltip.textContent.trim();
    if (!tooltipText || tooltipText === '') {
      container.style.display = 'none';
      return;
    }
    
    // Marquer comme initialisé pour éviter les doublons
    if (help.dataset.tooltipInit === 'true') return;
    help.dataset.tooltipInit = 'true';
    
    help.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Si ce tooltip est déjà actif, le fermer
      if (activeTooltip === tooltip) {
        closeActiveTooltip();
        return;
      }
      
      // Fermer le tooltip précédent
      closeActiveTooltip();
      
      // Ouvrir ce tooltip
      activeTooltip = tooltip;
      positionTooltip(help, tooltip);
      tooltip.classList.add('ca-tooltip-visible');
    });
  }
  
  function closeActiveTooltip() {
    if (activeTooltip) {
      activeTooltip.classList.remove('ca-tooltip-visible');
      activeTooltip = null;
    }
  }
  
  function positionTooltip(trigger, tooltip) {
    // Reset des styles pour positionnement naturel
    tooltip.style.top = '';
    tooltip.style.left = '';
    tooltip.style.right = '';
    tooltip.style.bottom = '';
    tooltip.style.transform = '';
  }
  
  return {
    init: init,
    initSection: initSection
  };
})();