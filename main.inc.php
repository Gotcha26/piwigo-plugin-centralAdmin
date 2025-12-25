<?php
/*
Plugin Name: Central Admin CSS
Description: Centrage de toute l'administration sur une colonne maximum de 1600px.
             Tient compte de la couleur (clair / obscur).
             Injecte des feuilles CSS personnalisées uniquement.
Version: 1.1
Author: Gotcha
Has Settings: webmaster
*/

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

add_event_handler('init', 'central_admin_init');

/* ==================================================
 * 2) CHARGEMENT & INITIALISATION DE LA CONFIG
 * ================================================== */

function central_admin_init()
{
    global $conf, $centralAdminDefault;

    // Langue
    load_language('plugin.lang', PHPWG_PLUGINS_PATH.'centralAdmin/');

    // Valeurs par défaut
    $defaults_file = __DIR__ . '/config/defaults.php';

    if (!file_exists($defaults_file)) {
        trigger_error(
            'CentralAdmin: defaults.php introuvable (' . $defaults_file . ')',
            E_USER_WARNING
        );
        return;
    }

    $centralAdminDefault = include $defaults_file;

    if (!is_array($centralAdminDefault)) {
        trigger_error(
            'CentralAdmin: defaults.php ne retourne pas un tableau',
            E_USER_WARNING
        );
        return;
    }

    // Désérialisation propre si existante
    if (isset($conf['centralAdmin'])) {
        $conf['centralAdmin'] = safe_unserialize($conf['centralAdmin']);
    }

    // Initialisation UNIQUEMENT si absente ou invalide
    if (empty($conf['centralAdmin']) || !is_array($conf['centralAdmin'])) {
        $conf['centralAdmin'] = $centralAdminDefault;
        conf_update_param('centralAdmin', $conf['centralAdmin']);
    }

    // Fusion défensive avec les valeurs par défaut
    $conf['centralAdmin'] = array_replace_recursive(
        $centralAdminDefault,
        $conf['centralAdmin']
    );
}

/* ==================================================
 * 3) GÉNÉRATION DES VARIABLES CSS
 * ================================================== */

function central_admin_generate_css_vars(array $config)
{
    $css = '';

    // Layout
    if (isset($config['layout'])) {
        foreach ($config['layout'] as $key => $value) {
            $css .= '--ca-layout-' . str_replace('_', '-', $key) . ': ' . (int)$value . "px;\n";
        }
    }

    // Couleurs globales (tooltips)
    if (isset($config['colors']['tooltips'])) {
        foreach ($config['colors']['tooltips'] as $key => $value) {
            $css .= '--ca-color-' . str_replace('_', '-', $key) . ': ' . $value . ";\n";
        }
    }

    // Couleurs selon le schéma actif
    $scheme = pwg_get_session_var('admin_theme', 'clear');
    
    if (isset($config['colors'][$scheme])) {
        foreach ($config['colors'][$scheme] as $key => $value) {
            $css .= '--ca-color-' . str_replace('_', '-', $key) . ': ' . $value . ";\n";
        }
    }

    return $css;
}

/* ==================================================
 * 4) MENU ADMIN
 * ================================================== */

add_event_handler('get_admin_plugin_menu_links', function ($menu) {
    $menu[] = array(
        'NAME' => 'Central Admin',
        'URL'  => get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php')
    );
    return $menu;
});

/* ==================================================
 * 5) INJECTION DU CSS (ADMIN)
 * ================================================== */

add_event_handler('loc_begin_admin_page', function () {
    global $conf, $template;

    if (empty($conf['centralAdmin']) || !is_array($conf['centralAdmin'])) {
        return;
    }

    // Schéma actif
    $scheme = pwg_get_session_var('admin_theme', 'clear');

    // CSS du plugin
    $template->append(
        'head_elements',
        '<link rel="stylesheet" href="' . get_root_url() . 'plugins/centralAdmin/style.css">'
    );

    // CSS structure
    $template->append(
        'head_elements',
        '<link rel="stylesheet" href="' . get_root_url() . 'plugins/centralAdmin/centralAdmin-rebuild.css">'
    );

    // Variables CSS dynamiques
    $css  = ":root {\n";
    $css .= central_admin_generate_css_vars($conf['centralAdmin']);
    $css .= "}\n";

    $template->append(
        'head_elements',
        '<style id="central-admin-vars">' . $css . '</style>'
    );
});
