# 📘 centralAdmin - Documentation Technique

> Documentation à destination des développeurs souhaitant comprendre, maintenir ou étendre le plugin centralAdmin pour Piwigo.

**Version** : 3.2  
**Auteur** : Gotcha  
**Licence** : GPL v2+

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Flux de Données](#flux-de-données)
4. [Classes PHP](#classes-php)
5. [Gestion CSS](#gestion-css)
6. [Gestion JavaScript](#gestion-javascript)
7. [Configuration](#configuration)
8. [Détection de Thème](#détection-de-thème)
9. [Personnalisation](#personnalisation)
10. [Débogage](#débogage)
11. [Extension du Plugin](#extension-du-plugin)
12. [Stockage des données](#stockage-des-données)

---

## Vue d'Ensemble

### 🎯 Objectif du Plugin

centralAdmin modifie **uniquement l'interface d'administration** de Piwigo via CSS pour :
- Centrer l'affichage sur grands écrans (max 1600px par défaut)
- Permettre la personnalisation des couleurs par thème (clear/dark)
- Préserver toutes les fonctionnalités natives de Piwigo

### 🔑 Principe Fondamental

**Injection CSS uniquement** - Aucune modification du core Piwigo :
- Pas de hooks PHP invasifs
- Pas de modification de base de données structurelle
- Désactivation possible sans conséquence

### 📦 Composants Principaux

```
centralAdmin/
├── main.inc.php              # Point d'entrée (hooks Piwigo)
├── admin.php                 # Contrôleur page configuration
├── admin.tpl                 # Template page configuration
├── config/defaults.php       # Source de vérité (valeurs)
├── includes/                 # Classes PHP (logique métier)
├── assets/                   # CSS/JS (présentation)
└── sections/                 # Templates Smarty (fragments)
```

---

## Architecture

### 🏗️ Pattern MVC Adapté

```
┌─────────────────────────────────────────────────┐
│              PIWIGO CORE                        │
│  (événements : init, loc_begin_admin_page)      │
└─────────────────┬───────────────────────────────┘
                  │
                  ├─► main.inc.php (Point d'entrée)
                  │       │
                  │       ├─► CA_ConfigManager (Modèle)
                  │       ├─► CA_CSSGenerator (Vue/CSS)
                  │       └─► CA_ThemeDetector (Utilitaire)
                  │
                  └─► admin.php (Contrôleur)
                          │
                          ├─► Classes PHP (Logique)
                          └─► admin.tpl (Vue)
                                  │
                                  ├─► CSS (Présentation)
                                  └─► JavaScript (Interaction)
```

### 📁 Organisation des Fichiers

#### CSS - Organisation par Portée

```
assets/css/
├── core/                    # Appliqué PARTOUT (main.inc.php)
│   └── CA-admin-override.css    → Surcharges pages Piwigo, centrage, structure
│
├── form/                    # Page plugin UNIQUEMENT (admin.tpl)
│   ├── CA-form-base.css         → Structure formulaire
│   ├── CA-form-components.css   → Composants UI
│   └── CA-form-themes.css       → Adaptation clear/dark
│
└── modules/                 # Modules réutilisables
    ├── CA-debug.css             → Styles débogage
    └── CA-modal.css             → Styles modales
```

#### JavaScript - Organisation par Fonction

```
assets/js/
├── core/                    # Initialisation et utilitaires
│   ├── CA-init.js               → Coordonne tous les modules
│   └── CA-theme-detector.js     → Détection thème DOM/CSS
│
├── form/                    # Gestion formulaire
│   ├── CA-form-controls.js      → Sliders, locks, accordéons
│   ├── CA-form-colors.js        → Color pickers
│   └── CA-form-preview.js       → Prévisualisation temps réel
│
└── modules/                 # Modules autonomes
    ├── CA-debug.js              → Debug complet (réutilisable)
    └── CA-modal.js              → Gestion modales
```

---

## Flux de Données

### 🔄 Chargement Configuration

```
1. Piwigo déclenche événement 'init'
        ↓
2. main.inc.php::central_admin_init()
        ↓
3. CA_ConfigManager->loadDefaults()
        ← config/defaults.php (source de vérité)
        ↓
4. CA_ConfigManager->loadCurrent()
        ← Base de données (personnalisations utilisateur)
        ↓
5. Fusion défensive (defaults + user)
        ↓
6. Stockage dans $conf['centralAdmin']
```

### 🎨 Génération CSS Dynamique

```
1. Piwigo déclenche 'loc_begin_admin_page'
        ↓
2. CA_ThemeDetector->detect()
        → Détecte 'clear' ou 'dark'
        ↓
3. CA_CSSGenerator->generate($config, $scheme)
        ← config/defaults.php (valeurs base)
        ← user_modifications[$scheme] (personnalisations)
        ↓
4. Génération variables CSS
        → :root { --ca-layout-admin-width: 1600px; ... }
        ↓
5. Injection dans <head>
        <style id="central-admin-vars">...</style>
```

### 💾 Sauvegarde Modifications

```
1. Utilisateur modifie formulaire
        ↓
2. Soumission POST (admin.php)
        ↓
3. CA_ConfigManager->detectUserModifications()
        → Compare avec defaults.php
        → Stocke uniquement les DIFFÉRENCES
        ↓
4. CA_ConfigManager->save($newData)
        → conf_update_param('centralAdmin', ...)
        ↓
5. Redirection avec message succès
```

---

## Classes PHP

### 📦 CA_ConfigManager

**Responsabilité** : Gestion centralisée de la configuration

#### Paramètres Requis

```php
// Constructeur
$configManager = new CA_ConfigManager($defaultsPath = null);
// $defaultsPath : Chemin vers defaults.php (optionnel)
```

#### Méthodes Principales

```php
// Chargement
$config = $configManager->getCurrent();
// Retourne : array (layout, colors, user_modifications)

$defaults = $configManager->getDefaults();
// Retourne : array (valeurs par défaut uniquement)

// Sauvegarde
$success = $configManager->save($newData);
// $newData : array avec nouvelles valeurs
// Retourne : bool

// Reset
$success = $configManager->reset($scheme = null);
// $scheme : 'clear', 'dark', ou null (tout)
// Retourne : bool

// Récupération valeur spécifique
$value = $configManager->get('layout.admin_width', 1600);
// Notation pointée pour nested arrays
// Retourne : mixed (ou valeur par défaut)
```

#### Structure Données

```php
$config = [
    'layout' => [
        'admin_width' => '1600',              // string (px)
        'menubar_width' => '205',             // string (px)
        'align_pluginFilter_left' => '225',   // string (px)
        'align_pluginFilter_right' => '160',  // string (px)
        'fade_start' => '800',                // string (px)
        'hide_quick_sync' => '1',             // string ('0' ou '1')
        'hide_homepage_charts' => '0',        // string ('0' ou '1')
    ],
    'colors' => [
        'clear' => [                          // Spécifique schéma clair
            'bg_global' => '#707070',
            'bg_content2' => '#eeeeee',
            'bg_content1' => '#f8f8f8',
            'bg_content3' => '#eeeeee',
            'infos_main_color'    => '#c2f5c2',
            'warning_main_color'  => '#ffdd99',
            'messages_main_color' => '#bde5f8',
            'error_main_color'    => '#ffd5dc',            
        ],
        'dark' => [                           // Spécifique schéma sombre
            'bg_global' => '#000000',
            'bg_content2' => '#565656',
            'bg_content1' => '#444444',
            'bg_content3' => '#565656',
            'infos_main_color'    => '#2d5a2d',
            'warning_main_color'  => '#5a4a1a',
            'messages_main_color' => '#1a3a4a',
            'error_main_color'    => '#5a1a1a',
        ],
    ],
    'user_modifications' => [                 // Modifications utilisateur
        'clear' => [],                        // par schéma
        'dark' => [],
    ],
    'custom_css' => [                         // CSS injecté directement
        'code' => '',                         // par l'utilisateur
        'backup' => '',
    ],
];
```

---

### 🎨 CA_CSSGenerator

**Responsabilité** : Génération CSS dynamique depuis configuration

#### Paramètres Requis

```php
// Constructeur
$cssGenerator = new CA_CSSGenerator();
// Pas de paramètres
```

#### Méthodes Principales

```php
// Génération CSS complet
$css = $cssGenerator->generate($config, $scheme);
// $config : array (structure complète)
// $scheme : string ('clear' ou 'dark')
// Retourne : string (CSS formaté)

// Injection dans template
$cssGenerator->injectInTemplate($template, $css, $id);
// $template : objet Smarty
// $css : string (contenu CSS)
// $id : string (ID du tag <style>)

// Injection fichier CSS
$cssGenerator->injectCSSFile($template, $url, $id);
// $url : string (chemin vers fichier CSS)
// $id : string (ID du tag <link>)

// Export vers fichier
$success = $cssGenerator->exportToFile($config, $scheme, $path);
// Utile pour backup ou débogage
// Retourne : bool
```

#### Logique Génération

```php
// 1. Génération layout
foreach ($layout as $key => $value) {
    if ($key === 'hide_quick_sync') {
        $displayValue = ($value === '1') ? 'none' : 'block';
        $css .= '--ca-layout-hide-quick-sync: ' . $displayValue . ';';
    } else {
        $css .= '--ca-layout-' . str_replace('_', '-', $key) . ': ' . $value . 'px;';
    }
}

// 2. Génération couleurs (fusion base + modifications)
$mergedColors = array_merge(
    $config['colors'][$scheme],
    $config['user_modifications'][$scheme]
);
```

---

### 🔍 CA_ThemeDetector

**Responsabilité** : Détection thème admin Piwigo

#### Paramètres Requis

```php
// Constructeur
$themeDetector = new CA_ThemeDetector();
// Détection automatique au constructeur
```

#### Méthodes Principales

```php
// Détection
$theme = $themeDetector->getTheme();
// Retourne : string ('clear' ou 'dark')

// Checks booléens
$isDark = $themeDetector->isDark();
// Retourne : bool

$isClear = $themeDetector->isClear();
// Retourne : bool

// Debug
$debugInfo = $themeDetector->getDebugInfo();
// Retourne : array (méthode, valeurs brutes, etc.)

// Injection attribut DOM
$themeDetector->injectThemeAttribute($template);
// Injecte data-ca-theme et classe CSS
```

#### Méthode de Détection

```php
// Méthode OFFICIELLE Piwigo
$rawTheme = userprefs_get_param('admin_theme', 'clear');
// Valeurs possibles : 'roma', 'clear'

// Normalisation
if ($rawTheme === 'roma') {
    return 'dark';
}
return 'clear';
```

---

## Gestion CSS

### 🎨 Variables CSS Dynamiques

#### Source de Vérité

**Fichier** : `config/defaults.php`

```php
return array(
    'layout' => array(
        'admin_width' => '1600',  // Largeur max admin
        // ...
    ),
    'colors' => array(
        'clear' => array(
            'bg_global' => '#707070',  // Couleur bandes latérales
            // ...
        ),
    ),
);
```

#### Génération CSS

**Process** :
1. `CA_CSSGenerator->generate()` lit la config
2. Convertit en variables CSS : `--ca-layout-admin-width: 1600px;`
3. Injection dans `<head>` via `<style id="central-admin-vars">`

#### Utilisation dans CSS

```css
/* CA-admin-layout.css */
#theAdminPage {
    max-width: var(--ca-layout-admin-width);  /* 1600px par défaut */
    margin: 0 auto;                           /* Centrage */
}

/* Variables disponibles automatiquement */
.my-element {
    background: var(--ca-color-bg-global);
    width: var(--ca-layout-menubar-width);
}
```

### 📐 Centrage Responsive

```css
/* Centrage basique */
#theAdminPage {
    max-width: var(--ca-layout-admin-width);
    margin-left: auto;
    margin-right: auto;
}

/* Positionnement éléments fixes */
#menubar {
    left: max(0px, calc((100vw - var(--ca-layout-admin-width)) / 2));
}

/* Media query pour grands écrans */
@media (min-width: 1600px) {
    .pluginFilter {
        right: calc((100vw - var(--ca-layout-admin-width)) / 2 + 160px);
    }
}
```

### 🎨 Thèmes Clear/Dark

#### Sélecteur Principal

```css
/* Thème dark (Roma) */
body.ca-piwigo-theme-dark:not(.ca-browser-theme) .my-element {
    background: #2c3e50;
    color: #e9ecef;
}

/* Option navigateur activée */
@media (prefers-color-scheme: dark) {
    body.ca-browser-theme .my-element {
        /* Styles basés sur préférence OS */
    }
}
```

---

## Gestion JavaScript

### 🔄 Architecture Modulaire

Chaque fichier JS est un **module autonome** avec pattern IIFE :

```javascript
const CAFormControls = (function() {
  'use strict';
  
  // Variables privées
  let config = {};
  
  // Méthodes privées
  function privateMethod() {
    // ...
  }
  
  // API publique
  return {
    init: function() { /* ... */ },
    publicMethod: function() { /* ... */ }
  };
})();
```

### 📦 Modules Disponibles

#### CA-init.js (Coordinateur)

```javascript
// Initialise tous les modules dans le bon ordre
document.addEventListener('DOMContentLoaded', function() {
    CAFormControls.init();
    CAFormColors.init();
    CAFormPreview.init();
    CAModal.init();
    CADebug.init();
});
```

#### CA-form-preview.js (Prévisualisation)

```javascript
// Met à jour variables CSS en temps réel
CAFormPreview.updateCSSVariable('--ca-layout-admin-width', '1800px');

// Accès au style tag
const styleTag = document.getElementById('central-admin-vars-preview');
```

#### CA-debug.js (Module Star ⭐)

```javascript
// API publique exposée
window.CADebug = {
    log: function(message, data) { /* ... */ },
    exportReport: function() { /* ... */ },
    getMetrics: function() { /* ... */ }
};

// Utilisation depuis console
CADebug.log('Mon message', { foo: 'bar' });
CADebug.exportReport();  // Export JSON complet
```

### 🎯 Communication Inter-Modules

#### Événements Personnalisés

```javascript
// Émission (CA-form-colors.js)
const event = new CustomEvent('color-change', { 
    detail: { color: '#ff0000', inputId: 'bg_clear_global_text' } 
});
element.dispatchEvent(event);

// Écoute (CA-form-preview.js)
element.addEventListener('color-change', function(e) {
    updateCSSVariable('--ca-color-bg-global', e.detail.color);
});
```

---

## Configuration

### 📝 Structure config/defaults.php

#### Sections

```php
return array(
    // === LAYOUT (commun aux 2 schémas) ===
    'layout' => array(
        'admin_width' => '1600',  // Largeur max interface
        // Toutes valeurs en STRING (stockage BDD)
    ),
    
    // === COLORS ===
    'colors' => array(
        // Commun
        'tooltips' => array(
            'infos_main_color' => '#c2f5c2',
        ),
        // Spécifique clear
        'clear' => array( /* ... */ ),
        // Spécifique dark
        'dark' => array( /* ... */ ),
    ),
    
    // === MODIFICATIONS UTILISATEUR ===
    'user_modifications' => array(
        'clear' => array(),  // Vide par défaut
        'dark' => array(),
    ),
);
```

#### Ajout Nouveau Paramètre

```php
// 1. Ajouter dans defaults.php
'layout' => array(
    'admin_width' => '1600',
    'new_param' => '100',  // ← NOUVEAU
),

// 2. CA_CSSGenerator le convertira automatiquement en :
// --ca-layout-new-param: 100px;

// 3. Utiliser dans CSS
.my-element {
    width: var(--ca-layout-new-param);
}
```

### 🔄 Migrations Config

#### Fusion Défensive

```php
// Dans CA_ConfigManager->loadCurrent()
$this->current = array_replace_recursive(
    $this->defaults,      // Nouvelles valeurs
    $conf[$this->configKey]  // Anciennes valeurs conservées
);
```

**Avantage** : Ajout paramètres sans casser installations existantes

---

## Détection de Thème

### 🔍 Méthode PHP (Serveur)

```php
// main.inc.php / admin.php
$themeDetector = new CA_ThemeDetector();
$scheme = $themeDetector->getTheme();  // 'clear' ou 'dark'

// Utilisation
if ($scheme === 'dark') {
    // Logique spécifique dark
}
```

## Personnalisation

### 🎨 Ajouter Nouvelle Couleur

#### Étape 1 : defaults.php

```php
'colors' => array(
    'clear' => array(
        'bg_global' => '#707070',
        'new_color' => '#ff0000',  // ← AJOUT
    ),
),
```

#### Étape 2 : Template Section

```smarty
{* sections/colors_clear.tpl *}
<div class="ca-field">
    <label>Ma Nouvelle Couleur</label>
    <input type="color" 
           id="new_color_picker"
           value="{$centralAdmin.colors.clear.new_color}">
    <input type="text"
           name="colors[clear][new_color]"
           value="{$centralAdmin.colors.clear.new_color}">
</div>
```

#### Étape 3 : JavaScript Preview

```javascript
// CA-form-preview.js
const clearColors = [
    'bg_global', 
    'new_color'  // ← AJOUT
];
```

#### Étape 4 : Utilisation CSS

```css
/* Automatiquement disponible via --ca-color-new-color */
.my-element {
    background: var(--ca-color-new-color);
}
```

---

## Débogage

### 🐛 Module CA-debug.js

#### Utilisation Console

```javascript
// Log structuré
CADebug.log('Mon message', { data: 'valeur' }, 'info');

// Export rapport complet
const report = CADebug.exportReport();
console.log(report);

// Télécharger rapport JSON
CADebug.downloadReport();

// Métriques performance
const metrics = CADebug.getMetrics();
console.log(metrics.currentTime);  // Temps depuis chargement
```

#### Structure Rapport

```javascript
{
    config: { /* Config module */ },
    logs: [ /* Tous les logs */ ],
    metrics: {
        startTime: 1234.56,
        currentTime: 5678.90,
        loadEvents: [ /* DOMContentLoaded, load */ ],
        memoryUsage: { used: '45.2 MB', total: '100 MB' }
    },
    theme: {
        php: 'clear',
        js: 'clear',
        concordance: true
    },
    browser: {
        userAgent: '...',
        platform: '...',
        language: 'fr-FR'
    }
}
```

### 🔍 Debug PHP

```php
// Dans n'importe quelle classe
$debugInfo = $configManager->exportDebugInfo();
error_log(print_r($debugInfo, true));

// Ou via template
$template->assign('debug', $debugInfo);
```

---

## Extension du Plugin

### 🔌 Ajouter Module CSS Réutilisable

```bash
# 1. Créer fichier
touch assets/css/modules/CA-my-module.css

# 2. Ajouter styles
cat > assets/css/modules/CA-my-module.css << 'EOF'
/* Mon Module Réutilisable */
.ca-my-module {
    /* ... */
}
EOF

# 3. Charger dans admin.tpl
<link rel="stylesheet" href="{$CA_MY_MODULE_CSS}">

# 4. Assigner dans admin.php
$template->assign('CA_MY_MODULE_CSS', $assets_path . 'modules/CA-my-module.css');
```

### 🔌 Ajouter Module JavaScript

```javascript
// assets/js/modules/CA-my-module.js
const CAMyModule = (function() {
  'use strict';
  
  function init() {
    console.log('[CA MyModule] Initialized');
  }
  
  return {
    init: init
  };
})();

// Dans CA-init.js
if (typeof CAMyModule !== 'undefined') {
    CAMyModule.init();
}
```

### 🎯 Hooks Disponibles

```php
// Événements Piwigo utilisables
add_event_handler('init', 'my_function');
add_event_handler('loc_begin_admin_page', 'my_function');
add_event_handler('get_admin_plugin_menu_links', 'my_function');

// Événements JavaScript personnalisés
document.addEventListener('ca-config-saved', function(e) {
    console.log('Config sauvegardée', e.detail);
});
```

---

## Stockage des données

* Localisation : **Base de données Piwigo**
* Les données sont stockées dans la **table `piwigo_config`** de la base de données.

---

## Détails techniques

### Structure de stockage

**Table** : `piwigo_config`

**Champ `param`** : `centralAdmin`

**Champ `value`** : Tableau PHP sérialisé contenant :

```php
array(
  'layout' => array(...),
  'colors' => array(...),
  'user_modifications' => array(...),
  'custom_css' => array(
    'code' => 'Votre CSS personnalisé ici',
    'backup' => 'Backup du CSS précédent'
  )
)
```

---

## Mécanisme utilisé

### Fonction Piwigo : `conf_update_param()`

**Fichier source Piwigo** : `include/functions.inc.php` (ligne ~1089)

```php
function conf_update_param($param, $value)
{
  $query = '
SELECT param
FROM '.CONFIG_TABLE.'
WHERE param = \''.$param.'\'
;';
  
  if (pwg_db_num_rows(pwg_query($query)))
  {
    $query = '
UPDATE '.CONFIG_TABLE.'
SET value = \''. pwg_db_real_escape_string(serialize($value)).'\'
WHERE param = \''.$param.'\'
;';
  }
  else
  {
    $query = '
INSERT INTO '.CONFIG_TABLE.'
(param, value)
VALUES(\''.$param.'\', \''.pwg_db_real_escape_string(serialize($value)).'\')
;';
  }
  
  pwg_query($query);
}
```

---

## Vérification en base de données

### Requête SQL pour consulter

```sql
SELECT * 
FROM piwigo_config 
WHERE param = 'centralAdmin';
```

### Résultat attendu

| param | value | comment |
|-------|-------|---------|
| centralAdmin | `a:4:{s:6:"layout";a:7:{...}s:10:"custom_css";a:2:{s:4:"code";s:50:"body { background: red; }";s:6:"backup";s:0:"";}}` | NULL |

---

## Avantages de ce système

1. **Pas de fichier** à gérer sur le disque
2. **Backup automatique** dans le même enregistrement
3. **Sécurisé** : sérialisation PHP native
4. **Centralisé** : toute la config du plugin dans 1 seule entrée BDD

---

## Accès depuis le code

### Lecture

```php
global $conf;
$css_code = $conf['centralAdmin']['custom_css']['code'];
```

### Écriture

```php
$configManager->save(array(
  'custom_css' => array(
    'code' => 'nouveau CSS',
    'backup' => 'ancien CSS'
  )
));
```

---

## 📚 Ressources

### Documentation Externe

- [Documentation Piwigo](https://piwigo.org/doc/)
- [API Piwigo](https://piwigo.org/doc/doku.php?id=dev:api)
- [Smarty Templates](https://www.smarty.net/docs/en/)

### Fichiers Clés à Étudier

```
Pour comprendre :
├── main.inc.php              → Point d'entrée, hooks Piwigo
├── includes/                 → Logique métier
└── config/defaults.php       → Structure données

Pour personnaliser :
├── assets/css/core/          → Styles globaux
├── assets/css/form/          → Interface config
└── sections/*.tpl            → Fragments formulaire

Pour déboguer :
├── assets/js/modules/CA-debug.js  → Module debug
└── admin.tpl                      → Section debug
```

---

## 🎓 Concepts Avancés

### Pattern IIFE (JavaScript)

```javascript
// Immediately Invoked Function Expression
const MyModule = (function() {
    // Scope privé
    let privateVar = 'secret';
    
    function privateMethod() {
        return privateVar;
    }
    
    // API publique
    return {
        publicMethod: function() {
            return privateMethod();
        }
    };
})();

// Utilisation
MyModule.publicMethod();  // OK
MyModule.privateVar;      // undefined (privé)
```

### Fusion Défensive (PHP)

```php
// Préserve nouvelles clés ET anciennes valeurs
$merged = array_replace_recursive($defaults, $current);

// Exemple
$defaults = ['a' => 1, 'b' => ['c' => 2]];
$current = ['b' => ['d' => 3]];
// Résultat : ['a' => 1, 'b' => ['c' => 2, 'd' => 3]]
```

### CSS Variables Scope

```css
/* Déclaration globale */
:root {
    --ca-color: #ff0000;
}

/* Redéfinition locale (scope) */
.dark-theme {
    --ca-color: #00ff00;
}

/* Utilisation avec fallback */
.element {
    color: var(--ca-color, #0000ff);  /* fallback si non défini */
}
```

---

## 🔐 Sécurité

### Validation Entrées

```php
// Dans admin.php
if (isset($_POST['colors'])) {
    foreach ($_POST['colors'] as $scheme => $colors) {
        foreach ($colors as $key => $value) {
            $value = trim($value);
            // Validation couleur hex
            if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $value)) {
                // Rejeter
            }
        }
    }
}
```

### Sanitisation CSS

```php
// Dans CA_CSSGenerator
private function sanitizeColor($color) {
    if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $color)) {
        trigger_error('Couleur invalide: ' . $color, E_USER_NOTICE);
        return '#000000';  // Fallback sécurisé
    }
    return strtoupper($color);
}
```

---

## 📝 Conventions de Code

### Nommage

```
CSS Classes :  .ca-element-name
CSS Variables : --ca-category-name
PHP Classes :   CA_ClassName
PHP Methods :   camelCase
JS Functions :  camelCase
JS Modules :    CAModuleName
Fichiers :      CA-nom-fichier.ext
```

### Commentaires

```php
/**
 * Description fonction
 * 
 * @param string $param Description
 * @return bool Succès
 */
public function myFunction($param) {
    // Commentaire inline
}
```

---

**Cette documentation est maintenue avec le plugin. Contributions bienvenues !**