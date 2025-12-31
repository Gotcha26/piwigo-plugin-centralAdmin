<?php
/**
 * CentralAdmin - Gestionnaire de Configuration
 * 
 * Gère le chargement, la sauvegarde et la fusion des configurations
 * Peut être réutilisé dans d'autres plugins Piwigo
 * 
 * @package CentralAdmin
 * @version 3.0.0
 * @author Gotcha
 */

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

class CA_ConfigManager {
    
    /**
     * @var array Valeurs par défaut
     */
    private $defaults;
    
    /**
     * @var array Configuration actuelle
     */
    private $current;
    
    /**
     * @var string Clé de configuration dans Piwigo
     */
    private $configKey = 'centralAdmin';
    
    /**
     * @var string Chemin vers defaults.php
     */
    private $defaultsPath;
    
    /**
     * Constructeur
     * 
     * @param string $defaultsPath Chemin vers defaults.php
     */
    public function __construct($defaultsPath = null) {
        if ($defaultsPath === null) {
            $this->defaultsPath = dirname(__DIR__) . '/config/defaults.php';
        } else {
            $this->defaultsPath = $defaultsPath;
        }
        
        $this->loadDefaults();
        $this->loadCurrent();
    }
    
    /**
     * Charge les valeurs par défaut depuis defaults.php
     * 
     * @return bool Succès du chargement
     */
    public function loadDefaults() {
        if (!file_exists($this->defaultsPath)) {
            trigger_error(
                'CentralAdmin: defaults.php introuvable (' . $this->defaultsPath . ')',
                E_USER_WARNING
            );
            return false;
        }
        
        $this->defaults = include $this->defaultsPath;
        
        if (!is_array($this->defaults)) {
            trigger_error(
                'CentralAdmin: defaults.php ne retourne pas un tableau',
                E_USER_WARNING
            );
            return false;
        }
        
        return true;
    }
    
    /**
     * Charge la configuration actuelle depuis la BDD
     * 
     * @return array Configuration actuelle
     */
    public function loadCurrent() {
        global $conf;
        
        // Désérialisation propre si existante
        if (isset($conf[$this->configKey])) {
            $conf[$this->configKey] = safe_unserialize($conf[$this->configKey]);
        }
        
        // Initialisation UNIQUEMENT si absente ou invalide
        if (empty($conf[$this->configKey]) || !is_array($conf[$this->configKey])) {
            $conf[$this->configKey] = $this->defaults;
            conf_update_param($this->configKey, $conf[$this->configKey]);
        }
        
        // Fusion défensive avec les valeurs par défaut
        $this->current = array_replace_recursive(
            $this->defaults,
            $conf[$this->configKey]
        );
        
        return $this->current;
    }
    
    /**
     * Sauvegarde la configuration
     * 
     * @param array $data Nouvelles données
     * @return bool Succès de la sauvegarde
     */
    public function save($data) {
        // Validation basique
        if (!is_array($data)) {
            return false;
        }
        
        // Fusionner avec la config actuelle
        $newConfig = array_replace_recursive($this->current, $data);
        
        // Sauvegarder
        conf_update_param($this->configKey, $newConfig);
        
        // Mettre à jour l'instance
        $this->current = $newConfig;
        
        return true;
    }
    
    /**
     * Réinitialise la configuration (tout ou par schéma)
     * 
     * @param string|null $scheme Schéma à réinitialiser ('clear', 'dark', ou null pour tout)
     * @return bool Succès de la réinitialisation
     */
    public function reset($scheme = null) {
        $newConfig = $this->defaults;
        
        if ($scheme !== null) {
            // Réinitialiser uniquement un schéma
            $otherScheme = ($scheme === 'clear') ? 'dark' : 'clear';
            
            // Préserver les modifications de l'autre schéma
            if (isset($this->current['user_modifications'][$otherScheme])) {
                $newConfig['user_modifications'][$otherScheme] = 
                    $this->current['user_modifications'][$otherScheme];
            }
            
            // Effacer les modifications du schéma actuel
            $newConfig['user_modifications'][$scheme] = array();
            
            // Préserver le layout (commun aux deux schémas)
            if (isset($this->current['layout'])) {
                $newConfig['layout'] = $this->current['layout'];
            }
        }
        
        // Sauvegarder
        conf_update_param($this->configKey, $newConfig);
        
        // Mettre à jour l'instance
        $this->current = $newConfig;
        
        return true;
    }
    
    /**
     * Fusionne les modifications utilisateur avec le schéma actif
     * 
     * @param string $scheme Schéma actif ('clear' ou 'dark')
     * @return array Couleurs fusionnées
     */
    public function getMergedColors($scheme) {
        $baseColors = $this->defaults['colors'][$scheme] ?? array();
        $currentColors = $this->current['colors'][$scheme] ?? array();
        $userModifications = $this->current['user_modifications'][$scheme] ?? array();
        
        return array_merge($baseColors, $currentColors, $userModifications);
    }
    
    /**
     * Détecte les modifications utilisateur
     * 
     * @param array $newData Nouvelles données
     * @param string $scheme Schéma actif
     * @return array Modifications détectées
     */
    public function detectUserModifications($newData, $scheme) {
        $modifications = array();
        
        if (!isset($newData['colors'][$scheme])) {
            return $modifications;
        }
        
        foreach ($newData['colors'][$scheme] as $key => $value) {
            $defaultValue = $this->defaults['colors'][$scheme][$key] ?? null;
            
            if ($defaultValue && $value !== $defaultValue) {
                $modifications[$key] = $value;
            }
        }
        
        return $modifications;
    }
    
    /**
     * Retourne la configuration actuelle
     * 
     * @return array Configuration actuelle
     */
    public function getCurrent() {
        return $this->current;
    }
    
    /**
     * Retourne les valeurs par défaut
     * 
     * @return array Valeurs par défaut
     */
    public function getDefaults() {
        return $this->defaults;
    }
    
    /**
     * Retourne une valeur spécifique de la configuration
     * 
     * @param string $path Chemin vers la valeur (ex: 'layout.admin_width')
     * @param mixed $default Valeur par défaut si non trouvée
     * @return mixed Valeur trouvée ou défaut
     */
    public function get($path, $default = null) {
        $keys = explode('.', $path);
        $value = $this->current;
        
        foreach ($keys as $key) {
            if (!isset($value[$key])) {
                return $default;
            }
            $value = $value[$key];
        }
        
        return $value;
    }
    
    /**
     * Définit une valeur spécifique dans la configuration
     * 
     * @param string $path Chemin vers la valeur (ex: 'layout.admin_width')
     * @param mixed $value Nouvelle valeur
     * @return bool Succès de l'opération
     */
    public function set($path, $value) {
        $keys = explode('.', $path);
        $temp = &$this->current;
        
        foreach ($keys as $key) {
            if (!isset($temp[$key])) {
                $temp[$key] = array();
            }
            $temp = &$temp[$key];
        }
        
        $temp = $value;
        
        return true;
    }
    
    /**
     * Exporte la configuration pour débogage
     * 
     * @return array Informations de débogage
     */
    public function exportDebugInfo() {
        return array(
            'defaults_loaded' => !empty($this->defaults),
            'current_loaded' => !empty($this->current),
            'config_key' => $this->configKey,
            'defaults_path' => $this->defaultsPath,
            'layout' => $this->current['layout'] ?? null,
            'user_modifications' => $this->current['user_modifications'] ?? null,
        );
    }
}