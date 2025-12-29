/**
 * CentralAdmin - Détection du thème admin Piwigo
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {

    // ✅ Lire la valeur PHP AU BON MOMENT
    const phpDetectedScheme =
      document.body.getAttribute('data-ca-theme') || 'clear';

    // Détection JS/CSS
    let jsDetectedScheme = 'clear';

    const htmlClasses = document.documentElement.className;
    const bodyClasses = document.body.className;

    if (htmlClasses.includes('theme-roma') || bodyClasses.includes('theme-roma')) {
      jsDetectedScheme = 'dark';
    } else if (htmlClasses.includes('theme-clear') || bodyClasses.includes('theme-clear')) {
      jsDetectedScheme = 'clear';
    } else {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      if (bgColor === 'rgb(0, 0, 0)' || bgColor === 'rgb(17, 17, 17)') {
        jsDetectedScheme = 'dark';
      }
    }

    // Appliquer la classe du thème (PHP prioritaire)
    document.body.classList.add('ca-piwigo-theme-' + phpDetectedScheme);

    // Logs
    console.log('═══════════════════════════════════════════════');
    console.log('[CentralAdmin] DÉTECTION DU THÈME ADMIN');
    console.log('═══════════════════════════════════════════════');
    console.log('🔍 PHP Detection (data-ca-theme):', phpDetectedScheme);
    console.log('🔍 JS Detection (DOM/CSS):', jsDetectedScheme);
    console.log('📋 <html> classes:', htmlClasses || 'aucune');
    console.log('📋 <body> classes:', bodyClasses || 'aucune');
    console.log('🎨 Background color:', window.getComputedStyle(document.body).backgroundColor);

    const schemesMatch = phpDetectedScheme === jsDetectedScheme;

    if (!schemesMatch) {
      console.warn('⚠️ Divergence détectée → PHP prioritaire');
    } else {
      console.log('✅ PHP et JS concordent');
    }

    console.log('═══════════════════════════════════════════════');

    // Stockage pour le debugger (parfaitement cohérent maintenant)
    window.caThemeDebug = {
      php: phpDetectedScheme,
      js: jsDetectedScheme,
      htmlClasses: htmlClasses,
      bodyClasses: bodyClasses,
      bgColor: window.getComputedStyle(document.body).backgroundColor,
      concordance: schemesMatch
    };
  });
})();
