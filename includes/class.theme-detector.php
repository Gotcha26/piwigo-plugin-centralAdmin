<?php
/**
 * CentralAdmin - Détecteur de Thème Admin Piwigo
 * 
 * @package CentralAdmin
 * @version 3.1.0
 * @author Gotcha
 */

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

class CA_ThemeDetector {
    
    private $theme;
    private $rawTheme;
    private $debugInfo = array();
    
    public function __construct() {
        $this->detect();
    }
    
    /**
     * Détecte le thème admin via userprefs_get_param
     * 
     * @return string 'clear' ou 'dark'
     */
    public function detect() {
        if (!function_exists('userprefs_get_param')) {
            $this->theme = 'clear';
            $this->rawTheme = 'clear';
            $this->debugInfo = array(
                'detection_method' => 'fallback',
                'admin_theme_value' => 'clear',
                'raw_value' => null,
                'is_roma' => false,
                'is_clear' => true,
                'normalized' => 'fallback → clear',
            );
            return $this->theme;
        }
        
        $this->rawTheme = userprefs_get_param('admin_theme', 'clear');
        $this->theme = ($this->rawTheme === 'roma') ? 'dark' : 'clear';
        
        $this->debugInfo = array(
            'detection_method' => 'userprefs_get_param',
            'admin_theme_value' => $this->rawTheme,
            'raw_value' => $this->rawTheme,
            'is_roma' => ($this->rawTheme === 'roma'),
            'is_clear' => ($this->rawTheme === 'clear'),
            'normalized' => $this->rawTheme . ' → ' . $this->theme,
        );
        
        return $this->theme;
    }
    
    public function getTheme() {
        return $this->theme;
    }
    
    public function isDark() {
        return $this->theme === 'dark';
    }
    
    public function isClear() {
        return $this->theme === 'clear';
    }
    
    public function getDebugInfo() {
        return array_merge($this->debugInfo, array(
            'theme_final' => $this->theme,
        ));
    }
    
    /**
     * Injecte data-ca-theme et classe CSS sur <body>
     * Avec protection DOMContentLoaded si body pas encore créé
     */
    public function injectThemeAttribute($template) {
        $jsCode = sprintf(
            '<script>
    (function(){
    var s="%s";
    function applyTheme(){
        document.documentElement.setAttribute("data-ca-theme",s);
        document.body.setAttribute("data-ca-theme",s);
        document.body.classList.add("ca-piwigo-theme-"+s);
    }
    if(document.body){
        applyTheme();
    }else{
        document.addEventListener("DOMContentLoaded",applyTheme);
    }
    })();
    </script>',
            $this->theme
        );
        
        $template->append('head_elements', $jsCode);
    }
    
    public function getOppositeScheme() {
        return ($this->theme === 'clear') ? 'dark' : 'clear';
    }
    
    public function exportForJS() {
        return array(
            'theme' => $this->theme,
            'isDark' => $this->isDark(),
            'isClear' => $this->isClear(),
        );
    }
    
    public static function quickDetect() {
        $detector = new self();
        return $detector->getTheme();
    }
}