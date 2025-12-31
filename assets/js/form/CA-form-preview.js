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
      console.log('[CentralAdmin Preview] Initialisation...');
      
      // Récupérer la balise <style> existante
      let styleTag = document.getElementById('central-admin-vars-preview');
      
      if (!styleTag) {
        console.error('[CentralAdmin Preview] ❌ Style tag introuvable !');
        console.log('[CentralAdmin Preview] Création du style tag...');
        styleTag = document.createElement('style');
        styleTag.id = 'central-admin-vars-preview';
        document.head.appendChild(styleTag);
      } else {
        console.log('[CentralAdmin Preview] ✅ Style tag trouvé');
        console.log('[CentralAdmin Preview] Contenu actuel:', styleTag.textContent.substring(0, 150));
      }

      // Initialiser la prévisualisation pour tous les champs
      initLayoutPreview();
      initColorPreview();
      
      console.log('[CentralAdmin Preview] ✅ Prévisualisation initialisée');
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
  console.log('[CentralAdmin Preview] Initialisation preview couleurs...');
  
  // ===== TOOLTIPS COLORS (commun aux deux schémas) =====
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
      console.log('[Preview] ✅ Tooltip color trouvé:', colorName);
      
      // Écouter l'événement color-change (déclenché par CA-form-colors.js)
      textInput.addEventListener('color-change', function(e) {
        const hexValue = e.detail.color;
        const cssVar = '--ca-color-' + colorName.replace(/_/g, '-');
        updateCSSVariable(cssVar, hexValue);
        console.log('[Preview] Couleur tooltip mise à jour:', colorName, '=', hexValue);
      });
    } else {
      console.warn('[Preview] ❌ Tooltip color non trouvé:', colorName);
    }
  });

  // ===== CLEAR COLORS =====
  // Noms cohérents avec config/defaults.php
  const clearColors = [
    'bg_global',
    'bg_content2',
    'bg_content1',
    'bg_content3'
  ];

  clearColors.forEach(colorName => {
    // Construction de l'ID dans le template : 'bg_clear_' + 'bg_global' = 'bg_clear_bg_global'
    // Mais dans les templates, c'est 'bg_clear_global' !
    // Donc on enlève le préfixe 'bg_' pour la construction de l'ID
    const colorSuffix = colorName.replace('bg_', '');  // 'bg_global' → 'global'
    const fullId = 'bg_clear_' + colorSuffix;          // 'bg_clear_global'
    const textInput = document.getElementById(fullId + '_text');
    const colorPicker = document.getElementById(fullId + '_picker');
    
    // La variable CSS garde le nom complet
    const cssVar = '--ca-color-' + colorName.replace(/_/g, '-');  // '--ca-color-bg-global'
    
    if (textInput) {
      console.log('[Preview] ✅ Clear color trouvé:', fullId, '→ CSS var:', cssVar);
      
      textInput.addEventListener('color-change', function(e) {
        const hexValue = e.detail.color;
        updateCSSVariable(cssVar, hexValue);
        console.log('[Preview] Couleur clear mise à jour:', colorName, '=', hexValue);
      });
    } else {
      console.warn('[Preview] ❌ Clear color non trouvé:', fullId);
    }
  });

  // ===== DARK COLORS =====
  // Noms cohérents avec config/defaults.php
  const darkColors = [
    'bg_global',
    'bg_content2',
    'bg_content1',
    'bg_content3'
  ];

  darkColors.forEach(colorName => {
    // Construction de l'ID dans le template : enlever 'bg_' pour correspondre aux IDs
    const colorSuffix = colorName.replace('bg_', '');  // 'bg_global' → 'global'
    const fullId = 'bg_dark_' + colorSuffix;           // 'bg_dark_global'
    const textInput = document.getElementById(fullId + '_text');
    const colorPicker = document.getElementById(fullId + '_picker');
    
    // La variable CSS garde le nom complet
    const cssVar = '--ca-color-' + colorName.replace(/_/g, '-');  // '--ca-color-bg-global'
    
    if (textInput) {
      console.log('[Preview] ✅ Dark color trouvé:', fullId, '→ CSS var:', cssVar);
      
      textInput.addEventListener('color-change', function(e) {
        const hexValue = e.detail.color;
        updateCSSVariable(cssVar, hexValue);
        console.log('[Preview] Couleur dark mise à jour:', colorName, '=', hexValue);
      });
    } else {
      console.warn('[Preview] ❌ Dark color non trouvé:', fullId);
    }
  });
  
  console.log('[CentralAdmin Preview] ✅ Prévisualisation couleurs initialisée');
}

  /* ================================================
    MISE À JOUR VARIABLE CSS
    ================================================ */
  function updateCSSVariable(varName, value) {
    console.log('[CentralAdmin Preview] Mise à jour:', varName, '→', value);
    
    const styleTag = document.getElementById('central-admin-vars-preview');
    if (!styleTag) {
      console.error('[CentralAdmin Preview] ❌ Style tag introuvable lors de la mise à jour');
      return;
    }

    // **SOLUTION ALTERNATIVE : Utiliser setProperty directement**
    // Au lieu de modifier le contenu textuel, on modifie la propriété CSS
    document.documentElement.style.setProperty(varName, value);
    
    console.log('[CentralAdmin Preview] ✅ Variable mise à jour via setProperty');
    
    // Optionnel : mettre à jour aussi le contenu du <style> pour la cohérence
    let cssContent = styleTag.textContent;
    const pattern = new RegExp(varName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\s*:\\s*[^;]+;', 'g');
    
    if (pattern.test(cssContent)) {
      cssContent = cssContent.replace(pattern, varName + ': ' + value + ';');
      styleTag.textContent = cssContent;
      console.log('[CentralAdmin Preview] ✅ Style tag aussi mis à jour');
    } else {
      console.warn('[CentralAdmin Preview] ⚠️ Variable non trouvée dans le style tag, mais setProperty appliqué');
    }
  }

})();