<?php
/**
 * Gestion des assets (CSS/JS) avec support des versions minifiées
 * Version 3.2.0 - Correction du problème "Array to string conversion"
 * 
 * @package CentralAdmin
 * @version 3.2.0
 */

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

/**
 * Retourne le chemin d'un asset avec gestion SCSS/CSS/MIN
 * 
 * Ordre de priorité :
 * 1. .min.css (production)
 * 2. .css (compilé)
 * 3. .scss (développement - renommé en .css pour Piwigo)
 * 
 * @param string $asset_path Chemin relatif depuis racine plugin
 * @return string Chemin avec cache-buster
 */
function ca_asset($asset_path)
{
    // Validation
    if (!is_string($asset_path)) {
        error_log('[CA] ca_asset() - Type invalide : ' . gettype($asset_path));
        return (string)$asset_path;
    }

    // Auto-correction chemins incorrects
    if (strpos($asset_path, 'plugins/centralAdmin/') !== false) {
        $asset_path = preg_replace('#^.*?plugins/centralAdmin/#', '', $asset_path);
    }
    
    $asset_path = ltrim($asset_path, '/');
    $path_info = pathinfo($asset_path);
    
    if (!isset($path_info['extension'])) {
        error_log('[CA] ca_asset() - Pas d\'extension : ' . $asset_path);
        return $asset_path;
    }

    $plugin_root = dirname(dirname(__FILE__));
    $ext = $path_info['extension'];
    
    // === GESTION SPÉCIALE CSS/SCSS ===
    if (in_array($ext, ['css', 'scss'])) {
        $base_path = $path_info['dirname'] . '/' . $path_info['filename'];
        
        // 1. Chercher .min.css (priorité absolue)
        $min_path = $base_path . '.min.css';
        if (file_exists($plugin_root . '/' . $min_path)) {
            return $min_path . '?v=' . filemtime($plugin_root . '/' . $min_path);
        }
        
        // 2. Chercher .css (compilé depuis SCSS)
        $css_path = $base_path . '.css';
        if (file_exists($plugin_root . '/' . $css_path)) {
            return $css_path . '?v=' . filemtime($plugin_root . '/' . $css_path);
        }
        
        // 3. Chercher .scss (DEV uniquement - servir comme .css)
        $scss_path = $base_path . '.scss';
        if (file_exists($plugin_root . '/' . $scss_path)) {
            // HACK : Renommer en .css pour Piwigo
            // Le contenu SCSS reste valide car CSS est un sous-ensemble
            return $scss_path . '?v=' . filemtime($plugin_root . '/' . $scss_path);
        }
        
        error_log('[CA] ca_asset() - Aucun fichier trouvé pour : ' . $asset_path);
        return $asset_path;
    }
    
    // === GESTION CLASSIQUE AUTRES EXTENSIONS ===
    $minified_path = $path_info['dirname'] . '/' . $path_info['filename'] . '.min.' . $ext;
    
    if (file_exists($plugin_root . '/' . $minified_path)) {
        return $minified_path . '?v=' . filemtime($plugin_root . '/' . $minified_path);
    }
    
    if (file_exists($plugin_root . '/' . $asset_path)) {
        return $asset_path . '?v=' . filemtime($plugin_root . '/' . $asset_path);
    }
    
    error_log('[CA] ca_asset() - Fichier introuvable : ' . $asset_path);
    return $asset_path;
}

/**
 * Version de secours : retourne le chemin tel quel
 * Utilisée si ca_asset() pose problème
 * 
 * @param string $asset_path Chemin de l'asset
 * @return string Chemin inchangé
 */
function ca_asset_fallback($asset_path)
{
    if (!is_string($asset_path)) {
        error_log('[CentralAdmin] ca_asset_fallback() - ERREUR : $asset_path n\'est pas une chaîne');
        return '';
    }
    
    return $asset_path;
}

/**
 * DEBUG : Affiche les informations de diagnostic pour un asset
 * À utiliser temporairement pour debugging
 * 
 * @param string $asset_path Chemin à analyser
 * @return void
 */
function ca_asset_debug($asset_path)
{
    echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
    echo "<strong>[CentralAdmin Debug]</strong>\n";
    echo "Chemin reçu : " . $asset_path . "\n";
    echo "Type : " . gettype($asset_path) . "\n";
    
    if (is_string($asset_path)) {
        $plugin_root = dirname(dirname(__FILE__));
        $full_path = $plugin_root . '/' . $asset_path;
        
        echo "Plugin root : " . $plugin_root . "\n";
        echo "Chemin complet : " . $full_path . "\n";
        echo "Existe ? " . (file_exists($full_path) ? 'OUI' : 'NON') . "\n";
        
        if (file_exists($full_path)) {
            echo "Taille : " . filesize($full_path) . " octets\n";
            echo "Modifié : " . date('Y-m-d H:i:s', filemtime($full_path)) . "\n";
        }
    }
    
    echo "Résultat ca_asset() : " . ca_asset($asset_path) . "\n";
    echo "</pre>";
}