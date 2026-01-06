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
    
    console.log('[CA Tooltips] Tooltips au clic initialisés');
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
    
    console.log('[CA Tooltips] Section réinitialisée:', helps.length, 'tooltips');
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
    const rect = trigger.getBoundingClientRect();
    
    // Forcer le display pour obtenir les dimensions réelles
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'hidden';
    
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    
    tooltip.style.visibility = '';
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Position par défaut : en dessous du bouton
    let top = rect.bottom + scrollTop + 8;
    let left = rect.left + scrollLeft;
    
    // Ajustement horizontal si débordement à droite
    if (left + tooltipWidth > viewportWidth + scrollLeft - 10) {
      left = viewportWidth + scrollLeft - tooltipWidth - 10;
    }
    
    // Ajustement horizontal si débordement à gauche
    if (left < scrollLeft + 10) {
      left = scrollLeft + 10;
    }
    
    // Ajustement vertical si débordement en bas
    if (top + tooltipHeight > viewportHeight + scrollTop - 10) {
      // Afficher au-dessus du bouton
      top = rect.top + scrollTop - tooltipHeight - 8;
    }
    
    // Si toujours pas assez de place en haut, forcer en bas avec scroll possible
    if (top < scrollTop + 10) {
      top = rect.bottom + scrollTop + 8;
    }
    
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }
  
  return {
    init: init,
    initSection: initSection
  };
})();