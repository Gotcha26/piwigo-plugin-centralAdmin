<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

global $template, $conf, $page, $centralAdminDefault;

/* ===============================
 *  DÉTECTION DU SCHÉMA ACTUEL
 * =============================== */

// Récupérer le thème admin actif
// Piwigo stocke cette info dans la session
$current_scheme = 'clear'; // Valeur par défaut

// Méthode 1 : Via la session Piwigo
if (isset($_SESSION['pwg_admin_theme'])) {
    $current_scheme = $_SESSION['pwg_admin_theme'];
}
// Méthode 2 : Via pwg_get_session_var (fonction Piwigo)
elseif (function_exists('pwg_get_session_var')) {
    $current_scheme = pwg_get_session_var('admin_theme', 'clear');
}
// Méthode 3 : Via les préférences utilisateur
elseif (isset($user['admin_theme'])) {
    $current_scheme = $user['admin_theme'];
}

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
            // Traitement spécial pour le checkbox
            if ($key === 'hide_quick_sync') {
                $newConfig['layout'][$key] = $value;
            } else {
                $newConfig['layout'][$key] = trim($value);
            }
        }
    }
    
    // Gestion du checkbox non coché (non envoyé)
    if (!isset($_POST['layout']['hide_quick_sync'])) {
        $newConfig['layout']['hide_quick_sync'] = '0';
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

$plugin_path = get_root_url() . 'plugins/centralAdmin/';
$assets_path = $plugin_path . 'assets/';

// Transmettre TOUT ce dont le template a besoin
$template->assign(array(
    // Configuration complète
    'centralAdmin' => $centralAdmin,
    
    // Raccourcis
    'layout' => $centralAdmin['layout'],
    'colors' => $centralAdmin['colors'],
    'current_scheme' => $current_scheme,
    
    // CSS - CHEMINS MIS À JOUR
    'CENTRAL_ADMIN_CSS' => $assets_path . 'css/sandbox.css',
    'CENTRAL_ADMIN_FORM_CSS' => $assets_path . 'css/admin-form.css',
    'CENTRAL_ADMIN_THEME_CSS' => $assets_path . 'css/admin-form-theme.css',
    
    // JavaScript - CHEMINS MIS À JOUR
    'CENTRAL_ADMIN_JS' => $assets_path . 'js/admin-form.js',
    'CENTRAL_ADMIN_PREVIEW_JS' => $assets_path . 'js/admin-form-preview.js',
    
    // Sections templates (chemins inchangés)
    'LAYOUT_SECTION_TPL' => dirname(__FILE__) . '/sections/layout.tpl',
    'TOOLTIPS_SECTION_TPL' => dirname(__FILE__) . '/sections/tooltips.tpl',
    'COLORS_CLEAR_SECTION_TPL' => dirname(__FILE__) . '/sections/colors_clear.tpl',
    'COLORS_DARK_SECTION_TPL' => dirname(__FILE__) . '/sections/colors_dark.tpl',
));

// Injecter une classe sur le body pour le thème
$template->append(
    'head_elements',
    '<script>document.addEventListener("DOMContentLoaded", function() {
        document.body.classList.add("ca-admin-theme-' . $current_scheme . '");
    });</script>'
);

// Template admin
$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__).'/admin.tpl'
));

$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');