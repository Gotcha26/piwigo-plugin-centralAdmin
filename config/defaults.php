<?php
defined('PHPWG_ROOT_PATH') or die('Hacking attempt!');

/* ==================================================
 * VALEURS PAR DÉFAUT
 * Structure : layout (commun) + colors (par schéma)
 * ================================================== */

return array(
  'layout' => array(
    'admin_width'              => '1600',
    'menubar_width'            => '205',
    'align_pluginFilter_left'  => '225',
    'align_pluginFilter_right' => '160',
    'fade_start'               => '800',
    'hide_quick_sync'          => '0',
  ),
  'colors' => array(
    'tooltips' => array(
      'infos_main_color'    => '#c2f5c2',
      'warning_main_color'  => '#ffdd99',
      'messages_main_color' => '#bde5f8',
      'error_main_color'    => '#ffd5dc',
    ),
    'clear' => array(
      'bg_global'   => '#707070',
      'bg_content2' => '#eeeeee',
      'bg_content1' => '#f8f8f8',
      'bg_content3' => '#eeeeee',
    ),
    'dark' => array(
      'bg_global'   => '#000000',
      'bg_content2' => '#565656',
      'bg_content1' => '#444444',
      'bg_content3' => '#565656',
    ),
  ),
  // Nouveau : sauvegarde des modifications utilisateur par schéma
  'user_modifications' => array(
    'clear' => array(),
    'dark' => array(),
  ),
);