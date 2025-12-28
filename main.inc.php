<?php
/*
Plugin Name: Central Admin CSS
Description: Centrage de toute l'administration sur une colonne maximum de 1600px.
             Tient compte de la couleur (clair / obscur).
             Injecte des feuilles CSS personnalisées uniquement.
Version: 2.8.3
Author URI: https://github.com/Gotcha26/centralAdmin
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

function central_admin_generate_css_vars(array $config, $current_scheme = 'clear')
{
    $css = '';

    // Layout + button
    if (isset($config['layout'])) {
        foreach ($config['layout'] as $key => $value) {
            // Traitement spécial pour hide_quick_sync
            if ($key === 'hide_quick_sync') {
                $displayValue = ($value === '1') ? 'none' : 'block';
                $css .= '--ca-layout-hide-quick-sync: ' . $displayValue . ";\n";
                continue;
            }
            
            $css .= '--ca-layout-' . str_replace('_', '-', $key) . ': ' . (int)$value . "px;\n";
        }
    }

    // Couleurs globales (tooltips)
    if (isset($config['colors']['tooltips'])) {
        foreach ($config['colors']['tooltips'] as $key => $value) {
            $css .= '--ca-color-' . str_replace('_', '-', $key) . ': ' . $value . ";\n";
        }
    }

    // Couleurs selon le schéma actif + modifications utilisateur
    if (isset($config['colors'][$current_scheme])) {
        $scheme_colors = $config['colors'][$current_scheme];
        
        // Fusionner avec les modifications utilisateur
        if (isset($config['user_modifications'][$current_scheme])) {
            $scheme_colors = array_merge(
                $scheme_colors,
                $config['user_modifications'][$current_scheme]
            );
        }
        
        foreach ($scheme_colors as $key => $value) {
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

    // Schéma actif avec normalisation (MÊME MÉTHODE que admin.php)
    $scheme = userprefs_get_param('admin_theme', 'clear');
    $scheme = ($scheme === 'roma') ? 'dark' : 'clear';

    error_log('[CentralAdmin] loc_begin_admin_page - Schéma détecté: ' . $scheme);
    error_log('[CentralAdmin] userprefs admin_theme brut: ' . userprefs_get_param('admin_theme', 'clear'));
    
    // CHEMINS
    $assets_path = get_root_url() . 'plugins/centralAdmin/assets/';

    // CSS structure
    $template->append(
        'head_elements',
        '<link rel="stylesheet" href="' . $assets_path . 'css/centralAdmin-rebuild.css">'
    );

    // Variables CSS dynamiques AVEC modifications utilisateur
    $css  = ":root {\n";
    $css .= central_admin_generate_css_vars($conf['centralAdmin'], $scheme);
    $css .= "}\n";

    $template->append(
        'head_elements',
        '<style id="central-admin-vars">' . $css . '</style>'
    );
});