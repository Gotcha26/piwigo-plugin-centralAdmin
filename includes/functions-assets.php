<?php
// Sécurité
if (!defined('PHPWG_ROOT_PATH')) {
    die('Hacking attempt!');
}

if (!function_exists('ca_asset')) {

    /**
     * Retourne l'URL du fichier minifié s'il existe, sinon la version standard
     */
    function ca_asset(string $url): string
    {
        $root = PHPWG_ROOT_PATH;

        // URL → chemin disque
        $path = $root . ltrim(parse_url($url, PHP_URL_PATH), '/');

        // Insère .min avant l’extension
        $minPath = preg_replace('/(\.\w+)$/', '.min$1', $path);
        $minUrl  = preg_replace('/(\.\w+)$/', '.min$1', $url);

        // Si le fichier minifié existe → priorité
        if (is_file($minPath)) {
            return $minUrl;
        }

        // Sinon → version standard
        return $url;
    }
}
