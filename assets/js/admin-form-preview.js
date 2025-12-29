/**
 * CentralAdmin - Prévisualisation en temps réel
 */

(function() {
  'use strict';

  // Attendre le chargement du DOM
  document.addEventListener('DOMContentLoaded', initPreview);

  // Fonction utilitaire pour logger avec style
  function logPreview(message, varName, value) {
    console.log(
      '%c[CentralAdmin Preview]%c ' + message,
      'color: #3498db; font-weight: bold;',
      'color: inherit;',
      '\n→ Variable:', varName,
      '\n→ Valeur:', value
    );
  }

  function initPreview() {
    // Récupérer la balise <style> existante (déjà créée par le template)
    let styleTag = document.getElementById('central-admin-vars-preview');
    
    if (!styleTag) {
      console.warn('[CentralAdmin Preview] Style tag non trouvé, création...');
      styleTag = document.createElement('style');
      styleTag.id = 'central-admin-vars-preview';
      document.head.appendChild(styleTag);
    } else {
      console.log('[CentralAdmin Preview] Style tag existant trouvé, préservation des valeurs initiales');
    }

    // Initialiser la prévisualisation pour tous les champs
    initLayoutPreview();
    initColorPreview();
    
    console.log('[CentralAdmin Preview] Prévisualisation initialisée');

    // Debug : afficher les variables CSS actuelles
    setTimeout(() => {
      const styleTag = document.getElementById('central-admin-vars-preview');
      if (styleTag) {
        console.log('[CentralAdmin Preview] Contenu CSS actuel:');
        console.log(styleTag.textContent);
      }
    }, 100);
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
  
  // TOOLTIPS COLORS (commun aux deux schémas)
  const tooltipColors = [
    'infos_main_color',
    'warning_main_color',
    'messages_main_color',
    'error_main_color'
  ];

  tooltipColors.forEach(colorName => {
    const textInput = document.getElementById(colorName + '_text');
    const colorPicker = document.getElementById(colorName + '_picker');
    
    if (textInput) {
      // Écouter l'événement color-change (déclenché par admin-form.js)
      textInput.addEventListener('color-change', function(e) {
        const hexValue = e.detail.color;
        updateCSSVariable('--ca-color-' + colorName.replace(/_/g, '-'), hexValue);
        console.log('[CentralAdmin Preview] Couleur tooltip mise à jour:', colorName, '=', hexValue);
      });
    }
  });

  // CLEAR COLORS
  const clearColors = ['bg_global', 'bg_content2', 'bg_content1', 'bg_content3'];

  clearColors.forEach(colorName => {
    const fullName = 'bg_clear_' + colorName;
    const textInput = document.getElementById(fullName + '_text');
    const cssVarName = '--ca-color-' + colorName.replace(/_/g, '-');
    
    if (textInput) {
      textInput.addEventListener('color-change', function(e) {
        const hexValue = e.detail.color;
        updateCSSVariable(cssVarName, hexValue);
        console.log('[CentralAdmin Preview] Couleur clear mise à jour:', colorName, '=', hexValue);
      });
    }
  });

  // DARK COLORS
  const darkColors = ['bg_global', 'bg_content2', 'bg_content1', 'bg_content3'];

  darkColors.forEach(colorName => {
    const fullName = 'bg_dark_' + colorName;
    const textInput = document.getElementById(fullName + '_text');
    const cssVarName = '--ca-color-' + colorName.replace(/_/g, '-');
    
    if (textInput) {
      textInput.addEventListener('color-change', function(e) {
        const hexValue = e.detail.color;
        updateCSSVariable(cssVarName, hexValue);
        console.log('[CentralAdmin Preview] Couleur dark mise à jour:', colorName, '=', hexValue);
      });
    }
  });
  
  console.log('[CentralAdmin Preview] Prévisualisation couleurs initialisée');
}

  /* ================================================
    MISE À JOUR VARIABLE CSS
    ================================================ */
  function updateCSSVariable(varName, value) {
    const styleTag = document.getElementById('central-admin-vars-preview');
    if (!styleTag) {
      console.error('[CentralAdmin Preview] Style tag introuvable');
      return;
    }

    // Récupérer le contenu actuel
    let cssContent = styleTag.textContent;
    
    // Créer le pattern pour trouver la variable (accepte espaces et sauts de ligne)
    const pattern = new RegExp(varName + '\\s*:\\s*[^;]+;', 'g');
    
    // Si la variable existe, la remplacer
    if (pattern.test(cssContent)) {
      cssContent = cssContent.replace(pattern, varName + ': ' + value + ';');
      console.log('[CentralAdmin Preview] Variable mise à jour:', varName, '=', value);
    } else {
      // Sinon, l'ajouter dans le bloc :root
      if (cssContent.includes(':root')) {
        // Ajouter avant la fermeture du :root
        cssContent = cssContent.replace(/}([^}]*)$/, '  ' + varName + ': ' + value + ';\n}$1');
        console.log('[CentralAdmin Preview] Variable ajoutée:', varName, '=', value);
      } else {
        cssContent = ':root {\n  ' + varName + ': ' + value + ';\n}';
        console.log('[CentralAdmin Preview] Bloc :root créé avec:', varName, '=', value);
      }
    }
    
    styleTag.textContent = cssContent;
  }

})();