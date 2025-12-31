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
    
    // CSS jQuery Confirm
    $template->cssLoader->add('jquery-confirm', 
        'themes/default/js/plugins/jquery-confirm.min.css', 
        array(), 0);
        
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
// TRAITEMENT DU FORMULAIRE
// ====================================

if (isset($_POST['save'])) {
    // Préparer les nouvelles données
    $newData = array();
    
    // Layout (commun aux deux schémas)
    if (isset($_POST['layout']) && is_array($_POST['layout'])) {
        $newData['layout'] = array();
        foreach ($_POST['layout'] as $key => $value) {
            if ($key === 'hide_quick_sync') {
                $newData['layout'][$key] = $value;
            } else {
                $newData['layout'][$key] = trim($value);
            }
        }
    }
    
    // Gestion checkbox non coché
    if (!isset($_POST['layout']['hide_quick_sync'])) {
        $newData['layout']['hide_quick_sync'] = '0';
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
    
    // Sauvegarder
    if ($configManager->save($newData)) {
        $page['infos'][] = l10n('configuration_saved');
        $centralAdmin = $configManager->getCurrent();
    } else {
        $page['errors'][] = l10n('configuration_save_error');
    }
    
    redirect(get_admin_plugin_menu_link(dirname(__FILE__).'/admin.php'));
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

// ====================================
// GÉNÉRATION DU CSS DYNAMIQUE
// ====================================

$dynamicCSS = $cssGenerator->generate($centralAdmin, $current_scheme);

// ====================================
// PRÉPARATION DES CHEMINS
// ORDONANCEMENT A RESPECTER - IMPERATIF
// ====================================

$plugin_path = get_root_url() . 'plugins/centralAdmin/';
$assets_path = $plugin_path . 'assets/';

// CSS Core
$css_core_path = $assets_path . 'css/core/';
$CA_VARIABLES_CSS = ca_asset($css_core_path . 'CA-variables.css');
$CA_ADMIN_LAYOUT_CSS = ca_asset($css_core_path . 'CA-admin-layout.css');
$CA_ADMIN_OVERRIDE_CSS = ca_asset($css_core_path . 'CA-admin-override.css');

// CSS Form
$css_form_path = $assets_path . 'css/form/';
$CA_FORM_BASE_CSS = ca_asset($css_form_path . 'CA-form-base.css');
$CA_FORM_COMPONENTS_CSS = ca_asset($css_form_path . 'CA-form-components.css');
$CA_FORM_THEMES_CSS = ca_asset($css_form_path . 'CA-form-themes.css');

// CSS Modules
$css_modules_path = $assets_path . 'css/modules/';
$CA_DEBUG_CSS = ca_asset($css_modules_path . 'CA-debug.css');
$CA_MODAL_CSS = ca_asset($css_modules_path . 'CA-modal.css');

// JS Core
$js_core_path = $assets_path . 'js/core/';
$CA_INIT_JS = ca_asset($js_core_path . 'CA-init.js');
$CA_THEME_DETECTOR_JS = ca_asset($js_core_path . 'CA-theme-detector.js');

// JS Form
$js_form_path = $assets_path . 'js/form/';
$CA_FORM_CONTROLS_JS = ca_asset($js_form_path . 'CA-form-controls.js');
$CA_FORM_COLORS_JS = ca_asset($js_form_path . 'CA-form-colors.js');
$CA_FORM_PREVIEW_JS = ca_asset($js_form_path . 'CA-form-preview.js');

// JS Modules
$js_modules_path = $assets_path . 'js/modules/';
$CA_DEBUG_JS = ca_asset($js_modules_path . 'CA-debug.js');
$CA_MODAL_JS = ca_asset($js_modules_path . 'CA-modal.js');

// ====================================
// INJECTION DU THÈME
// ====================================

$themeDetector->injectThemeAttribute($template);

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

    // Debug thème
    'theme_debug' => array_merge(
        $themeDetector->getDebugInfo(),
        array(
            'plugin_version' => $plugin_version,
            'jquery_version' => 'Détection JS',
            'smarty_version' => defined('SMARTY_VERSION') ? SMARTY_VERSION : 'inconnu',
        )
    ),

    // CSS - Core
    'CA_VARIABLES_CSS' => $CA_VARIABLES_CSS,
    'CA_ADMIN_LAYOUT_CSS' => $CA_ADMIN_LAYOUT_CSS,
    'CA_ADMIN_OVERRIDE_CSS' => $CA_ADMIN_OVERRIDE_CSS,

    // CSS - Form
    'CA_FORM_BASE_CSS' => $CA_FORM_BASE_CSS,
    'CA_FORM_COMPONENTS_CSS' => $CA_FORM_COMPONENTS_CSS,
    'CA_FORM_THEMES_CSS' => $CA_FORM_THEMES_CSS,

    // CSS - Modules
    'CA_DEBUG_CSS' => $CA_DEBUG_CSS,
    'CA_MODAL_CSS' => $CA_MODAL_CSS,

    // JS - Core
    'CA_INIT_JS' => $CA_INIT_JS,
    'CA_THEME_DETECTOR_JS' => $CA_THEME_DETECTOR_JS,

    // JS - Form
    'CA_FORM_CONTROLS_JS' => $CA_FORM_CONTROLS_JS,
    'CA_FORM_COLORS_JS' => $CA_FORM_COLORS_JS,
    'CA_FORM_PREVIEW_JS' => $CA_FORM_PREVIEW_JS,

    // JS - Modules
    'CA_DEBUG_JS' => $CA_DEBUG_JS,
    'CA_MODAL_JS' => $CA_MODAL_JS,

    // Templates sections
    'LAYOUT_SECTION_TPL' => dirname(__FILE__) . '/sections/layout.tpl',
    'TOOLTIPS_SECTION_TPL' => dirname(__FILE__) . '/sections/tooltips.tpl',
    'COLORS_CLEAR_SECTION_TPL' => dirname(__FILE__) . '/sections/colors_clear.tpl',
    'COLORS_DARK_SECTION_TPL' => dirname(__FILE__) . '/sections/colors_dark.tpl',

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