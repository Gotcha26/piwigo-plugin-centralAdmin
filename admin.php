<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

global $template, $conf, $page, $centralAdminDefault;

/* ===============================
 *  DÉTECTION DU SCHÉMA ACTUEL
 * =============================== */

// Récupérer le schéma de couleur actif (clear ou dark)
$current_scheme = pwg_get_session_var('admin_theme', 'clear');

/* ===============================
 *  CONFIGURATION
 * =============================== */

// Vérification des valeurs par défaut
if (!isset($centralAdminDefault) || !is_array($centralAdminDefault)) {
    die('Erreur : centralAdminDefault non défini dans main.inc.php');
}

// Fusion valeurs existantes + défaut (en cas de nouvelles options)
$centralAdmin = array_replace_recursive(
    $centralAdminDefault,
    isset($conf['centralAdmin']) ? (array) $conf['centralAdmin'] : array()
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
    
    // Mise à jour de la configuration globale
    $conf['centralAdmin'] = $newConfig;
    conf_update_param('centralAdmin', $conf['centralAdmin']);
    
    // Mettre à jour la variable locale pour affichage immédiat
    $centralAdmin = $newConfig;
    
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

// Transmettre TOUT ce dont le template a besoin
$template->assign(array(
    // Configuration complète
    'centralAdmin' => $centralAdmin,
    
    // Raccourcis pour faciliter l'accès dans le template
    'layout' => $centralAdmin['layout'],
    'colors' => $centralAdmin['colors'],
    
    // Schéma de couleur actuel (CRITIQUE pour afficher les bons champs)
    'current_scheme' => $current_scheme,
    
    // CSS du formulaire
    'CENTRAL_ADMIN_CSS' => get_root_url() . 'plugins/centralAdmin/style.css',
));

// Template admin
$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__).'/admin.tpl'
));

$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');