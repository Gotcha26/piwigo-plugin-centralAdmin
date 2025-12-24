<?php
/*
Plugin Name: Central Admin CSS
Description: Centrage de toute l'administratin sur une colonne maximun de 1600px de largeur.
Tient compte de la couleur (clair / obscure).
Corrections mineurs de divers éléments.
Injecte des feuilles CSS personnalisées uniquement !
Version: 1.1
Author: Gotcha
*/

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

load_language('plugin.lang', PHPWG_PLUGINS_PATH.'centralAdmin/');

global $conf, $centralAdminDefault;


// -----------------------------
// 1) Initialisation de la config
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
    global $centralAdminDefault;
    $conf['centralAdmin'] = $centralAdminDefault;
    conf_update_param('centralAdmin', $conf['centralAdmin']);
}


// -----------------------------
// 2) Menu admin
// -----------------------------

add_event_handler('get_admin_plugin_menu_links', 'central_admin_menu');

function central_admin_menu($menu)
{
    if (!is_array($menu)) {
        $menu = array();
    }

    $menu[] = array(
      'NAME' => 'Central Admin – Clear',
      'URL'  => get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php').'&scheme=clear'
    );

    $menu[] = array(
      'NAME' => 'Central Admin – Dark',
      'URL'  => get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php').'&scheme=dark'
    );

    return $menu;
}


// -----------------------------
// 3) CSS dynamique
// -----------------------------

add_event_handler('loc_end_admin_page_header', 'central_admin_inject_css_safe');

function central_admin_inject_css_safe()
{
    global $template, $themeconf, $conf, $page;

    // Ne rien faire si $page n'est pas défini (évite FCKEditor)
    if (!isset($page) || !is_array($page)) {
        error_log('CENTRALADMIN DEBUG — page non défini, CSS ignoré pour éviter crash FCKEditor');
        return;
    }

    // Schéma couleur actif
    $colorscheme = (
        isset($themeconf['colorscheme']) &&
        in_array($themeconf['colorscheme'], ['clear', 'dark'], true)
    ) ? $themeconf['colorscheme'] : 'clear';

    // CSS global admin (centrage, layout, etc.)
    $template->append(
        'head_elements',
        '<link rel="stylesheet" href="plugins/centralAdmin/admin/css/admin-'.$colorscheme.'.css">'
    );

    // Variables CSS dynamiques
    if (empty($conf['centralAdmin']) || !is_array($conf['centralAdmin'])) {
        return;
    }

    $css  = ":root {\n";
    $css .= central_admin_css_vars($conf['centralAdmin']);
    $css .= "}\n";

    $template->append(
        'head_elements',
        '<style id="central-admin-vars">'.$css.'</style>'
    );

    error_log('CENTRALADMIN DEBUG — CSS injecté pour ' . $page['section'] ?? 'NULL');
}
