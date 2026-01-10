<?php
// ================================================
// CENTRALADMIN - ENGLISH TRANSLATIONS
// ================================================

// == GENERAL ==
$lang['central_admin'] = 'CSS Skin - centralAdmin';
$lang['central_admin_description'] = 'Customize the appearance of your administration interface';
$lang['save'] = 'Save';
$lang['ca_saving'] = 'Saving';
$lang['ca_saved'] = 'Saved';
$lang['reset'] = 'Reset';
$lang['credits'] = 'Credits';

// == MESSAGES ==
$lang['configuration_saved'] = 'Configuration saved successfully 👍';
$lang['configuration_reset'] = 'Configuration reset to default values';
$lang['configuration_reset_error'] = 'Error while resetting configuration';

// == SECTIONS ==
$lang['debug_infos_area'] = 'Debug Information';

// == STATES ==
$lang['central_admin_locked'] = 'Parameter locked';

// == HEADER OPTIONS ==
$lang['actual_piwigo_admin_theme'] = 'Detected Piwigo admin theme:';
$lang['preference_browser_scheme'] = 'Use browser theme preference';
$lang['accordion_choice'] = 'Only one panel open at a time';

// == LAYOUT PARAMETERS ==
$lang['hide_homepage_charts'] = 'Hide homepage charts';
$lang['hide_homepage_charts_tp'] = 
  "Hides activity and storage charts on the administration home page.\n"
. "Useful for a cleaner interface.";

$lang['admin_width'] = 'Maximum administration width';
$lang['admin_width_tp'] = "Maximum width of the administration interface.\nRecommended value: 1600px\nFor advanced users only.";

$lang['menubar_width'] = 'Sidebar width';
$lang['menubar_width_tp'] = "Width of the left column (menubar).\nRecommended value: 205px\nFor advanced users only.";

$lang['align_pluginFilter_left'] = '"Plugins" page - Left position of action bar';
$lang['align_pluginFilter_left_tp'] = "Position of the action bar (left part).\nMust match menubar width.\nRecommended value: 225px\nFor advanced users only.";

$lang['align_pluginFilter_right'] = '"Plugins" page - Right position of action bar';
$lang['align_pluginFilter_right_tp'] = "Position of the action bar (right part).\nRecommended value: 160px\nFor advanced users only.";

$lang['fade_start'] = 'Color gradient start';
$lang['fade_start_tp'] = "Distance before which color remains solid at 100%.\nRecommended value: 800px\nFor advanced users only.";

$lang['hide_quick_sync_button'] = 'Hide quick sync button';
$lang['hide_quick_sync_button_tp'] = "Hides the \"Create album\" button on the sync page.\nUseful for a cleaner interface.";

// == UNIFIED COLORS SECTION ==
$lang['central_admin_colors_by_theme'] = 'Colors by Theme';
$lang['active_theme_info'] = 'Active theme:';
$lang['theme_preview_note'] = 'Real-time preview only works on the active theme. Colors of the other theme can be modified but will only be visible after switching themes.';
$lang['theme_clear_title'] = 'Light Theme';
$lang['theme_dark_title'] = 'Dark Theme';
$lang['active'] = 'Active';

// == COMMON COLORS (simplified) ==
$lang['bg_global'] = 'Global background';
$lang['bg_content2'] = 'Header background';
$lang['bg_content1'] = 'Main content background';
$lang['bg_content3'] = 'Secondary background';

// == TOOLTIP COLORS ==
$lang['infos_main_color'] = 'Informational message color';
$lang['infos_main_color_tp'] = 'Background color for information bubbles (light green by default)';

$lang['warning_main_color'] = 'Warning color';
$lang['warning_main_color_tp'] = 'Background color for warning bubbles (orange by default)';

$lang['messages_main_color'] = 'Message color';
$lang['messages_main_color_tp'] = 'Background color for message bubbles (light blue by default)';

$lang['error_main_color'] = 'Error color';
$lang['error_main_color_tp'] = 'Background color for error bubbles (light red by default)';

// == LIGHT THEME COLORS ==
$lang['bg_clear_global'] = 'Global background';
$lang['bg_clear_global_tp'] = 'Color of the lateral bands on the sides of the interface';

$lang['bg_clear_content2'] = 'Header background';
$lang['bg_clear_content2_tp'] = 'Color of page headers (top banner)';

$lang['bg_clear_content1'] = 'Main content background';
$lang['bg_clear_content1_tp'] = 'Color of the content area used by options';

$lang['bg_clear_content3'] = 'Secondary background';
$lang['bg_clear_content3_tp'] = 'Color of the remaining area below options (if present)';

// == DARK THEME COLORS ==
$lang['bg_dark_global'] = 'Global background';
$lang['bg_dark_global_tp'] = 'Color of the lateral bands on the sides of the interface';

$lang['bg_dark_content2'] = 'Header background';
$lang['bg_dark_content2_tp'] = 'Color of page headers (top banner)';

$lang['bg_dark_content1'] = 'Main content background';
$lang['bg_dark_content1_tp'] = 'Color of the content area used by options';

$lang['bg_dark_content3'] = 'Secondary background';
$lang['bg_dark_content3_tp'] = 'Color of the remaining area below options (if present)';

// == DEBUG - VERSIONS ==
$lang['versions'] = 'Component Versions';
$lang['plugin_internal_version'] = 'Plugin version:';
$lang['verification_'] = 'Checking...';

// == DEBUG - THEME DETECTION ==
$lang['theme_detection_php'] = 'Theme Detection (Server-side - PHP)';
$lang['debug_detection_method'] = 'Detection method';
$lang['debug_piwigo_theme'] = 'Piwigo theme';
$lang['debug_normalized'] = 'Normalization';
$lang['debug_final_theme'] = 'Final applied theme';

// == DEBUG - CONSOLE ==
$lang['browser_console'] = 'Browser Console';
$lang['open_console_f12'] = 'Open developer tools (F12) > Console to see theme detection details and component loading information.';

// == HELP REQUEST ==
$lang['help_section_title'] = 'Plugin Help & Support';
$lang['help_section_description'] = 'Need help or want to report an issue? Check out these resources:';
$lang['help_link_wiki'] = 'Documentation Wiki';
$lang['help_link_forum'] = 'Discussion Forum';
$lang['help_link_issues'] = 'Report a bug or suggest an improvement';
$lang['help_link_documentation'] = 'Complete Technical Documentation';

// == REORGANIZED SECTIONS ==
$lang['central_admin_general'] = 'General';
$lang['central_admin_messages_colors'] = 'Message Colors';
$lang['central_admin_advanced_params'] = 'Advanced Parameters';

// == ADVANCED WARNING ==
$lang['advanced_params_warning'] = 'These parameters are intended for advanced users. Incorrect values may alter the interface display. Use the locks to modify these parameters.';

// == CUSTOM CSS SECTION ==
$lang['custom_css_section_title'] = 'Custom CSS Injection';
$lang['custom_css_warning'] = 'This section allows injecting your own CSS rules. Syntax errors may alter the interface. Use backup if needed.';
$lang['custom_css_label'] = 'Custom CSS code';
$lang['custom_css_help'] = "Enter your CSS rules here. They will be injected in all admin pages.\nExample: body { background: red; }";
$lang['custom_css_placeholder'] = 'Enter your CSS code here...';
$lang['custom_css_restore'] = 'Restore backup';
$lang['custom_css_restored'] = 'CSS restored from backup';
$lang['custom_css_no_backup'] = 'No backup available';

// == Tabs ==
$lang['ca_tab_global'] = 'Global';
$lang['ca_tab_reserved'] = 'Reserved';
$lang['ca_reserved_tab_message'] = 'Space reserved for future features';

// Autosave
$lang['ca_autosave_success'] = 'Changes saved automatically';
$lang['ca_autosave_error'] = 'Error during automatic save';