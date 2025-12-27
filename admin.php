<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

global $template, $conf, $page, $user;

/* ===============================
 *  RÉCUPÉRATION VERSION PLUGIN
 * =============================== */
$plugin_version = '0'; // Valeur par défaut
$main_file = dirname(__FILE__) . '/main.inc.php';
if (file_exists($main_file)) {
    $content = file_get_contents($main_file);
    if (preg_match('/Version:\s*([\d.]+)/', $content, $matches)) {
        $plugin_version = $matches[1];
    }
}

/* ===============================
 *  DÉTECTION DU THÈME ACTUEL
 * =============================== */

// MÉTHODE CORRECTE : userprefs_get_param() au lieu de $user['theme']
$current_scheme = userprefs_get_param('admin_theme', 'clear');

// Debug : créer un tableau pour tracer la détection
$theme_debug = array(
    'plugin_version' => $plugin_version,
    'detection_method' => 'userprefs_get_param',
    'admin_theme_value' => $current_scheme,
    'is_roma' => ($current_scheme === 'roma'),
    'is_clear' => ($current_scheme === 'clear'),
    'user_theme_gallery' => isset($user['theme']) ? $user['theme'] : 'non défini',
);

// Normalisation : 'roma' = dark, 'clear' = clear
// Piwigo utilise directement 'roma' ou 'clear' comme valeurs
if ($current_scheme === 'roma') {
    $current_scheme = 'dark';
    $theme_debug['scheme_final'] = 'dark';
    $theme_debug['normalized'] = 'roma → dark';
} else {
    // Par défaut, tout ce qui n'est pas 'roma' est considéré comme 'clear'
    $current_scheme = 'clear';
    $theme_debug['scheme_final'] = 'clear';
    $theme_debug['normalized'] = $theme_debug['admin_theme_value'] . ' → clear';
}

$theme_debug['current_scheme_returned'] = $current_scheme;

// Injecter la détection combinée PHP + JS
$template->append(
    'head_elements',
    '<script>document.body.setAttribute("data-ca-theme", "' . $current_scheme . '");</script>'
);

/* ===============================
 *  RÉCUPÉRATION VERSIONS
 * =============================== */

// Version jQuery
$jquery_version = 'non détecté';
$jquery_file = PHPWG_ROOT_PATH . 'themes/default/js/ui/jquery.js';
if (file_exists($jquery_file)) {
    $jquery_content = file_get_contents($jquery_file, false, null, 0, 500);
    if (preg_match('/jQuery\s+v([\d.]+)/', $jquery_content, $matches)) {
        $jquery_version = $matches[1];
    }
}
$theme_debug['jquery_version'] = $jquery_version;

// Version Smarty
$smarty_version = 'non détecté';
$smarty_file = PHPWG_ROOT_PATH . 'include/smarty/src/Smarty.php';
if (file_exists($smarty_file)) {
    $smarty_content = file_get_contents($smarty_file, false, null, 0, 2000);
    if (preg_match('/SMARTY_VERSION\s*=\s*[\'"]([^\'\"]+)/', $smarty_content, $matches)) {
        $smarty_version = $matches[1];
    }
}
$theme_debug['smarty_version'] = $smarty_version;

/* ===============================
 *  CHARGEMENT CONFIG
 * =============================== */

// Charger les valeurs par défaut
$defaults_file = dirname(__FILE__) . '/config/defaults.php';
if (!file_exists($defaults_file)) {
    die('Erreur : config/defaults.php introuvable');
}

$centralAdminDefault = include $defaults_file;
if (!is_array($centralAdminDefault)) {
    die('Erreur : config/defaults.php ne retourne pas un tableau');
}

// Charger la configuration existante
$centralAdmin = isset($conf['centralAdmin']) && is_array($conf['centralAdmin']) 
    ? $conf['centralAdmin'] 
    : $centralAdminDefault;

// Fusionner avec les valeurs par défaut
$centralAdmin = array_replace_recursive($centralAdminDefault, $centralAdmin);

/* ===============================
 *  TRAITEMENT DU FORMULAIRE
 * =============================== */

if (isset($_POST['save'])) {
    $newConfig = $centralAdmin;
    
    // Layout (commun aux deux schémas)
    if (isset($_POST['layout']) && is_array($_POST['layout'])) {
        foreach ($_POST['layout'] as $key => $value) {
            if ($key === 'hide_quick_sync') {
                $newConfig['layout'][$key] = $value;
            } else {
                $newConfig['layout'][$key] = trim($value);
            }
        }
    }
    
    // Gestion checkbox non coché
    if (!isset($_POST['layout']['hide_quick_sync'])) {
        $newConfig['layout']['hide_quick_sync'] = '0';
    }
    
    // Colors - IMPORTANT : sauvegarder pour le schéma actif uniquement
    if (isset($_POST['colors']) && is_array($_POST['colors'])) {
        foreach ($_POST['colors'] as $scheme => $colors) {
            if (is_array($colors)) {
                foreach ($colors as $key => $value) {
                    $trimmedValue = trim($value);
                    $newConfig['colors'][$scheme][$key] = $trimmedValue;
                    
                    // Détecter si l'utilisateur a modifié la valeur par défaut
                    $defaultValue = $centralAdminDefault['colors'][$scheme][$key] ?? null;
                    if ($defaultValue && $trimmedValue !== $defaultValue) {
                        // Stocker la modification utilisateur
                        if (!isset($newConfig['user_modifications'])) {
                            $newConfig['user_modifications'] = array('clear' => array(), 'dark' => array());
                        }
                        $newConfig['user_modifications'][$scheme][$key] = $trimmedValue;
                    } else {
                        // Supprimer si revenu à la valeur par défaut
                        if (isset($newConfig['user_modifications'][$scheme][$key])) {
                            unset($newConfig['user_modifications'][$scheme][$key]);
                        }
                    }
                }
            }
        }
    }
    
    // Sauvegarder
    conf_update_param('centralAdmin', $newConfig);
    $centralAdmin = $newConfig;
    
    $page['infos'][] = l10n('configuration_saved');
    redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
}

if (isset($_POST['reset'])) {
    // Reset : restaurer les défauts mais préserver les modifications de l'autre schéma
    $newConfig = $centralAdminDefault;
    
    // Préserver les modifications de l'autre schéma
    $other_scheme = ($current_scheme === 'clear') ? 'dark' : 'clear';
    if (isset($centralAdmin['user_modifications'][$other_scheme])) {
        $newConfig['user_modifications'][$other_scheme] = $centralAdmin['user_modifications'][$other_scheme];
    }
    
    // Effacer les modifications du schéma actuel
    $newConfig['user_modifications'][$current_scheme] = array();
    
    conf_update_param('centralAdmin', $newConfig);
    $centralAdmin = $newConfig;
    
    $page['infos'][] = l10n('configuration_reset');
    redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
}

/* ===============================
 *  TRANSMISSION AU TEMPLATE
 * =============================== */

$plugin_path = get_root_url() . 'plugins/centralAdmin/';
$assets_path = $plugin_path . 'assets/';

$template->assign(array(
    // Configuration
    'centralAdmin' => $centralAdmin,
    'layout' => $centralAdmin['layout'],
    'colors' => $centralAdmin['colors'],

    // Thème actuel
    'current_scheme' => $current_scheme,

    // Appliquer les modifications utilisateur au schéma actif
    'active_scheme_colors' => array_merge(
        $centralAdminDefault['colors'][$current_scheme] ?? array(),
        $centralAdmin['colors'][$current_scheme] ?? array(),
        $centralAdmin['user_modifications'][$current_scheme] ?? array()
    ),

    // Debug thème
    'theme_debug' => $theme_debug,

    // CSS - TOUS LES CHEMINS DÉFINIS
    'CENTRAL_ADMIN_CSS' => $assets_path . 'css/style.css',
    'CENTRAL_ADMIN_REBUILD_CSS' => $assets_path . 'css/centralAdmin-rebuild.css',
    'CENTRAL_ADMIN_FORM_CSS' => $assets_path . 'css/admin-form.css',
    'CENTRAL_ADMIN_THEME_CSS' => $assets_path . 'css/admin-form-theme.css',

    // JavaScript - TOUS LES CHEMINS DÉFINIS
    'CENTRAL_ADMIN_FORM_JS' => $assets_path . 'js/admin-form.js',
    'CENTRAL_ADMIN_PREVIEW_JS' => $assets_path . 'js/admin-form-preview.js',
    'CENTRAL_ADMIN_THEME_DETECTION_JS' => $assets_path . 'js/admin-theme-detection.js',
    'CENTRAL_ADMIN_DEBUG_JS' => $assets_path . 'js/admin-debug-populate.js',

    // Templates sections
    'LAYOUT_SECTION_TPL' => dirname(__FILE__) . '/sections/layout.tpl',
    'TOOLTIPS_SECTION_TPL' => dirname(__FILE__) . '/sections/tooltips.tpl',
    'COLORS_CLEAR_SECTION_TPL' => dirname(__FILE__) . '/sections/colors_clear.tpl',
    'COLORS_DARK_SECTION_TPL' => dirname(__FILE__) . '/sections/colors_dark.tpl',
));

// Injecter la classe du thème sur body via JavaScript
$template->append(
    'head_elements',
    '<script>
    (function() {
        var scheme = "' . $current_scheme . '";
        document.addEventListener("DOMContentLoaded", function() {
            document.body.classList.add("ca-piwigo-theme-" + scheme);
            console.log("[CentralAdmin] Thème Piwigo détecté:", scheme);
            console.log("[CentralAdmin] user[theme]:", "' . (isset($user['theme']) ? $user['theme'] : 'non défini') . '");
        });
    })();
    </script>'
);

// Template
$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__).'/admin.tpl'
));

$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');