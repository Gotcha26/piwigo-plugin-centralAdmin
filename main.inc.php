<?php
/*
Plugin Name: Central Admin CSS
Description: Centrage de toute l'administration sur une colonne maximum de 1600px.
             Tient compte de la couleur (clair / obscur).
             Injecte des feuilles CSS personnalisées uniquement.
Version: 1.4
Author: Gotcha
*/

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

load_language('plugin.lang', PHPWG_PLUGINS_PATH.'centralAdmin/');

global $conf, $centralAdminDefault;

/* ==================================================
 * 1) VALEURS PAR DÉFAUT
 * ================================================== */

$centralAdminDefault = array(
  'layout' => array(
    'admin_width'              => '1600',
    'menubar_width'            => '205',
    'align_pluginFilter_left'  => '225',
    'align_pluginFilter_right' => '160',
    'alignsearch_tag_left'     => '240',
    'alignsearch_tag_right'    => '15',
    'fade_start'               => '800',
  ),
  'colors' => array(
    'tooltips' => array(
      'infos_main_color'    => '#c2f5c2',
      'warning_main_color'  => '#ffdd99',
      'messages_main_color' => '#bde5f8',
      'error_main_color'    => '#ffd5dc',
    ),
    'clear' => array(
      'bg_global'   => '#707070',
      'bg_content1' => '#f8f8f8',
      'bg_content2' => '#eee',
    ),
    'dark' => array(
      'bg_global'   => '#f2f2f24d',
      'bg_content1' => '#f8f8f8',
      'bg_content2' => '#f2f2f24d',
    ),
  ),
);

/* ==================================================
 * 2) CHARGEMENT & INITIALISATION DE LA CONFIG
 * ================================================== */

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

    // CSS du plugin
    $template->append(
        'head_elements',
        '<link rel="stylesheet" href="' . get_root_url() . 'plugins/centralAdmin/style.css">'
    );

    // Schéma actif
    $scheme = pwg_get_session_var('admin_theme', 'clear');

    // CSS structure
    $template->append(
        'head_elements',
        '<link rel="stylesheet" href="' . get_root_url() . 'plugins/centralAdmin/centralAdmin-rebuild.css">'
    );

    // CSS spécifique au thème
    $template->append(
        'head_elements',
        '<link rel="stylesheet" href="' . get_root_url() . 'plugins/centralAdmin/admin-' . $scheme . '.css">'
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
