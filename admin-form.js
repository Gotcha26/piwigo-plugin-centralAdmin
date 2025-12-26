/**
 * CentralAdmin - Gestionnaire du formulaire
 */

(function() {
  'use strict';

  // Attendre le chargement du DOM
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initAccordions();
    initLockToggles();
    initSliders();
    initColorPickers();
  }

  /* ================================================
     ACCORDÉONS
     ================================================ */
  function initAccordions() {
    const sections = document.querySelectorAll('.ca-section');
    
    sections.forEach(section => {
      const header = section.querySelector('.ca-section-header');
      const toggle = section.querySelector('.ca-toggle');
      const content = section.querySelector('.ca-section-content');
      
      if (!header || !toggle || !content) return;

      header.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle la section actuelle (ouverture/fermeture individuelle)
        if (isExpanded) {
          toggle.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.transform = 'translateY(-10px)';
          // Masquer après l'animation
          setTimeout(() => {
            if (toggle.getAttribute('aria-expanded') === 'false') {
              content.style.display = 'none';
            }
          }, 500);
        } else {
          toggle.setAttribute('aria-expanded', 'true');
          content.style.display = 'block';
          // Forcer un reflow pour que l'animation fonctionne
          content.offsetHeight;
          content.style.maxHeight = '2000px';
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        }
      });
    });
  }

  /* ================================================
     VERROUS (LOCK/UNLOCK)
     ================================================ */
  function initLockToggles() {
    const locks = document.querySelectorAll('.ca-lock');
    
    locks.forEach(lock => {
      lock.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const field = lock.closest('.ca-field');
        if (!field) return;
        
        const isLocked = lock.getAttribute('data-locked') === 'true';
        const newLockedState = !isLocked;
        
        // Mettre à jour l'état du verrou
        lock.setAttribute('data-locked', newLockedState);
        lock.title = newLockedState 
          ? lock.getAttribute('data-tooltip-locked') || 'Verrouillé'
          : lock.getAttribute('data-tooltip-unlocked') || 'Déverrouillé';
        
        // Mettre à jour l'icône
        const icon = lock.querySelector('.ca-lock-icon');
        if (icon) {
          icon.textContent = newLockedState ? '🔒' : '🔓';
        }
        
        // Gérer la classe CSS
        if (newLockedState) {
          field.classList.add('ca-field-locked');
        } else {
          field.classList.remove('ca-field-locked');
        }
        
        // Activer/désactiver les inputs
        const inputs = field.querySelectorAll('input:not(.ca-lock), select, textarea');
        inputs.forEach(input => {
          input.disabled = newLockedState;
        });
      });
    });
  }

  /* ================================================
     SLIDERS ET SYNCHRONISATION
     ================================================ */
  function initSliders() {
    const sliders = document.querySelectorAll('.ca-slider');
    
    sliders.forEach(slider => {
      const outputId = slider.getAttribute('data-output');
      if (!outputId) return;
      
      const numberInput = document.getElementById(outputId);
      if (!numberInput) return;
      
      // Mise à jour du number input quand le slider change
      slider.addEventListener('input', () => {
        numberInput.value = slider.value;
      });
      
      // Mise à jour du slider quand le number input change
      numberInput.addEventListener('input', () => {
        const value = parseInt(numberInput.value, 10);
        const min = parseInt(slider.min, 10);
        const max = parseInt(slider.max, 10);
        
        if (!isNaN(value) && value >= min && value <= max) {
          slider.value = value;
        }
      });
      
      // Validation au blur
      numberInput.addEventListener('blur', () => {
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

  /* ================================================
     COLOR PICKERS
     ================================================ */
  function initColorPickers() {
    const colorPickers = document.querySelectorAll('.ca-color-picker');
    
    colorPickers.forEach(picker => {
      const pickerId = picker.id;
      const textInputId = pickerId.replace('_picker', '_text');
      const textInput = document.getElementById(textInputId);
      
      if (!textInput) return;
      
      // Mise à jour du text input quand le color picker change
      picker.addEventListener('input', () => {
        textInput.value = picker.value.toUpperCase();
      });
      
      // Mise à jour du color picker quand le text input change
      textInput.addEventListener('input', () => {
        const value = textInput.value.trim();
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          picker.value = value;
        }
      });
      
      // Validation au blur
      textInput.addEventListener('blur', () => {
        let value = textInput.value.trim().toUpperCase();
        
        // Ajouter # si absent
        if (/^[0-9A-Fa-f]{6}$/.test(value)) {
          value = '#' + value;
        }
        
        // Valider le format
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          textInput.value = value;
          picker.value = value;
        } else {
          // Restaurer la valeur du picker
          textInput.value = picker.value.toUpperCase();
        }
      });
    });
  }

})();