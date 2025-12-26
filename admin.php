<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

global $template, $conf, $page, $user;

/* ===============================
 *  DÉTECTION DU SCHÉMA ACTUEL
 * =============================== */

// Récupérer le thème admin actif
$current_scheme = 'clear'; // Valeur par défaut

// Debug : créer un tableau pour tracer la détection
$theme_debug = array(
    'session_pwg_admin_theme' => isset($_SESSION['pwg_admin_theme']) ? $_SESSION['pwg_admin_theme'] : 'non défini',
    'pwg_get_session_var' => function_exists('pwg_get_session_var') ? pwg_get_session_var('admin_theme', 'non défini') : 'fonction non disponible',
    'user_theme' => isset($user['theme']) ? $user['theme'] : 'non défini',
    'user_admin_theme' => isset($user['admin_theme']) ? $user['admin_theme'] : 'non défini',
);

// Méthode 1 : Via la session Piwigo (le plus fiable)
if (isset($_SESSION['pwg_admin_theme'])) {
    $current_scheme = $_SESSION['pwg_admin_theme'];
    $theme_debug['methode_utilisee'] = 'SESSION pwg_admin_theme';
}
// Méthode 2 : Via pwg_get_session_var
elseif (function_exists('pwg_get_session_var')) {
    $temp = pwg_get_session_var('admin_theme', null);
    if ($temp !== null && $temp !== 'non défini') {
        $current_scheme = $temp;
        $theme_debug['methode_utilisee'] = 'pwg_get_session_var';
    }
}
// Méthode 3 : Via les préférences utilisateur
elseif (isset($user['admin_theme'])) {
    $current_scheme = $user['admin_theme'];
    $theme_debug['methode_utilisee'] = 'user admin_theme';
}
else {
    $theme_debug['methode_utilisee'] = 'défaut (clear)';
}

// S'assurer que la valeur est soit 'clear' soit 'dark'
if (!in_array($current_scheme, array('clear', 'dark'))) {
    $current_scheme = 'clear';
}

$theme_debug['theme_final'] = $current_scheme;

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
    
    // Layout
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
    
    // Colors
    if (isset($_POST['colors']) && is_array($_POST['colors'])) {
        foreach ($_POST['colors'] as $scheme => $colors) {
            if (is_array($colors)) {
                foreach ($colors as $key => $value) {
                    $newConfig['colors'][$scheme][$key] = trim($value);
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
    conf_update_param('centralAdmin', $centralAdminDefault);
    $centralAdmin = $centralAdminDefault;
    
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
        });
    })();
    </script>'
);

// Template
$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__).'/admin.tpl'
));

$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');