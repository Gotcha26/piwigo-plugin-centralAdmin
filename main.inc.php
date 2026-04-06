<?php
/*
Plugin Name: Central Admin
Description: Customize, group, tweak...
             Center all admin elements within a single column of up to 1600px.
             Accepts color (light/dark).
             Modules compatible to expend possibilities.
Plugin URI: http://piwigo.org/ext/extension_view.php?eid=1058
Version: 3.4.0
Author URI: https://github.com/Gotcha26/centralAdmin
Author: Gotcha
Has Settings: webmaster
*/

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

/* ==================================================
 * CHARGEMENT LANGUE PAR DEFAUT (en_UK)
 * Surcharge à appliquer dans admin.php juste AVANT
 * la transmission au template !
 * ================================================== */

$plugin_dir = PHPWG_PLUGINS_PATH.'centralAdmin/';

load_language('plugin.lang', $plugin_dir, array('language' => 'en_UK', 'no_fallback' => true));

/* ==================================================
 * SUITE
 * ================================================== */

include_once dirname(__FILE__) . '/includes/functions-assets.php';

add_event_handler('init', 'central_admin_init');

/* ==================================================
 * CHARGEMENT & INITIALISATION DE LA CONFIG
 * ================================================== */

function central_admin_init()
{
    global $conf, $user;

    // Chargement des classes
    require_once(__DIR__ . '/includes/class.config-manager.php');
    require_once(__DIR__ . '/includes/class.css-generator.php');
    require_once(__DIR__ . '/includes/class.theme-detector.php');

    // Initialisation config manager
    $configManager = new CA_ConfigManager();
    $config = $configManager->getCurrent();

    // Sauvegarder dans $conf pour accès global
    $conf['centralAdmin'] = $config;
}

/* ==================================================
 * MENU ADMIN
 * ================================================== */

// Hook menubar — silencieux si le core ne le supporte pas encore
add_event_handler('admin_menubar_plugin_links', 'centralAdmin_menubar_link');

function centralAdmin_menubar_link($items)
{
    $items[] = array(
        'ID'   => 'central_admin',
        'NAME' => 'Central Admin',
        'URL'  => get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'),
        'ICON' => 'icon-cog',
    );
    return $items;
}

// Fallback pour anciennes versions Piwigo
add_event_handler('get_admin_plugin_menu_links', function ($menu) {
    $menu[] = array(
        'NAME' => 'Central Admin',
        'URL'  => get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php')
    );
    return $menu;
});

/* ==================================================
 * CHARGEMENT DES MODULES
 * ================================================== */

// Module Meta OG - Hooks frontend (injection des balises meta)
$metaog_hooks = dirname(__FILE__) . '/modules/metaog/metaog-hooks.php';
if (file_exists($metaog_hooks)) {
    include_once($metaog_hooks);
}

// Module Skyline - Interception AJAX précoce (avant tout rendu HTML)
if (defined('IN_ADMIN') && isset($_GET['skyline_action'])) {
    $skyline_ajax = dirname(__FILE__) . '/modules/skyline/skyline-ajax.php';
    if (file_exists($skyline_ajax)) {
        include($skyline_ajax);
    }
    exit; // skyline-ajax.php appelle exit, mais double protection
}

// Module Skyline - Hooks frontend (injection des bannieres)
$skyline_hooks = dirname(__FILE__) . '/modules/skyline/skyline-hooks.php';
if (file_exists($skyline_hooks)) {
    include_once($skyline_hooks);
}

/* ==================================================
 * INJECTION DU CSS (ADMIN) - TOUTE L'ADMINISTRATION
 * ================================================== */

add_event_handler('loc_begin_admin_page', function () {
    global $conf, $template;

    if (empty($conf['centralAdmin']) || !is_array($conf['centralAdmin'])) {
        return;
    }

    // Instanciation des classes
    $cssGenerator = new CA_CSSGenerator();
    $themeDetector = new CA_ThemeDetector();

    // Récupérer le schéma actif
    $scheme = $themeDetector->getTheme();

    // === INJECTION DU THÈME (CRITIQUE POUR CSS) ===
    $themeDetector->injectThemeAttribute($template);

    // URL de base du plugin
    $plugin_url = get_root_url() . 'plugins/centralAdmin/';
    
    // === 1. VARIABLES CSS DYNAMIQUES (EN PREMIER) ===
    $dynamicCSS = $cssGenerator->generate($conf['centralAdmin'], $scheme);
    
    // Injection DIRECTE dans head_elements
    $template->append('head_elements', 
        '<style id="central-admin-vars">' . $dynamicCSS . '</style>'
    );
    
    // === 2. CSS CORE (APRÈS les variables) ===    
    $override_css_path = ca_asset('assets/css/core/CA-admin-override.css');
    $template->append('head_elements',
        '<link rel="stylesheet" href="' . $plugin_url . $override_css_path . '" id="ca-admin-override">'
    );

    // === 3. CSS PERSONNALISÉ UTILISATEUR ===
    if (!empty($conf['centralAdmin']['custom_css']['code'])) {
        $template->append('head_elements',
            '<style id="ca-custom-css">' . 
            $conf['centralAdmin']['custom_css']['code'] . 
            '</style>'
        );
    }

    // === 4. INJECTION ATTRIBUT THÈME ===
    $themeDetector->injectThemeAttribute($template);
});