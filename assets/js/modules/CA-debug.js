/**
 * CentralAdmin - Module Debug
 * 
 * Module réutilisable pour debugging dans projets Piwigo
 * Peut être utilisé dans d'autres plugins
 * 
 * @package CentralAdmin
 * @version 3.0.0
 * @author Gotcha
 * 
 * Usage:
 * CADebug.init({ enableConsoleLog: true });
 * CADebug.log('Mon message', { data: 'valeur' });
 * CADebug.detectTheme();
 */

const CADebug = (function() {
  'use strict';
  
  // Configuration par défaut
  let config = {
    consolePrefix: '[CA Debug]',
    enableConsoleLog: true,
    enableDOMInjection: true,
    enablePerformanceMetrics: true,
    logLevel: 'info', // 'error', 'warn', 'info', 'debug'
  };
  
  // Stockage des logs
  const logs = [];
  
  // Métriques de performance
  const metrics = {
    startTime: performance.now(),
    loadEvents: [],
  };
  
  /**
   * Initialise le module debug
   * @param {Object} customConfig Configuration personnalisée
   */
  function init(customConfig) {
    config = { ...config, ...customConfig };
    
    log('Module Debug initialisé', config);
    
    if (config.enablePerformanceMetrics) {
      startPerformanceTracking();
    }
    
    // Exposer une API globale pour la console
    window.CADebug = {
      log: log,
      export: exportReport,
      clear: clearLogs,
      getMetrics: getMetrics,
    };
    
    log('API globale exposée : window.CADebug');
  }
  
  /**
   * Log un message avec niveau
   * @param {String} message Message à logger
   * @param {*} data Données associées (optionnel)
   * @param {String} level Niveau de log
   */
  function log(message, data = null, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };
    
    logs.push(logEntry);
    
    if (config.enableConsoleLog) {
      const consoleMethod = console[level] || console.log;
      const prefix = `%c${config.consolePrefix}%c`;
      const prefixStyle = 'color: #3498db; font-weight: bold;';
      const normalStyle = 'color: inherit;';
      
      if (data) {
        consoleMethod(prefix + ` ${message}`, prefixStyle, normalStyle, data);
      } else {
        consoleMethod(prefix + ` ${message}`, prefixStyle, normalStyle);
      }
    }
  }
  
  /**
   * Détecte le thème Piwigo (clear/dark)
   * @returns {Object} Informations sur le thème détecté
   */
  function detectTheme() {
    // Lire la valeur PHP
    const phpDetectedScheme = document.body.getAttribute('data-ca-theme') || 'clear';
    
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
    
    const themeInfo = {
      php: phpDetectedScheme,
      js: jsDetectedScheme,
      htmlClasses: htmlClasses || 'aucune',
      bodyClasses: bodyClasses || 'aucune',
      bgColor: window.getComputedStyle(document.body).backgroundColor,
      concordance: phpDetectedScheme === jsDetectedScheme,
    };
    
    log('Thème détecté', themeInfo);
    
    // Stocker pour accès global
    window.caThemeDebug = themeInfo;
    
    return themeInfo;
  }
  
  /**
   * Peuple les éléments du DOM avec les infos de débogage
   */
  function populateDOM() {
    if (!config.enableDOMInjection) {
      return;
    }
    
    log('Peuplement du DOM avec les infos debug');
    
    // Versions jQuery
    const jqueryEl = document.getElementById('jquery-version');
    if (jqueryEl) {
      if (typeof jQuery !== 'undefined') {
        const jqVersion = jQuery.fn.jquery || 'inconnu';
        jqueryEl.innerHTML = '<span class="ca-debug-badge ca-badge-info">' + jqVersion + '</span>';
      } else {
        jqueryEl.innerHTML = '<span style="color: #dc3545;">❌ Non chargé</span>';
      }
    }
    
    // jQuery Confirm
    const jqConfirmEl = document.getElementById('jquery-confirm-status');
    if (jqConfirmEl) {
      if (typeof jQuery !== 'undefined' && typeof jQuery.confirm !== 'undefined') {
        jqConfirmEl.innerHTML = '<span class="ca-debug-badge ca-badge-info">✅ Disponible</span>';
      } else {
        jqConfirmEl.innerHTML = '<span style="color: #dc3545;">❌ Non disponible</span>';
      }
    }
        
    log('DOM peuplé avec succès');
  }
  
  /**
   * Démarre le tracking de performance
   */
  function startPerformanceTracking() {
    // Temps de chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const domLoadTime = performance.now() - metrics.startTime;
        metrics.loadEvents.push({
          event: 'DOMContentLoaded',
          time: domLoadTime.toFixed(2) + 'ms',
        });
        log('DOM chargé', { time: domLoadTime.toFixed(2) + 'ms' }, 'debug');
      });
    }
    
    // Temps de chargement complet
    window.addEventListener('load', () => {
      const fullLoadTime = performance.now() - metrics.startTime;
      metrics.loadEvents.push({
        event: 'window.load',
        time: fullLoadTime.toFixed(2) + 'ms',
      });
      log('Chargement complet', { time: fullLoadTime.toFixed(2) + 'ms' }, 'debug');
    });
  }
  
  /**
   * Retourne les métriques de performance
   * @returns {Object} Métriques
   */
  function getMetrics() {
    return {
      ...metrics,
      currentTime: performance.now() - metrics.startTime,
      memoryUsage: performance.memory ? {
        used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      } : 'Non disponible',
    };
  }
  
  /**
   * Exporte un rapport complet
   * @returns {Object} Rapport complet
   */
  function exportReport() {
    const report = {
      config: config,
      logs: logs,
      metrics: getMetrics(),
      theme: window.caThemeDebug || detectTheme(),
      browser: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
      timestamp: new Date().toISOString(),
    };
    
    log('Rapport exporté', report);
    
    return report;
  }
  
  /**
   * Télécharge le rapport en JSON
   */
  function downloadReport() {
    const report = exportReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ca-debug-report-' + Date.now() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    log('Rapport téléchargé');
  }
  
  /**
   * Efface tous les logs
   */
  function clearLogs() {
    logs.length = 0;
    log('Logs effacés');
  }
  
  /**
   * Affiche un résumé dans la console
   */
  function displaySummary() {
    console.group('%c[CA Debug] Résumé', 'color: #3498db; font-weight: bold; font-size: 14px;');
    console.log('Total logs:', logs.length);
    console.log('Métriques:', getMetrics());
    console.log('Thème:', window.caThemeDebug || 'Non détecté');
    console.groupEnd();
  }
  
  // API publique
  return {
    init: init,
    log: log,
    detectTheme: detectTheme,
    populateDOM: populateDOM,
    getMetrics: getMetrics,
    exportReport: exportReport,
    downloadReport: downloadReport,
    clearLogs: clearLogs,
    displaySummary: displaySummary,
  };
})();

// Auto-initialisation si dans le contexte CentralAdmin
if (document.body.classList.contains('centralAdmin-container') || 
    document.querySelector('.centralAdmin-container')) {
  document.addEventListener('DOMContentLoaded', function() {
    CADebug.init({ enableConsoleLog: true });
    CADebug.detectTheme();
    
    // Attendre un peu pour que tout soit chargé
    setTimeout(() => {
      CADebug.populateDOM();
    }, 100);
  });
}