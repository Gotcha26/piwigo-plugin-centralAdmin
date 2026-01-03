<?php
/**
 * Gestion des assets (CSS/JS) avec support des versions minifiées
 * Version 3.1.1 - Correction du problème "Array to string conversion"
 * 
 * @package CentralAdmin
 * @version 3.1.1
 */

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

/**
 * Retourne le chemin d'un asset en privilégiant la version minifiée si elle existe
 * 
 * IMPORTANT : Cette fonction attend un chemin RELATIF depuis la racine du plugin
 * Exemple correct : 'assets/css/core/CA-admin-layout.css'
 * Exemple incorrect : 'plugins/centralAdmin/assets/css/...' ← Ne jamais faire ça !
 * 
 * @param string $asset_path Chemin relatif de l'asset depuis la racine du plugin
 * @return string Chemin relatif de l'asset (minifié ou normal) avec cache-buster
 */
function ca_asset($asset_path)
{
    // ============================================
    // VALIDATION STRICTE DE L'ENTRÉE
    // ============================================
    
    if (!is_string($asset_path)) {
        error_log('[CentralAdmin] ca_asset() - ERREUR CRITIQUE : $asset_path n\'est pas une chaîne, type : ' . gettype($asset_path));
        return (string)$asset_path; // Cast forcé en dernier recours
    }

    // ============================================
    // AUTO-CORRECTION DES CHEMINS INCORRECTS
    // ============================================
    
    // Si le chemin contient "plugins/centralAdmin/", c'est une erreur d'appel
    // On le corrige automatiquement pour éviter le crash
    if (strpos($asset_path, 'plugins/centralAdmin/') !== false) {
        error_log('[CentralAdmin] ca_asset() - ATTENTION : Chemin incorrect détecté : ' . $asset_path);
        error_log('[CentralAdmin] ca_asset() - ca_asset() attend SEULEMENT le chemin relatif (ex: "assets/css/core/file.css")');
        
        // Extraction de la partie après "plugins/centralAdmin/"
        $asset_path = preg_replace('#^.*?plugins/centralAdmin/#', '', $asset_path);
        error_log('[CentralAdmin] ca_asset() - Chemin auto-corrigé en : ' . $asset_path);
    }
    
    // Si le chemin commence par un slash, le retirer
    $asset_path = ltrim($asset_path, '/');
    
    // ============================================
    // CONSTRUCTION DES CHEMINS
    // ============================================
    
    // Extraire l'extension et construire le chemin minifié
    $path_info = pathinfo($asset_path);
    
    // Protection contre les chemins sans extension
    if (!isset($path_info['extension'])) {
        error_log('[CentralAdmin] ca_asset() - ERREUR : Pas d\'extension détectée dans : ' . $asset_path);
        return $asset_path;
    }
    
    $minified_path = $path_info['dirname'] . '/' . $path_info['filename'] . '.min.' . $path_info['extension'];
    
    // Chemin absolu vers la racine du plugin
    // dirname(dirname(__FILE__)) remonte de includes/ vers plugins/centralAdmin/
    $plugin_root = dirname(dirname(__FILE__));
    
    // Chemins complets pour vérification filesystem
    $full_minified_path = $plugin_root . '/' . $minified_path;
    $full_normal_path = $plugin_root . '/' . $asset_path;
    
    // ============================================
    // CHOIX DE LA VERSION (MINIFIÉE OU NORMALE)
    // ============================================
    
    $final_path = '';
    $version_used = '';
    
    if (file_exists($full_minified_path)) {
        $final_path = $minified_path;
        $version_used = 'minified';
    } elseif (file_exists($full_normal_path)) {
        $final_path = $asset_path;
        $version_used = 'normal';
    } else {
        // Aucun fichier trouvé - Log détaillé pour debugging
        error_log('[CentralAdmin] ca_asset() - ERREUR : Fichier introuvable');
        error_log('[CentralAdmin] ca_asset() - Chemin normal testé : ' . $full_normal_path);
        error_log('[CentralAdmin] ca_asset() - Chemin minifié testé : ' . $full_minified_path);
        error_log('[CentralAdmin] ca_asset() - Plugin root : ' . $plugin_root);
        
        // Retour fallback sur le chemin normal
        $final_path = $asset_path;
        $version_used = 'fallback';
    }
    
    // ============================================
    // CACHE BUSTER (VERSIONNING)
    // ============================================
    
    $cache_buster = '';
    $full_final_path = $plugin_root . '/' . $final_path;
    
    if (file_exists($full_final_path)) {
        $mtime = filemtime($full_final_path);
        $cache_buster = '?v=' . $mtime;
    }
    
    // ============================================
    // RETOUR GARANTI STRING
    // ============================================
    
    $result = $final_path . $cache_buster;
    
    // Validation finale du type de retour
    if (!is_string($result)) {
        error_log('[CentralAdmin] ca_asset() - ERREUR CRITIQUE : Le résultat n\'est pas une chaîne !');
        return (string)$result;
    }
    
    return $result;
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