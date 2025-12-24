<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

global $template, $conf, $page, $centralAdminDefault;

// Charger le CSS du formulaire
$template->assign('CENTRAL_ADMIN_CSS', 'plugins/centralAdmin/style.css');

/* ===============================
 *  CONFIGURATION
 * =============================== */

// Vérification des valeurs par défaut
if (!isset($centralAdminDefault) || !is_array($centralAdminDefault)) {
    die('Erreur : centralAdminDefault non défini');
}

// Fusion valeurs existantes + défaut (en cas de nouvelles options)
$centralAdmin = array_replace_recursive(
    $centralAdminDefault,
    (array) $conf['centralAdmin']
);

/* ===============================
 *  TRAITEMENT DU FORMULAIRE
 * =============================== */

if (isset($_POST['save'])) {
    // Reconstruction de la structure complète
    $newConfig = array(
        'layout' => array(),
        'colors' => array(
            'tooltips' => array(),
            'clear' => array(),
            'dark' => array()
        )
    );
    
    // Récupération des valeurs layout
    if (isset($_POST['layout']) && is_array($_POST['layout'])) {
        foreach ($_POST['layout'] as $key => $value) {
            $newConfig['layout'][$key] = trim($value);
        }
    }
    
    // Récupération des valeurs colors
    if (isset($_POST['colors']) && is_array($_POST['colors'])) {
        foreach ($_POST['colors'] as $scheme => $colors) {
            if (is_array($colors)) {
                foreach ($colors as $key => $value) {
                    $newConfig['colors'][$scheme][$key] = trim($value);
                }
            }
        }
    }
    
    // Mise à jour de la configuration
    $conf['centralAdmin'] = array_replace_recursive(
        $centralAdminDefault,
        $newConfig
    );
    
    $page['infos'][] = l10n('configuration_saved');
}

if (isset($_POST['reset'])) {
    $conf['centralAdmin'] = $centralAdminDefault;
    conf_update_param('centralAdmin', $conf['centralAdmin']);
    $centralAdmin = $centralAdminDefault;
    
    $page['infos'][] = l10n('configuration_reset');
}

/* ===============================
 *  TRANSMISSION AU TEMPLATE
 * =============================== */

// Transmettre la structure complète ET les sous-tableaux pour faciliter l'accès
$template->assign(array(
    'centralAdmin' => $centralAdmin,
    'layout' => $centralAdmin['layout'],
    'colors' => $centralAdmin['colors'],
));

// Template admin
$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__).'/admin.tpl'
));

$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');