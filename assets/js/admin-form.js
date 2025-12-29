/**
 * CentralAdmin - Gestionnaire du formulaire
 */

(function() {
  'use strict';

  // Attendre le chargement du DOM
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    console.log('[CentralAdmin] Initialisation...');
    initOptions();
    initAccordions();
    initLockToggles();
    initSliders();
    initColorPickers();
    initCreditsModal();
  }

  /* ================================================
     OPTIONS GLOBALES
     ================================================ */
  function initOptions() {
    // Option thème navigateur
    const browserThemeCheckbox = document.getElementById('ca-browser-theme');
    if (browserThemeCheckbox) {
      const useBrowserTheme = localStorage.getItem('ca-use-browser-theme') === 'true';
      browserThemeCheckbox.checked = useBrowserTheme;
      
      if (useBrowserTheme) {
        document.body.classList.add('ca-browser-theme');
      }
      
      browserThemeCheckbox.addEventListener('change', () => {
        if (browserThemeCheckbox.checked) {
          document.body.classList.add('ca-browser-theme');
          localStorage.setItem('ca-use-browser-theme', 'true');
          console.log('[CentralAdmin] Thème navigateur activé');
        } else {
          document.body.classList.remove('ca-browser-theme');
          localStorage.setItem('ca-use-browser-theme', 'false');
          console.log('[CentralAdmin] Thème navigateur désactivé, retour au thème Piwigo');
        }
      });
    }

    // Option accordion unique
    const singleAccordionCheckbox = document.getElementById('ca-single-accordion');
    if (singleAccordionCheckbox) {
      const singleAccordion = localStorage.getItem('ca-single-accordion') !== 'false';
      singleAccordionCheckbox.checked = singleAccordion;
      
      singleAccordionCheckbox.addEventListener('change', () => {
        localStorage.setItem('ca-single-accordion', singleAccordionCheckbox.checked);
      });
    }
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
        const singleAccordionCheckbox = document.getElementById('ca-single-accordion');
        const singleMode = singleAccordionCheckbox ? singleAccordionCheckbox.checked : true;
        
        // Si mode unitaire, fermer toutes les autres sections
        if (singleMode && !isExpanded) {
          sections.forEach(otherSection => {
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
                setTimeout(() => {
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
          setTimeout(() => {
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
      
      slider.addEventListener('input', () => {
        numberInput.value = slider.value;
      });
      
      numberInput.addEventListener('input', () => {
        const value = parseInt(numberInput.value, 10);
        const min = parseInt(slider.min, 10);
        const max = parseInt(slider.max, 10);
        
        if (!isNaN(value) && value >= min && value <= max) {
          slider.value = value;
        }
      });
      
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
    COLOR PICKERS NATIFS
    ================================================ */
  function initColorPickers() {
    const colorPickers = document.querySelectorAll('.ca-color-picker');
    
    colorPickers.forEach(picker => {
      const pickerId = picker.id;
      const textInputId = pickerId.replace('_picker', '_text');
      const textInput = document.getElementById(textInputId);
      
      if (!textInput) {
        console.warn('[CentralAdmin] Input texte non trouvé pour', pickerId);
        return;
      }
      
      // Synchronisation picker natif → input texte
      picker.addEventListener('input', () => {
        const hexValue = picker.value.toUpperCase();
        textInput.value = hexValue;
        
        // Déclencher l'événement pour la prévisualisation
        const event = new CustomEvent('color-change', { 
          detail: { color: hexValue, inputId: textInput.id } 
        });
        textInput.dispatchEvent(event);
      });
      
      // Synchronisation input texte → picker natif
      textInput.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/i.test(textInput.value)) {
          picker.value = textInput.value;
          
          const event = new CustomEvent('color-change', { 
            detail: { color: textInput.value.toUpperCase(), inputId: textInput.id } 
          });
          textInput.dispatchEvent(event);
        }
      });
      
      // Validation au blur
      textInput.addEventListener('blur', () => {
        if (!/^#[0-9A-Fa-f]{6}$/i.test(textInput.value)) {
          textInput.value = picker.value.toUpperCase();
        }
      });
    });
    
    console.log('[CentralAdmin] Color pickers natifs initialisés:', colorPickers.length);
  }

  /* ================================================
    MODALE CRÉDITS
    ================================================ */
  function initCreditsModal() {
    const creditsLink = document.getElementById('ca-credits-link');
    if (!creditsLink) return;
    
    creditsLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Vérifier que jQuery Confirm est chargé
      if (typeof jQuery === 'undefined' || typeof jQuery.confirm === 'undefined') {
        console.error('[CentralAdmin] jQuery Confirm non disponible');
        // Fallback : nouvelle fenêtre
        window.open('plugins/centralAdmin/credentials.html', 'credits', 'width=750');
        return;
      }
      
      // Charger le contenu HTML via AJAX
      jQuery.ajax({
        url: 'plugins/centralAdmin/config/credentials.html',
        dataType: 'html',
        success: function(html) {
          // Afficher avec jquery-confirm (système natif Piwigo)
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
            // Ajouter un overlay avec flou
            onOpenBefore: function() {
              // Ajouter une classe pour flouter l'arrière-plan
              jQuery('.jconfirm-bg').css({
                'backdrop-filter': 'blur(3px)',
                'background': 'rgba(0, 0, 0, 0.5)'
              });
              
              // Ajuster la hauteur de la modale
              jQuery('.jconfirm-box-container').css({
                'max-height': '85vh',      // Hauteur maximale = 85% de la hauteur viewport
                'min-height': '400px'      // Hauteur minimale
              });
              
              // Rendre le contenu scrollable si nécessaire
              jQuery('.jconfirm-content').css({
                'max-height': 'calc(85vh - 120px)', // Hauteur max - header/footer
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
    
    console.log('[CentralAdmin] Modale crédits initialisée');
  }

})();