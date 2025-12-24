<?php
/*
Plugin Name: Central Admin CSS
Description: Centrage de toute l'administratin sur une colonne maximun de 1600px de largeur.
Tient compte de la couleur (clair / obscure).
Corrections mineurs de divers éléments.
Injecte des feuilles CSS personnalisées uniquement !
Version: 1.3
Author: Gotcha
*/

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

load_language('plugin.lang', PHPWG_PLUGINS_PATH.'centralAdmin/');

global $conf, $centralAdminDefault;


// -----------------------------
// 1) Fonction de génération CSS
// -----------------------------

function central_admin_generate_css_vars(array $config)
{
    $css = '';

    // Layout
    foreach ($config['layout'] as $key => $value) {
        $css .= "--ca-layout-" . str_replace('_', '-', $key) . ": {$value}px;\n";
    }

    // Colors - Tooltips (sans préfixe de schéma)
    if (isset($config['colors']['tooltips'])) {
        foreach ($config['colors']['tooltips'] as $key => $value) {
            $css .= "--ca-color-" . str_replace('_', '-', $key) . ": {$value};\n";
        }
    }

    // Colors - par schéma (clear/dark)
    foreach (['clear', 'dark'] as $scheme) {
        if (isset($config['colors'][$scheme])) {
            foreach ($config['colors'][$scheme] as $key => $value) {
                $css .= "--ca-" . str_replace('_', '-', $key) . ": {$value};\n";
            }
        }
    }

    return $css;
}


// -----------------------------
// 2) Initialisation de la config
// -----------------------------

// Valeurs par défaut du plugin
$centralAdminDefault = array(
  'layout' => array(
    'admin_width'              => '1600',
    'admin_sidebar'            => '225',
    'align_pluginFilter_left'  => '225',
    'align_pluginFilter_right' => '160',
    'alignsearch_tag_left'     => '240',
    'alignsearch_tag_right'    => '15',
    'footer_width'             => '205',
    'fade_start'               => '800',
  ),
  'colors' => array(
    'tooltips' => array (
      'infos_main_color'        => '#c2f5c2',
      'warning_main_color'      => '#ffdd99',
      'messages_main_color'     => '#bde5f8',
      'error_main_color'        => '#ffd5dc',
    ),
    'clear' => array(
      'bg_global'           => '#707070',
      'bg_content1'         => '#f8f8f8',
      'bg_content2'         => '#eee',
    ),
    'dark' => array(
      'bg_global'           => '#f2f2f24d',
      'bg_content1'         => '#f8f8f8',
      'bg_content2'         => '#f2f2f24d',
    ),
  ),
);


// Initialisation si absente ou vide
if (!isset($conf['centralAdmin']) || !is_array($conf['centralAdmin'])) {
    $conf['centralAdmin'] = $centralAdminDefault;
    conf_update_param('centralAdmin', $conf['centralAdmin']);
}


// -----------------------------
// 3) Menu admin
// -----------------------------

add_event_handler('get_admin_plugin_menu_links', 'central_admin_menu');

function central_admin_menu($menu)
{
    if (!is_array($menu)) {
        $menu = array();
    }

    $menu[] = array(
      'NAME' => 'Central Admin',
      'URL'  => get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php')
    );

    return $menu;
}


// -----------------------------
// 4) Injection des fichiers CSS
// -----------------------------

add_event_handler('loc_begin_admin_page', function () {
    global $conf, $template;

    if (empty($conf['centralAdmin'])) {
        return;
    }

    // Détecter le schéma de couleur
    $scheme = pwg_get_session_var('admin_theme', 'clear');
    
    // Charger CSS commun
    $template->append(
        'head_elements',
        '<link rel="stylesheet" type="text/css" href="'
        . get_root_url() . 'plugins/centralAdmin/admin-common.css'
        . '">'
    );
    
    // Charger CSS spécifique au schéma
    $template->append(
        'head_elements',
        '<link rel="stylesheet" type="text/css" href="'
        . get_root_url() . 'plugins/centralAdmin/admin-' . $scheme . '.css'
        . '">'
    );
});


// -----------------------------
// 5) Variables CSS dynamiques
// -----------------------------

add_event_handler('loc_begin_admin_page', function () {
    global $conf, $template;

    if (empty($conf['centralAdmin'])) {
        return;
    }

    $css  = ":root {\n";
    $css .= central_admin_generate_css_vars($conf['centralAdmin']);
    $css .= "}\n";

    $template->append(
        'head_elements',
        '<style id="central-admin-vars">' . $css . '</style>'
    );
});