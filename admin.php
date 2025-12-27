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

// Le thème admin est stocké dans $user['theme']
// Valeurs possibles : 'clear' (clair) ou 'roma' (sombre)
$current_scheme = 'clear'; // Valeur par défaut

// Debug : créer un tableau pour tracer la détection
$theme_debug = array(
    'user_theme' => isset($user['theme']) ? $user['theme'] : 'non défini',
    'plugin_version' => $plugin_version,
);

// MÉTHODE CORRECTE selon votre confrère
if (isset($user['theme'])) {
    $admin_theme = $user['theme'];
    $theme_debug['admin_theme_brut'] = $admin_theme;
    
    // Déterminer si c'est un thème dark ou clear
    // 'roma' = dark, 'clear' = clear
    // Pour les thèmes personnalisés, on regarde s'ils contiennent 'dark' ou 'roma'
    if ($admin_theme === 'roma' || 
        stripos($admin_theme, 'dark') !== false || 
        stripos($admin_theme, 'roma') !== false) {
        $current_scheme = 'dark';
        $theme_debug['methode_utilisee'] = 'user[theme] = roma';
    } else {
        $current_scheme = 'clear';
        $theme_debug['methode_utilisee'] = 'user[theme] = clear';
    }
} else {
    $theme_debug['methode_utilisee'] = 'default (clear) - user[theme] undefined';
}

$theme_debug['theme_final'] = $current_scheme;

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