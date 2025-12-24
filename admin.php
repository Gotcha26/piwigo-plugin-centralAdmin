<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

global $template, $conf, $page, $centralAdminDefault;

$template->set_filename('plugin_admin_content', dirname(__FILE__).'/admin.tpl');

$template->assign('CENTRAL_ADMIN_CSS', 'plugins/centralAdmin/style.css');


/* ===============================
 *  CONFIGURATION
 * =============================== */

// Vérification des valeurs par défaut
if (!isset($centralAdminDefault) || !is_array($centralAdminDefault)) {
    die('Erreur : centralAdminDefault non défini');
}

// Fusion valeurs existantes + défaut
$centralAdmin = array_merge(
    $centralAdminDefault,
    (array) $conf['centralAdmin']
);


/* ===============================
 *  FORMULAIRE
 * =============================== */

if (isset($_POST['save'])) {
    foreach ($centralAdminDefault as $key => $default) {
        if (isset($_POST[$key])) {
            $centralAdmin[$key] = trim($_POST[$key]);
        }
    }
    $conf['centralAdmin'] = $centralAdmin;
    conf_update_param('centralAdmin', $conf['centralAdmin']);
    $page['infos'][] = l10n('configuration_saved');
}

if (isset($_POST['reset'])) {
    $conf['centralAdmin'] = $centralAdminDefault;
    conf_update_param('centralAdmin', $conf['centralAdmin']);
    $page['infos'][] = l10n('configuration_reset');
}


/* ===============================
 *  SMARTY
 * =============================== */

$template->assign('centralAdmin', $centralAdmin);

// Template admin
$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__).'/admin.tpl'
));
$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');
