<?php
/**
 * CentralAdmin - Classe de maintenance
 *
 * Gère l'installation, la mise à jour et la désinstallation
 * du plugin et de ses modules.
 *
 * @package CentralAdmin
 */

if (!defined('PHPWG_ROOT_PATH')) die('Hacking attempt!');

class centralAdmin_maintain extends PluginMaintain
{
    function install($plugin_version, &$errors = array())
    {
        // Installer les modules
        $this->installModules();
    }

    function update($old_version, $new_version, &$errors = array())
    {
        // Mettre à jour les modules
        $this->installModules();
    }

    function uninstall()
    {
        // Désinstaller les modules
        $metaog_maintain = dirname(__FILE__) . '/modules/metaog/maintain.php';
        if (file_exists($metaog_maintain)) {
            require_once($metaog_maintain);
            CA_MetaOG_Maintain::uninstall();
        }

        $skyline_maintain = dirname(__FILE__) . '/modules/skyline/maintain.php';
        if (file_exists($skyline_maintain)) {
            require_once($skyline_maintain);
            CA_Skyline_Maintain::uninstall();
        }

        $patcher_maintain = dirname(__FILE__) . '/modules/ca-patcher/maintain.php';
        if (file_exists($patcher_maintain)) {
            require_once($patcher_maintain);
            CA_Patcher_Maintain::uninstall();
        }
    }

    /**
     * Installe/met à jour tous les modules disponibles
     */
    private function installModules()
    {
        // Module Meta OG
        $metaog_maintain = dirname(__FILE__) . '/modules/metaog/maintain.php';
        if (file_exists($metaog_maintain)) {
            require_once($metaog_maintain);
            CA_MetaOG_Maintain::install();
        }

        // Module Skyline
        $skyline_maintain = dirname(__FILE__) . '/modules/skyline/maintain.php';
        if (file_exists($skyline_maintain)) {
            require_once($skyline_maintain);
            CA_Skyline_Maintain::install();
        }

        // Module CA-Patcher
        $patcher_maintain = dirname(__FILE__) . '/modules/ca-patcher/maintain.php';
        if (file_exists($patcher_maintain)) {
            require_once($patcher_maintain);
            CA_Patcher_Maintain::install();
        }
    }
}
