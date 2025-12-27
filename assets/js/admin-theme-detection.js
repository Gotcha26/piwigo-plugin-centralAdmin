/**
 * CentralAdmin - Détection du thème admin Piwigo
 */

(function() {
  'use strict';

  // Récupérer le scheme PHP depuis l'attribut data
  const phpDetectedScheme = document.body.getAttribute('data-ca-theme') || 'clear';
  
  // Détection JS/CSS (côté client)
  let jsDetectedScheme = 'clear'; // Défaut
  
  document.addEventListener('DOMContentLoaded', function() {
    // Méthode 1 : Vérifier les classes sur <html> ou <body>
    const htmlClasses = document.documentElement.className;
    const bodyClasses = document.body.className;
    
    if (htmlClasses.includes('theme-roma') || bodyClasses.includes('theme-roma')) {
      jsDetectedScheme = 'dark';
    } else if (htmlClasses.includes('theme-clear') || bodyClasses.includes('theme-clear')) {
      jsDetectedScheme = 'clear';
    } else {
      // Méthode 2 : Analyser les styles CSS appliqués
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      if (bgColor === 'rgb(0, 0, 0)' || bgColor === 'rgb(17, 17, 17)') {
        jsDetectedScheme = 'dark';
      }
    }
    
    // Appliquer la classe du thème sur body
    document.body.classList.add('ca-piwigo-theme-' + phpDetectedScheme);
    
    // Logs de debug
    console.log('═══════════════════════════════════════════════');
    console.log('[CentralAdmin] DÉTECTION DU THÈME ADMIN');
    console.log('═══════════════════════════════════════════════');
    console.log('🔍 PHP Detection (userprefs):', phpDetectedScheme);
    console.log('🔍 JS Detection (DOM/CSS):', jsDetectedScheme);
    console.log('📋 <html> classes:', htmlClasses || 'aucune');
    console.log('📋 <body> classes:', bodyClasses || 'aucune');
    console.log('🎨 Background color:', window.getComputedStyle(document.body).backgroundColor);
    
    if (phpDetectedScheme !== jsDetectedScheme) {
      console.warn('⚠️ Divergence détectée entre PHP et JS !');
      console.warn('   → Utilisation de la valeur PHP (prioritaire)');
    } else {
      console.log('✅ PHP et JS concordent');
    }
    console.log('═══════════════════════════════════════════════');
    
    // Stocker pour le debugger
    window.caThemeDebug = {
      php: phpDetectedScheme,
      js: jsDetectedScheme,
      htmlClasses: htmlClasses,
      bodyClasses: bodyClasses,
      bgColor: window.getComputedStyle(document.body).backgroundColor,
      concordance: phpDetectedScheme === jsDetectedScheme
    };
  });
})();