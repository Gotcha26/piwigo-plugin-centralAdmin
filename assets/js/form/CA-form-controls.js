/**
 * CentralAdmin - Contrôles du Formulaire
 * 
 * Gestion des options, accordéons, locks et sliders
 * Version: 3.0.0
 */

const CAFormControls = (function() {
  'use strict';
  
  /**
   * Initialise tous les contrôles
   */
  function init() {
    initOptions();
    initAccordions();
    initLockToggles();
    initSliders();
  }
  
  /**
   * Initialise les options globales (header)
   */
  function initOptions() {
    // Option thème navigateur
    const browserThemeCheckbox = document.getElementById('ca-browser-theme');
    if (browserThemeCheckbox) {
      const useBrowserTheme = localStorage.getItem('ca-use-browser-theme') === 'true';
      browserThemeCheckbox.checked = useBrowserTheme;
      
      if (useBrowserTheme) {
        document.body.classList.add('ca-browser-theme');
      }
      
      browserThemeCheckbox.addEventListener('change', function() {
        if (browserThemeCheckbox.checked) {
          document.body.classList.add('ca-browser-theme');
          localStorage.setItem('ca-use-browser-theme', 'true');
          console.log('[CA Controls] Thème navigateur activé');
        } else {
          document.body.classList.remove('ca-browser-theme');
          localStorage.setItem('ca-use-browser-theme', 'false');
          console.log('[CA Controls] Thème navigateur désactivé');
        }
      });
    }

    // Option accordion unique
    const singleAccordionCheckbox = document.getElementById('ca-single-accordion');
    if (singleAccordionCheckbox) {
      const singleAccordion = localStorage.getItem('ca-single-accordion') !== 'false';
      singleAccordionCheckbox.checked = singleAccordion;
      
      singleAccordionCheckbox.addEventListener('change', function() {
        localStorage.setItem('ca-single-accordion', singleAccordionCheckbox.checked);
      });
    }
  }
  
  /**
   * Initialise les accordéons
   */
  function initAccordions() {
    const sections = document.querySelectorAll('.ca-section');
    
    sections.forEach(function(section) {
      const header = section.querySelector('.ca-section-header');
      const toggle = section.querySelector('.ca-toggle');
      const content = section.querySelector('.ca-section-content');
      
      if (!header || !toggle || !content) return;

      header.addEventListener('click', function() {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const singleAccordionCheckbox = document.getElementById('ca-single-accordion');
        const singleMode = singleAccordionCheckbox ? singleAccordionCheckbox.checked : true;
        
        // Si mode unitaire, fermer toutes les autres sections
        if (singleMode && !isExpanded) {
          sections.forEach(function(otherSection) {
            if (otherSection !== section) {
              const otherToggle = otherSection.querySelector('.ca-toggle');
              const otherContent = otherSection.querySelector('.ca-section-content');
              
              if (otherToggle && otherContent && otherToggle.getAttribute('aria-expanded') === 'true') {
                otherToggle.setAttribute('aria-expanded', 'false');
                otherContent.style.maxHeight = '0';
                otherContent.style.opacity = '0';
                otherContent.style.transform = 'translateY(-10px)';
                otherContent.style.paddingTop = '0';
                otherContent.style.paddingBottom = '0';
                otherContent.style.borderTopWidth = '0';
                setTimeout(function() {
                  if (otherToggle.getAttribute('aria-expanded') === 'false') {
                    otherContent.style.display = 'none';
                  }
                }, 500);
              }
            }
          });
        }
        
        // Toggle la section actuelle
        if (isExpanded) {
          toggle.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.transform = 'translateY(-10px)';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
          content.style.borderTopWidth = '0';
          setTimeout(function() {
            if (toggle.getAttribute('aria-expanded') === 'false') {
              content.style.display = 'none';
            }
          }, 500);
        } else {
          toggle.setAttribute('aria-expanded', 'true');
          content.style.display = 'block';
          content.style.paddingTop = '';
          content.style.paddingBottom = '';
          content.style.borderTopWidth = '';
          content.offsetHeight; // Force reflow
          content.style.maxHeight = '2000px';
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        }
      });
    });
  }
  
  /**
   * Initialise les verrous (lock/unlock)
   */
  function initLockToggles() {
    const locks = document.querySelectorAll('.ca-lock');
    
    locks.forEach(function(lock) {
      lock.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const field = lock.closest('.ca-field');
        if (!field) return;
        
        const isLocked = lock.getAttribute('data-locked') === 'true';
        const newLockedState = !isLocked;
        
        lock.setAttribute('data-locked', newLockedState);
        lock.title = newLockedState ? 'Verrouillé' : 'Déverrouillé';
        
        const icon = lock.querySelector('.ca-lock-icon');
        if (icon) {
          icon.textContent = newLockedState ? '🔒' : '🔓';
        }
        
        if (newLockedState) {
          field.classList.add('ca-field-locked');
        } else {
          field.classList.remove('ca-field-locked');
        }
        
        const inputs = field.querySelectorAll('input:not(.ca-lock), select, textarea');
        inputs.forEach(function(input) {
          input.disabled = newLockedState;
        });
      });
    });
  }
  
  /**
   * Initialise les sliders et leur synchronisation avec les inputs
   */
  function initSliders() {
    const sliders = document.querySelectorAll('.ca-slider');
    
    sliders.forEach(function(slider) {
      const outputId = slider.getAttribute('data-output');
      if (!outputId) return;
      
      const numberInput = document.getElementById(outputId);
      if (!numberInput) return;
      
      // Slider → Input
      slider.addEventListener('input', function() {
        numberInput.value = slider.value;
      });
      
      // Input → Slider
      numberInput.addEventListener('input', function() {
        const value = parseInt(numberInput.value, 10);
        const min = parseInt(slider.min, 10);
        const max = parseInt(slider.max, 10);
        
        if (!isNaN(value) && value >= min && value <= max) {
          slider.value = value;
        }
      });
      
      // Validation au blur
      numberInput.addEventListener('blur', function() {
        let value = parseInt(numberInput.value, 10);
        const min = parseInt(slider.min, 10);
        const max = parseInt(slider.max, 10);
        
        if (isNaN(value)) {
          value = parseInt(slider.value, 10);
        } else if (value < min) {
          value = min;
        } else if (value > max) {
          value = max;
        }
        
        numberInput.value = value;
        slider.value = value;
      });
    });
  }
  
  // API publique
  return {
    init: init,
    initOptions: initOptions,
    initAccordions: initAccordions,
    initLockToggles: initLockToggles,
    initSliders: initSliders
  };
})();