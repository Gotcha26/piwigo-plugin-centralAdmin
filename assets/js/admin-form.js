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
    initCreditsModal();
    
    // Attendre que Spectrum soit chargé
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.spectrum !== 'undefined') {
      console.log('[CentralAdmin] Spectrum détecté, initialisation des color pickers');
      initColorPickers();
    } else {
      console.warn('[CentralAdmin] Spectrum non disponible, attente...');
      // Réessayer après un délai
      setTimeout(function() {
        if (typeof jQuery !== 'undefined' && typeof jQuery.fn.spectrum !== 'undefined') {
          console.log('[CentralAdmin] Spectrum chargé avec délai, initialisation');
          initColorPickers();
        } else {
          console.error('[CentralAdmin] Spectrum toujours non disponible après délai');
        }
      }, 500);
    }
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
          
          // Si c'est un color picker Spectrum, le désactiver aussi
          if (input.classList.contains('ca-color-input') && typeof jQuery !== 'undefined') {
            jQuery(input).spectrum(newLockedState ? 'disable' : 'enable');
          }
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
     COLOR PICKERS AVEC SPECTRUM
     ================================================ */
  function initColorPickers() {
    const colorPickers = document.querySelectorAll('.ca-color-picker');
    let initCount = 0;
    
    colorPickers.forEach(picker => {
      const pickerId = picker.id;
      const textInputId = pickerId.replace('_picker', '_text');
      const textInput = document.getElementById(textInputId);
      
      if (!textInput) {
        console.warn('[CentralAdmin] Input texte non trouvé pour', pickerId);
        return;
      }
      
      // Vérifier jQuery et Spectrum
      if (typeof jQuery === 'undefined' || typeof jQuery.fn.spectrum === 'undefined') {
        console.error('[CentralAdmin] jQuery ou Spectrum non disponible');
        return;
      }
      
      // Cacher UNIQUEMENT le picker natif (pas l'input texte)
      picker.style.display = 'none';

      // S'assurer que l'input texte reste visible
      textInput.style.display = 'inline-block';
      textInput.readOnly = false;
      
      // Initialiser Spectrum
      jQuery(textInput).spectrum({
        color: textInput.value || '#000000',
        showInput: true,
        showInitial: true,
        showPalette: true,
        showButtons: false,
        preferredFormat: "hex",
        clickoutFiresChange: true,
        disabled: textInput.disabled,
        containerClassName: 'ca-spectrum-container',
        replacerClassName: 'ca-spectrum-replacer',
        showAlpha: false,  // Désactiver le canal alpha pour forcer hexa pur
        palette: [
          ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
          ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
          ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
          ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
          ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"]
        ],
        move: function(color) {
          if (color) {
            picker.value = color.toHexString();
          }
        },
        change: function(color) {
          if (color) {
            const hexValue = color.toHexString().toUpperCase();
            textInput.value = hexValue;
            picker.value = hexValue;
            console.log('[CentralAdmin] Couleur changée:', hexValue);
          }
        }
      });
      
      initCount++;
    });
    
    console.log('[CentralAdmin] Color pickers initialisés:', initCount);
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
        window.open('plugins/centralAdmin/credentials.html', 'credits', 'width=750,height=600');
        return;
      }
      
      // Charger le contenu HTML via AJAX
      jQuery.ajax({
        url: 'plugins/centralAdmin/config/credentials.html',
        dataType: 'html',
        success: function(html) {
          // Afficher avec jquery-confirm (système natif Piwigo)
          jQuery.confirm({
            title: 'Crédits - centralAdmin',
            content: html,
            type: 'blue',
            boxWidth: '750px',
            useBootstrap: false,
            onOpenBefore: function() {
              // Ajouter une classe pour flouter l'arrière-plan
              jQuery('.jconfirm-bg').css({
                'backdrop-filter': 'blur(3px)',
                'background': 'rgba(0, 0, 0, 0.5)'
              });
            },
            buttons: {
              close: {
                text: 'Fermer',
                btnClass: 'btn-blue',
                action: function() {
                  // Se ferme automatiquement
                }
              }
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