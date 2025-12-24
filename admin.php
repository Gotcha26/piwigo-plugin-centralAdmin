<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

global $template, $conf, $page, $centralAdminDefault;

/* ===============================
 *  CONFIGURATION
 * =============================== */

if (!isset($centralAdminDefault) || !is_array($centralAdminDefault)) {
    die('Erreur : centralAdminDefault non défini');
}

// Fusion config enregistrée + défaut
$centralAdmin = array_replace_recursive(
    $centralAdminDefault,
    (array) ($conf['centralAdmin'] ?? [])
);

/* ===============================
 *  TRAITEMENT DU FORMULAIRE
 * =============================== */

if (isset($_POST['save'])) {

    $newConfig = array(
        'layout' => array(),
        'colors' => array(
            'tooltips' => array(),
            'clear'    => array(),
            'dark'     => array(),
        ),
    );

    // Layout
    if (!empty($_POST['layout']) && is_array($_POST['layout'])) {
        foreach ($_POST['layout'] as $key => $value) {
            $newConfig['layout'][$key] = trim($value);
        }
    }

    // Colors
    if (!empty($_POST['colors']) && is_array($_POST['colors'])) {
        foreach ($_POST['colors'] as $scheme => $colors) {
            if (is_array($colors)) {
                foreach ($colors as $key => $value) {
                    $newConfig['colors'][$scheme][$key] = trim($value);
                }
            }
        }
    }

    // Fusion finale avec les défauts
    $centralAdmin = array_replace_recursive(
        $centralAdminDefault,
        $newConfig
    );

    $conf['centralAdmin'] = $centralAdmin;
    conf_update_param('centralAdmin', $conf['centralAdmin']);

    $page['infos'][] = l10n('configuration_saved');
}

if (isset($_POST['reset'])) {
    $conf['centralAdmin'] = $centralAdminDefault;
    conf_update_param('centralAdmin', $conf['centralAdmin']);
    $centralAdmin = $centralAdminDefault;

    $page['infos'][] = l10n('configuration_reset');
}

/* ===============================
 *  GÉNÉRATION DES VARIABLES CSS
 * =============================== */

add_event_handler('loc_begin_admin_page', function () {
    global $template, $conf, $centralAdminDefault;

    // Configuration actuelle
    $centralAdmin = array_replace_recursive(
        $centralAdminDefault,
        (array) ($conf['centralAdmin'] ?? [])
    );

    // Thème actif
    $active_scheme = pwg_get_session_var('admin_theme', 'clear');
    $template->assign('ACTIVE_SCHEME', $active_scheme);

    // Variables CSS dynamiques
    $cssVars = array();

    // Layout
    foreach ($centralAdmin['layout'] as $key => $value) {
        if ($value === '') continue;
        $cssVars['--ca-layout-' . str_replace('_', '-', $key)] = (int)$value . 'px';
    }

    // Couleurs → uniquement le thème actif
    if (isset($centralAdmin['colors'][$active_scheme])) {
        foreach ($centralAdmin['colors'][$active_scheme] as $key => $value) {
            if ($value === '') continue;
            $cssVars['--ca-color-' . $active_scheme . '-' . str_replace('_', '-', $key)] = $value;
        }
    }

    $template->assign('CENTRAL_ADMIN_CSS_VARS', $cssVars);
});

/* ===============================
 *  TRANSMISSION AU TEMPLATE
 * =============================== */

$template->assign(array(
    'centralAdmin' => $centralAdmin,
    'layout'       => $centralAdmin['layout'],
    'colors'       => $centralAdmin['colors'],
));

$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__) . '/admin.tpl'
));

$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');