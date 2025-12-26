/**
 * CentralAdmin - Prévisualisation en temps réel
 */

(function() {
  'use strict';

  // Attendre le chargement du DOM
  document.addEventListener('DOMContentLoaded', initPreview);

  function initPreview() {
    // Récupérer ou créer la balise <style> pour les variables CSS
    let styleTag = document.getElementById('central-admin-vars-preview');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'central-admin-vars-preview';
      document.head.appendChild(styleTag);
    }

    // Initialiser la prévisualisation pour tous les champs
    initLayoutPreview();
    initColorPreview();
  }

  /* ================================================
     PRÉVISUALISATION LAYOUT
     ================================================ */
  function initLayoutPreview() {
    // Largeur admin
    const adminWidthSlider = document.getElementById('admin_width_range');
    const adminWidthNumber = document.getElementById('admin_width_value');
    
    if (adminWidthSlider) {
      adminWidthSlider.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-admin-width', adminWidthSlider.value + 'px');
      });
    }
    
    if (adminWidthNumber) {
      adminWidthNumber.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-admin-width', adminWidthNumber.value + 'px');
      });
    }

    // Menubar width
    const menubarSlider = document.getElementById('menubar_width_range');
    const menubarNumber = document.getElementById('menubar_width_value');
    
    if (menubarSlider) {
      menubarSlider.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-menubar-width', menubarSlider.value + 'px');
      });
    }
    
    if (menubarNumber) {
      menubarNumber.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-menubar-width', menubarNumber.value + 'px');
      });
    }

    // align_pluginFilter_left
    const leftSlider = document.getElementById('align_pluginFilter_left_range');
    const leftNumber = document.getElementById('align_pluginFilter_left_value');
    
    if (leftSlider) {
      leftSlider.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-align-pluginFilter-left', leftSlider.value + 'px');
      });
    }
    
    if (leftNumber) {
      leftNumber.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-align-pluginFilter-left', leftNumber.value + 'px');
      });
    }

    // align_pluginFilter_right
    const rightSlider = document.getElementById('align_pluginFilter_right_range');
    const rightNumber = document.getElementById('align_pluginFilter_right_value');
    
    if (rightSlider) {
      rightSlider.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-align-pluginFilter-right', rightSlider.value + 'px');
      });
    }
    
    if (rightNumber) {
      rightNumber.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-align-pluginFilter-right', rightNumber.value + 'px');
      });
    }

    // fade_start
    const fadeSlider = document.getElementById('fade_start_range');
    const fadeNumber = document.getElementById('fade_start_value');
    
    if (fadeSlider) {
      fadeSlider.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-fade-start', fadeSlider.value + 'px');
      });
    }
    
    if (fadeNumber) {
      fadeNumber.addEventListener('input', () => {
        updateCSSVariable('--ca-layout-fade-start', fadeNumber.value + 'px');
      });
    }
  }

  /* ================================================
     PRÉVISUALISATION COULEURS
     ================================================ */
  function initColorPreview() {
    // Tooltips colors
    const tooltipColors = [
      'infos_main_color',
      'warning_main_color',
      'messages_main_color',
      'error_main_color'
    ];

    tooltipColors.forEach(colorName => {
      const picker = document.getElementById(colorName + '_picker');
      const textInput = document.getElementById(colorName + '_text');
      
      if (picker) {
        picker.addEventListener('input', () => {
          updateCSSVariable('--ca-color-' + colorName.replace(/_/g, '-'), picker.value);
        });
      }
      
      if (textInput) {
        textInput.addEventListener('input', () => {
          if (/^#[0-9A-Fa-f]{6}$/i.test(textInput.value)) {
            updateCSSVariable('--ca-color-' + colorName.replace(/_/g, '-'), textInput.value);
          }
        });
      }
    });

    // Clear colors
    const clearColors = [
      'bg_clear_global',
      'bg_clear_content2',
      'bg_clear_content1',
      'bg_clear_content3'
    ];

    clearColors.forEach(colorName => {
      const picker = document.getElementById(colorName + '_picker');
      const textInput = document.getElementById(colorName + '_text');
      const cssVarName = '--ca-color-' + colorName.replace(/^bg_clear_/, 'bg-').replace(/_/g, '-');
      
      if (picker) {
        picker.addEventListener('input', () => {
          updateCSSVariable(cssVarName, picker.value);
        });
      }
      
      if (textInput) {
        textInput.addEventListener('input', () => {
          if (/^#[0-9A-Fa-f]{6}$/i.test(textInput.value)) {
            updateCSSVariable(cssVarName, textInput.value);
          }
        });
      }
    });

    // Dark colors
    const darkColors = [
      'bg_dark_global',
      'bg_dark_content2',
      'bg_dark_content1',
      'bg_dark_content3'
    ];

    darkColors.forEach(colorName => {
      const picker = document.getElementById(colorName + '_picker');
      const textInput = document.getElementById(colorName + '_text');
      const cssVarName = '--ca-color-' + colorName.replace(/^bg_dark_/, 'bg-').replace(/_/g, '-');
      
      if (picker) {
        picker.addEventListener('input', () => {
          updateCSSVariable(cssVarName, picker.value);
        });
      }
      
      if (textInput) {
        textInput.addEventListener('input', () => {
          if (/^#[0-9A-Fa-f]{6}$/i.test(textInput.value)) {
            updateCSSVariable(cssVarName, textInput.value);
          }
        });
      }
    });
  }

  /* ================================================
     MISE À JOUR VARIABLE CSS
     ================================================ */
  function updateCSSVariable(varName, value) {
    const styleTag = document.getElementById('central-admin-vars-preview');
    if (!styleTag) return;

    // Récupérer le contenu actuel
    let cssContent = styleTag.textContent;
    
    // Créer le pattern pour trouver la variable
    const pattern = new RegExp(varName + ':\\s*[^;]+;', 'g');
    
    // Si la variable existe, la remplacer
    if (pattern.test(cssContent)) {
      cssContent = cssContent.replace(pattern, varName + ': ' + value + ';');
    } else {
      // Sinon, l'ajouter dans le bloc :root
      if (cssContent.includes(':root')) {
        cssContent = cssContent.replace(/:root\s*{/, ':root {\n  ' + varName + ': ' + value + ';');
      } else {
        cssContent = ':root {\n  ' + varName + ': ' + value + ';\n}';
      }
    }
    
    styleTag.textContent = cssContent;
  }

})();