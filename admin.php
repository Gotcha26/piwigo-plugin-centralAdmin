<?php
/**
 * CentralAdmin - Contrôleur Principal
 * 
 * Version 3.0 - Architecture refactorée
 * 
 * @package CentralAdmin
 * @version 3.0.0
 * @author Gotcha
 */

defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

include_once(PHPWG_ROOT_PATH.'admin/include/tabsheet.class.php');
include_once dirname(__FILE__) . '/includes/functions-assets.php';

global $template, $conf, $page, $user;

// ====================================
// CHARGEMENT DES CLASSES
// ====================================

require_once(dirname(__FILE__) . '/includes/class.config-manager.php');
require_once(dirname(__FILE__) . '/includes/class.css-generator.php');
require_once(dirname(__FILE__) . '/includes/class.theme-detector.php');

// ====================================
// INITIALISATION
// ====================================

// Forcer le chargement de jQuery et dépendances
add_event_handler('loc_begin_page_header', function() {
    global $template;
    
    // jQuery (base)
    $template->scriptLoader->add('jquery', 
        'themes/default/js/jquery.min.js', 
        array(), 0, false);
    
    // jQuery Confirm (pour les modales)
    $template->scriptLoader->add('jquery-confirm', 
        'themes/default/js/plugins/jquery-confirm.min.js', 
        array('jquery'), 10, false);
    
    // CSS jQuery Confirm - Injection directe (pas de cssLoader)
    $template->append('head_elements', 
        '<link rel="stylesheet" href="themes/default/js/plugins/jquery-confirm.min.css">'
    );
        
    // Fallback nécessaire pour jquery-confirm
    $template->append('head_elements', '
    <link rel="stylesheet" href="themes/default/js/plugins/jquery-confirm.min.css">
    <script src="themes/default/js/plugins/jquery-confirm.min.js"></script>
    ');
});

// ====================================
// RÉCUPÉRATION VERSION PLUGIN
// ====================================

$plugin_version = '3.0.0'; // Valeur par défaut
$main_file = dirname(__FILE__) . '/main.inc.php';
if (file_exists($main_file)) {
    $content = file_get_contents($main_file);
    if (preg_match('/Version:\s*([\d.]+)/', $content, $matches)) {
        $plugin_version = $matches[1];
    }
}

// ====================================
// INSTANCIATION DES CLASSES
// ====================================

$configManager = new CA_ConfigManager();
$cssGenerator = new CA_CSSGenerator();
$themeDetector = new CA_ThemeDetector();

// Récupérer la configuration et le thème
$centralAdmin = $configManager->getCurrent();
$current_scheme = $themeDetector->getTheme();

// ====================================
// GESTION DES ONGLETS
// ====================================

if (!isset($_GET['tab'])) {
    $page['tab'] = 'global';
} else {
    $page['tab'] = $_GET['tab'];
}

$tabsheet = new tabsheet();
$tabsheet->add('global', l10n('ca_tab_global'), get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php') . '&tab=global');
$tabsheet->add('reserved', l10n('ca_tab_reserved'), get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php') . '&tab=reserved');
$tabsheet->select($page['tab']);
$tabsheet->assign();

// ====================================
// TRAITEMENT DU FORMULAIRE
// ====================================

if (isset($_POST['save']) || isset($_POST['autosave'])) {
    $isAutosave = isset($_POST['autosave']);
    
    // Préparer les nouvelles données
    $newData = array();
    
    // Layout (commun aux deux schémas)
    if (isset($_POST['layout']) && is_array($_POST['layout'])) {
        $newData['layout'] = array();
        foreach ($_POST['layout'] as $key => $value) {
            // Checkboxes de masquage
            if (in_array($key, ['hide_quick_sync', 'hide_homepage_charts'])) {
                $newData['layout'][$key] = $value;
            } else {
                $newData['layout'][$key] = trim($value);
            }
        }
    }
    
    // Gestion checkboxes non cochées (valeur 0 si absente)
    $checkboxes = ['hide_quick_sync', 'hide_homepage_charts'];
    foreach ($checkboxes as $checkbox) {
        if (!isset($_POST['layout'][$checkbox])) {
            $newData['layout'][$checkbox] = '0';
        }
    }
    
    // Colors - Sauvegarder pour le schéma actif uniquement
    if (isset($_POST['colors']) && is_array($_POST['colors'])) {
        $newData['colors'] = $_POST['colors'];
        
        // Détecter les modifications utilisateur
        $userModifications = $configManager->detectUserModifications($newData, $current_scheme);
        if (!empty($userModifications)) {
            $newData['user_modifications'][$current_scheme] = $userModifications;
        }
    }

<<<<<<< HEAD
    // Custom CSS
    if (isset($_POST['custom_css']) && is_array($_POST['custom_css'])) {
=======
    // Custom CSS - UNIQUEMENT si sauvegarde manuelle
    if (!$isAutosave && isset($_POST['custom_css']) && is_array($_POST['custom_css'])) {
>>>>>>> origin/36-auto-enregistrement
        // Backup automatique de l'ancienne version
        if (!empty($centralAdmin['custom_css']['code'])) {
            $newData['custom_css']['backup'] = $centralAdmin['custom_css']['code'];
        }
        // Nouvelle saisie
        $newData['custom_css']['code'] = trim($_POST['custom_css']['code']);
    }
    
    // Sauvegarder
    if ($configManager->save($newData)) {
        if (!$isAutosave) {
            $page['infos'][] = l10n('configuration_saved');
        }
        $centralAdmin = $configManager->getCurrent();
    } else {
        if (!$isAutosave) {
            $page['errors'][] = l10n('configuration_save_error');
        }
    }
    
    // Redirection uniquement si sauvegarde manuelle
    if (!$isAutosave) {
        redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
    } else {
        // AJAX : retourner succès
        header('Content-Type: application/json');
        echo json_encode(array('success' => true));
        exit;
    }
}

if (isset($_POST['reset'])) {
    // Reset : restaurer les défauts mais préserver les modifications de l'autre schéma
    $newConfig = $centralAdminDefault;
    
    // Préserver les modifications de l'autre schéma
    $other_scheme = ($current_scheme === 'clear') ? 'dark' : 'clear';
    if (isset($centralAdmin['user_modifications'][$other_scheme])) {
        $newConfig['user_modifications'][$other_scheme] = $centralAdmin['user_modifications'][$other_scheme];
    }
    
    // Effacer les modifications du schéma actuel
    $newConfig['user_modifications'][$current_scheme] = array();
    
    conf_update_param('centralAdmin', $newConfig);
    $centralAdmin = $newConfig;
    
    $page['infos'][] = l10n('configuration_reset');
    redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
}

if (isset($_POST['restore_css'])) {
    if (!empty($centralAdmin['custom_css']['backup'])) {
        $newData = array(
            'custom_css' => array(
                'code' => $centralAdmin['custom_css']['backup'],
                'backup' => $centralAdmin['custom_css']['code'],
            ),
        );
        
        if ($configManager->save($newData)) {
            $page['infos'][] = l10n('custom_css_restored');
            $centralAdmin = $configManager->getCurrent();
        }
    } else {
        $page['errors'][] = l10n('custom_css_no_backup');
    }
    
    redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
}

// ====================================
// GÉNÉRATION DU CSS DYNAMIQUE
// ====================================

$dynamicCSS = $cssGenerator->generate($centralAdmin, $current_scheme);

// ====================================
// PRÉPARATION DES CHEMINS
// ORDONANCEMENT A RESPECTER - IMPERATIF
// ====================================

$plugin_path = get_root_url() . 'plugins/centralAdmin/';

// CSS Core
$CA_ADMIN_OVERRIDE_CSS = $plugin_path . ca_asset('assets/css/core/CA-admin-override.css');

// CSS Form
$CA_FORM_BASE_CSS = $plugin_path . ca_asset('assets/css/form/CA-form-base.css');
$CA_FORM_COMPONENTS_CSS = $plugin_path . ca_asset('assets/css/form/CA-form-components.css');
$CA_FORM_THEMES_CSS = $plugin_path . ca_asset('assets/css/form/CA-form-themes.scss');

// CSS Modules
$CA_COLORS_UNIFIED_CSS = $plugin_path . ca_asset('assets/css/modules/CA-colors-unified.css');
$CA_DEBUG_CSS = $plugin_path . ca_asset('assets/css/modules/CA-debug.css');
$CA_MODAL_CSS = $plugin_path . ca_asset('assets/css/modules/CA-modal.css');

// JS Core
$CA_INIT_JS = $plugin_path . ca_asset('assets/js/core/CA-init.js');

// JS Form
$CA_FORM_AUTOSAVE_JS = $plugin_path . ca_asset('assets/js/form/CA-form-autosave.js');
$CA_FORM_CONTROLS_JS = $plugin_path . ca_asset('assets/js/form/CA-form-controls.js');
$CA_FORM_COLORS_JS = $plugin_path . ca_asset('assets/js/form/CA-form-colors.js');
$CA_FORM_PREVIEW_JS = $plugin_path . ca_asset('assets/js/form/CA-form-preview.js');
$CA_FORM_TOOLTIPS_JS = $plugin_path . ca_asset('assets/js/form/CA-form-tooltips.js');

// JS Modules
$CA_DEBUG_JS = $plugin_path . ca_asset('assets/js/modules/CA-debug.js');
$CA_MODAL_JS = $plugin_path . ca_asset('assets/js/modules/CA-modal.js');

// ====================================
// CHARGEMENT DE LA LANGUE ADMINISTRATION
// ====================================

load_language(
  'plugin.lang',
  PHPWG_PLUGINS_PATH.'centralAdmin/',
  array(
    'language' => $user['language'],
    'no_fallback' => true,
  )
);

// ====================================
// INJECTION DU THÈME
// ====================================

$themeDetector->injectThemeAttribute($template);

// Exposer les infos debug APRÈS l'injection du thème
$template->append('head_elements', 
    '<script>window.caThemeDebugPHP = ' . json_encode($themeDetector->getDebugInfo()) . ';</script>'
);

// ====================================
// TRANSMISSION AU TEMPLATE
// ====================================

$template->assign(array(
    // Configuration
    'centralAdmin' => $centralAdmin,
    'layout' => $centralAdmin['layout'],
    'colors' => $centralAdmin['colors'],

    // Thème actuel
    'current_scheme' => $current_scheme,

    // Couleurs fusionnées pour le schéma actif
    'active_scheme_colors' => $configManager->getMergedColors($current_scheme),

    // Onglet actif
    'current_tab' => $page['tab'],

    // Debug thème
    'theme_debug' => array_merge(
        $themeDetector->getDebugInfo(),
        array(
            'plugin_version' => $plugin_version,
            'jquery_version' => 'Détection JS',
            'smarty_version' => class_exists('Smarty') && defined('Smarty::SMARTY_VERSION') ? Smarty::SMARTY_VERSION : '5.5.2',
        )
    ),

    // CSS - Core
    'CA_ADMIN_OVERRIDE_CSS' => $CA_ADMIN_OVERRIDE_CSS,

    // CSS - Form
    'CA_FORM_BASE_CSS' => $CA_FORM_BASE_CSS,
    'CA_FORM_COMPONENTS_CSS' => $CA_FORM_COMPONENTS_CSS,
    'CA_FORM_THEMES_CSS' => $CA_FORM_THEMES_CSS,

    // CSS - Modules
    'CA_DEBUG_CSS' => $CA_DEBUG_CSS,
    'CA_MODAL_CSS' => $CA_MODAL_CSS,
    'CA_COLORS_UNIFIED_CSS' => $CA_COLORS_UNIFIED_CSS,

    // JS - Core
    'CA_INIT_JS' => $CA_INIT_JS,

    // JS - Form
    'CA_FORM_AUTOSAVE_JS' => $CA_FORM_AUTOSAVE_JS,
    'CA_FORM_CONTROLS_JS' => $CA_FORM_CONTROLS_JS,
    'CA_FORM_COLORS_JS' => $CA_FORM_COLORS_JS,
    'CA_FORM_PREVIEW_JS' => $CA_FORM_PREVIEW_JS,
    'CA_FORM_TOOLTIPS_JS' => $CA_FORM_TOOLTIPS_JS,

    // JS - Modules
    'CA_DEBUG_JS' => $CA_DEBUG_JS,
    'CA_MODAL_JS' => $CA_MODAL_JS,

    // Templates sections
    'A01_GENERAL_TPL' => dirname(__FILE__) . '/sections/A01_general.tpl',
    'A02_THEME_COLORS_TPL' => dirname(__FILE__) . '/sections/A02_theme_colors.tpl',
    'A03_EIW_COLORS_TPL' => dirname(__FILE__) . '/sections/A03_eiw_colors.tpl',
    'A04_ADVANCED_PARAMS_SECTION_TPL' => dirname(__FILE__) . '/sections/A04_advanced_params.tpl',
    'A05_CUSTOM_CSS_SECTION_TPL' => dirname(__FILE__) . '/sections/A05_custom_css.tpl',
    'A10_DEBUG_SECTION_TPL' => dirname(__FILE__) . '/sections/A10_debug.tpl',

    // CSS dynamique
    'dynamic_css' => $dynamicCSS,
));

// ====================================
// INJECTION CSS DYNAMIQUE
// ====================================

$cssGenerator->injectInTemplate($template, $dynamicCSS, 'central-admin-vars-preview');

// ====================================
// TEMPLATE
// ====================================

$template->set_filenames(array(
    'plugin_admin_content' => dirname(__FILE__).'/admin.tpl'
));

$template->assign_var_from_handle('ADMIN_CONTENT', 'plugin_admin_content');