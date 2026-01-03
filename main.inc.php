<?php
/*
Plugin Name: Central Admin CSS
Description: Centrage de toute l'administration sur une colonne maximum de 1600px.
             Tient compte de la couleur (clair / obscur).
             Injecte des feuilles CSS personnalisées uniquement.
Version: 3.1.0
Author URI: https://github.com/Gotcha26/centralAdmin
Author: Gotcha
Has Settings: webmaster
*/

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

include_once dirname(__FILE__) . '/includes/functions-assets.php';

add_event_handler('init', 'central_admin_init');

/* ==================================================
 * CHARGEMENT & INITIALISATION DE LA CONFIG
 * ================================================== */

function central_admin_init()
{
    global $conf;

    // Langue
    load_language('plugin.lang', PHPWG_PLUGINS_PATH.'centralAdmin/');

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

add_event_handler('get_admin_plugin_menu_links', function ($menu) {
    $menu[] = array(
        'NAME' => 'Central Admin',
        'URL'  => get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php')
    );
    return $menu;
});

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

    // URL de base du plugin
    $plugin_url = get_root_url() . 'plugins/centralAdmin/';
    
    // === 1. VARIABLES CSS DYNAMIQUES (EN PREMIER) ===
    $dynamicCSS = $cssGenerator->generate($conf['centralAdmin'], $scheme);
    
    // Injection DIRECTE dans head_elements
    $template->append('head_elements', 
        '<style id="central-admin-vars">' . $dynamicCSS . '</style>'
    );
    
    // === 2. CSS CORE (APRÈS les variables) ===    
    $layout_css_path = ca_asset('assets/css/core/CA-admin-layout.css');
    $template->append('head_elements',
        '<link rel="stylesheet" href="' . $plugin_url . $layout_css_path . '" id="ca-admin-layout">'
    );
    
    $override_css_path = ca_asset('assets/css/core/CA-admin-override.css');
    $template->append('head_elements',
        '<link rel="stylesheet" href="' . $plugin_url . $override_css_path . '" id="ca-admin-override">'
    );

    // === 3. INJECTION ATTRIBUT THÈME ===
    $themeDetector->injectThemeAttribute($template);
});