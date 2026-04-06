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
    const allSections = document.querySelectorAll('[data-accordion-group="ca-global"], [data-section-id]');
    const sections = document.querySelectorAll('.ca-section, .mog-section, .sky-section');

    var firstOpenSection = null;

    // Restaurer l'état des sections depuis localStorage
    allSections.forEach(function(section) {
      const sectionId = section.getAttribute('data-section-id') || section.getAttribute('id');
      if (!sectionId) return;

      const savedState = localStorage.getItem('ca-section-' + sectionId);
      const toggle = section.querySelector('.ca-toggle, .mog-section-header, .sky-section-header');
      const content = section.querySelector('.ca-section-content, .mog-section-content, .sky-section-content');

      if (savedState === 'open' && toggle && content) {
        toggle.setAttribute('aria-expanded', 'true');
        if (!section.classList.contains('is-open')) section.classList.add('is-open');
        content.style.display = 'block';
        content.style.maxHeight = '2000px';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';

        if (!firstOpenSection) firstOpenSection = section;

        // Réinitialiser les tooltips après ouverture
        setTimeout(function() {
          if (typeof CATooltips !== 'undefined' && CATooltips.initSection) {
            CATooltips.initSection(content);
          }
        }, 100);
      }
    });

    // Scroll vers le premier accordéon ouvert (utile après rechargement de page)
    if (firstOpenSection) {
      setTimeout(function() {
        firstOpenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
    
    allSections.forEach(function(section) {
      const isGlobalAccordion = section.getAttribute('data-accordion-group') === 'ca-global';
      const header = section.querySelector('.ca-section-header, .mog-section-header, .sky-section-header');
      const toggle = section.querySelector('.ca-toggle') || header;
      const content = section.querySelector('.ca-section-content, .mog-section-content, .sky-section-content');
      const sectionId = section.getAttribute('data-section-id') || section.getAttribute('id');

      if (!header || !content) return;

      header.addEventListener('click', function() {
        const isExpanded = section.classList.contains('is-open');
        const singleAccordionCheckbox = document.getElementById('ca-single-accordion');
        const singleMode = singleAccordionCheckbox ? singleAccordionCheckbox.checked : true;

        // Si mode unitaire (pour global ca-accordion) et ouverture, fermer toutes les autres sections du groupe
        if (isGlobalAccordion && singleMode && !isExpanded) {
          allSections.forEach(function(otherSection) {
            if (otherSection !== section && otherSection.getAttribute('data-accordion-group') === 'ca-global') {
              const otherHeader = otherSection.querySelector('.ca-section-header, .mog-section-header, .sky-section-header');
              const otherContent = otherSection.querySelector('.ca-section-content, .mog-section-content, .sky-section-content');
              const otherSectionId = otherSection.getAttribute('data-section-id') || otherSection.getAttribute('id');

              if (otherContent && otherSection.classList.contains('is-open')) {
                otherSection.classList.remove('is-open');
                otherContent.style.maxHeight = '0';
                otherContent.style.opacity = '0';
                otherContent.style.transform = 'translateY(-10px)';
                otherContent.style.paddingTop = '0';
                otherContent.style.paddingBottom = '0';
                otherContent.style.borderTopWidth = '0';

                // Sauvegarder l'état fermé
                if (otherSectionId) {
                  localStorage.setItem('ca-section-' + otherSectionId, 'closed');
                }

                setTimeout(function() {
                  if (!otherSection.classList.contains('is-open')) {
                    otherContent.style.display = 'none';
                  }
                }, 500);
              }
            }
          });
        }
        
        // Toggle la section actuelle
        if (isExpanded) {
          section.classList.remove('is-open');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.transform = 'translateY(-10px)';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
          content.style.borderTopWidth = '0';

          // Sauvegarder l'état fermé
          if (sectionId) {
            localStorage.setItem('ca-section-' + sectionId, 'closed');
          }

          setTimeout(function() {
            if (!section.classList.contains('is-open')) {
              content.style.display = 'none';
            }
          }, 500);
        } else {
          section.classList.add('is-open');
          content.style.display = 'block';
          content.style.paddingTop = '';
          content.style.paddingBottom = '';
          content.style.borderTopWidth = '';
          content.offsetHeight; // Force reflow
          content.style.maxHeight = '2000px';
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';

          // Sauvegarder l'état ouvert
          if (sectionId) {
            localStorage.setItem('ca-section-' + sectionId, 'open');
          }

          // Réinitialiser les tooltips après ouverture
          setTimeout(function() {
            if (typeof CATooltips !== 'undefined' && CATooltips.initSection) {
              CATooltips.initSection(content);
            }
          }, 100);
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