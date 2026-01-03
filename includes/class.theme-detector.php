<?php
/**
 * CentralAdmin - Détecteur de Thème Admin Piwigo
 * 
 * Détecte le thème d'administration actif (clear/dark)
 * Module réutilisable pour autres plugins Piwigo
 * 
 * @package CentralAdmin
 * @version 3.0.0
 * @author Gotcha
 */

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

class CA_ThemeDetector {
    
    /**
     * @var string Thème détecté
     */
    private $theme;
    
    /**
     * @var string Méthode de détection utilisée
     */
    private $detectionMethod;
    
    /**
     * @var array Informations de débogage
     */
    private $debugInfo = array();
    
    /**
     * Constructeur
     * Détecte automatiquement le thème
     */
    public function __construct() {
        $this->detect();
    }
    
    /**
     * Détecte le thème admin actif
     * 
     * Méthode OFFICIELLE recommandée par Piwigo :
     * userprefs_get_param('admin_theme', 'clear')
     * 
     * @return string Thème détecté ('clear' ou 'dark')
     */
    public function detect() {
    global $user;
    
    // Méthode 1 : userprefs_get_param (RECOMMANDÉE)
    if (function_exists('userprefs_get_param')) {
        $rawTheme = userprefs_get_param('admin_theme', 'clear');
        $this->detectionMethod = 'userprefs_get_param';
        
        $this->debugInfo = array(
            'detection_method' => 'userprefs_get_param',
            'raw_value' => $rawTheme,
            'admin_theme_value' => $rawTheme,  // ← AJOUT
            'is_roma' => ($rawTheme === 'roma'),
            'is_clear' => ($rawTheme === 'clear'),
        );
            
            // Normalisation
            $this->theme = $this->normalize($rawTheme);
            $this->debugInfo['normalized'] = $rawTheme . ' → ' . $this->theme;
            
            return $this->theme;
        }
        
        // Méthode 2 : Fallback via $user['theme'] (moins fiable)
        if (isset($user['theme'])) {
            $rawTheme = $user['theme'];
            $this->detectionMethod = 'user_array';
            
            $this->debugInfo = array(
                'detection_method' => 'user_array',
                'raw_value' => $rawTheme,
                'admin_theme_value' => $rawTheme,  // ← AJOUT
                'warning' => 'Méthode fallback, peut être inexacte',
            );
            
            $this->theme = $this->normalize($rawTheme);
            $this->debugInfo['normalized'] = $rawTheme . ' → ' . $this->theme;
            
            return $this->theme;
        }
        
        // Méthode 3 : Fallback ultime (défaut)
        $this->theme = 'clear';
        $this->detectionMethod = 'default';
        
        $this->debugInfo = array(
            'detection_method' => 'default',
            'raw_value' => null,
            'admin_theme_value' => 'clear',  // ← AJOUT
            'warning' => 'Aucune méthode de détection disponible, utilisation du défaut',
        );
        
        return $this->theme;
    }
    
    /**
     * Normalise le nom du thème
     * 
     * Piwigo utilise 'roma' pour dark, 'clear' pour clair
     * 
     * @param string $theme Thème brut
     * @return string Thème normalisé ('clear' ou 'dark')
     */
    public function normalize($theme) {
        // Normalisation : 'roma' = dark, tout le reste = clear
        if ($theme === 'roma') {
            return 'dark';
        }
        
        return 'clear';
    }
    
    /**
     * Retourne le thème détecté
     * 
     * @return string Thème actif ('clear' ou 'dark')
     */
    public function getTheme() {
        return $this->theme;
    }
    
    /**
     * Vérifie si le thème est dark (roma)
     * 
     * @return bool True si dark
     */
    public function isDark() {
        return $this->theme === 'dark';
    }
    
    /**
     * Vérifie si le thème est clear
     * 
     * @return bool True si clear
     */
    public function isClear() {
        return $this->theme === 'clear';
    }
    
    /**
     * Retourne les informations de débogage
     * 
     * @return array Informations de débogage
     */
    public function getDebugInfo() {
        $this->debugInfo['theme_final'] = $this->theme;
        $this->debugInfo['detection_method_used'] = $this->detectionMethod;
        
        return $this->debugInfo;
    }
    
    /**
     * Injecte l'attribut data-ca-theme sur <body> via JavaScript
     * 
     * @param object $template Instance du template Smarty
     */
    public function injectThemeAttribute($template) {
        $jsCode = '
        <script>
        (function() {
            var scheme = "' . $this->theme . '";
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", function() {
                    document.body.setAttribute("data-ca-theme", scheme);
                    document.body.classList.add("ca-piwigo-theme-" + scheme);
                });
            } else {
                document.body.setAttribute("data-ca-theme", scheme);
                document.body.classList.add("ca-piwigo-theme-" + scheme);
            }
        })();
        </script>
        ';
        
        $template->append('head_elements', $jsCode);
    }
    
    /**
     * Génère un rapport de détection pour debug
     * 
     * @return string Rapport formaté
     */
    public function generateReport() {
        $report  = "=== CentralAdmin - Rapport Détection Thème ===\n";
        $report .= "Thème détecté : " . $this->theme . "\n";
        $report .= "Méthode utilisée : " . $this->detectionMethod . "\n";
        $report .= "Est Roma (dark) ? " . ($this->isDark() ? 'Oui' : 'Non') . "\n";
        $report .= "Est Clear (clair) ? " . ($this->isClear() ? 'Oui' : 'Non') . "\n";
        $report .= "\nDétails :\n";
        
        foreach ($this->debugInfo as $key => $value) {
            $report .= "  - " . $key . " : " . (is_bool($value) ? ($value ? 'true' : 'false') : $value) . "\n";
        }
        
        return $report;
    }
    
    /**
     * Retourne le schéma opposé
     * 
     * @return string Schéma opposé ('clear' ou 'dark')
     */
    public function getOppositeScheme() {
        return ($this->theme === 'clear') ? 'dark' : 'clear';
    }
    
    /**
     * Force un thème spécifique (pour tests)
     * 
     * @param string $theme Thème à forcer ('clear' ou 'dark')
     */
    public function forceTheme($theme) {
        if (in_array($theme, array('clear', 'dark'))) {
            $this->theme = $theme;
            $this->detectionMethod = 'forced';
            
            $this->debugInfo = array(
                'detection_method' => 'forced',
                'forced_theme' => $theme,
                'warning' => 'Thème forcé manuellement (mode test)',
            );
        }
    }
    
    /**
     * Exporte la configuration pour JavaScript
     * 
     * @return array Configuration pour JS
     */
    public function exportForJS() {
        return array(
            'theme' => $this->theme,
            'isDark' => $this->isDark(),
            'isClear' => $this->isClear(),
            'detectionMethod' => $this->detectionMethod,
        );
    }
    
    /**
     * Méthode statique : Détection rapide
     * 
     * @return string Thème détecté
     */
    public static function quickDetect() {
        $detector = new self();
        return $detector->getTheme();
    }
    
    /**
     * Méthode statique : Détection avec rapport complet
     * 
     * @return array [theme, debugInfo]
     */
    public static function detectWithReport() {
        $detector = new self();
        return array(
            'theme' => $detector->getTheme(),
            'debugInfo' => $detector->getDebugInfo(),
            'report' => $detector->generateReport(),
        );
    }
}