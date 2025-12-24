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

// Charger la configuration existante ou valeurs par défaut
if (isset($conf['centralAdmin']) && is_array($conf['centralAdmin'])) {
    $centralAdmin = $conf['centralAdmin'];
} else {
    $centralAdmin = $centralAdminDefault;
}

// Fusionner avec les valeurs par défaut pour garantir toutes les clés
$centralAdmin = array_replace_recursive(
    $centralAdminDefault,
    $centralAdmin
);

/* ===============================
 *  TRAITEMENT DU FORMULAIRE
 * =============================== */

if (isset($_POST['save'])) {
    // IMPORTANT : On part de la configuration ACTUELLE
    // et on met à jour UNIQUEMENT les valeurs envoyées
    $newConfig = $centralAdmin;
    
    // Mise à jour des valeurs layout envoyées
    if (isset($_POST['layout']) && is_array($_POST['layout'])) {
        foreach ($_POST['layout'] as $key => $value) {
            $newConfig['layout'][$key] = trim($value);
        }
    }
    
    // Mise à jour des valeurs colors envoyées
    if (isset($_POST['colors']) && is_array($_POST['colors'])) {
        foreach ($_POST['colors'] as $scheme => $colors) {
            if (is_array($colors)) {
                foreach ($colors as $key => $value) {
                    $newConfig['colors'][$scheme][$key] = trim($value);
                }
            }
        }
    }
    
    // Sauvegarde dans la base de données
    $conf['centralAdmin'] = $newConfig;
    conf_update_param('centralAdmin', $newConfig);
    
    // Mettre à jour la variable locale pour affichage immédiat
    $centralAdmin = $newConfig;
    
    $page['infos'][] = l10n('configuration_saved');
    
    // CRITIQUE : Recharger la page pour que les nouvelles variables CSS soient générées
    redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
}

if (isset($_POST['reset'])) {
    $conf['centralAdmin'] = $centralAdminDefault;
    conf_update_param('centralAdmin', $centralAdminDefault);
    $centralAdmin = $centralAdminDefault;
    
    $page['infos'][] = l10n('configuration_reset');
    
    // CRITIQUE : Recharger la page
    redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
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