{* ================================================
   CENTRALADMIN - TEMPLATE PRINCIPAL
   Version: 3.0.0
   ================================================ *}

{* Variables CSS dynamiques - Injection *}
<style id="central-admin-vars-preview">
{$dynamic_css}
</style>

{* DEBUG : Vérifier l'injection *}
<script>
console.log('[CentralAdmin] Style tag chargé:', document.getElementById('central-admin-vars-preview') ? 'OUI' : 'NON');
if (document.getElementById('central-admin-vars-preview')) {
  console.log('[CentralAdmin] Contenu CSS initial:', document.getElementById('central-admin-vars-preview').textContent.substring(0, 200));
}
</script>

{* === CSS CORE === *}
<link rel="stylesheet" href="{$CA_ADMIN_LAYOUT_CSS}">
<link rel="stylesheet" href="{$CA_ADMIN_OVERRIDE_CSS}">
<link rel="stylesheet" href="{$CA_COLORS_UNIFIED_CSS}">

{* === CSS FORM === *}
<link rel="stylesheet" href="{$CA_FORM_BASE_CSS}">
<link rel="stylesheet" href="{$CA_FORM_COMPONENTS_CSS}">
<link rel="stylesheet" href="{$CA_FORM_THEMES_CSS}">

{* === CSS MODULES === *}
<link rel="stylesheet" href="{$CA_DEBUG_CSS}">
<link rel="stylesheet" href="{$CA_MODAL_CSS}">

<div class="centralAdmin-container">
  
  <header class="ca-header">
    <div class="ca-header-main">
      <div class="ca-header-left">
        <h2>{'central_admin'|@translate} <small style="color: #999; font-size: 0.6em;">v{$theme_debug.plugin_version}</small></h2>
        <p class="ca-subtitle">{'central_admin_description'|@translate}</p>
      </div>
      <div class="ca-header-right">
        <div class="ca-options-group">
          <div class="ca-option-info">
            <span class="ca-option-label-info">{'actual_piwigo_admin_theme'|@translate}</span>
            <span class="ca-option-value">{$current_scheme|upper}</span>
          </div>
          <label class="ca-option-item">
            <input type="checkbox" id="ca-browser-theme" class="ca-option-checkbox">
            <span class="ca-option-label">{'preference_browser_scheme'|@translate}</span>
          </label>
          <label class="ca-option-item">
            <input type="checkbox" id="ca-single-accordion" class="ca-option-checkbox" checked>
            <span class="ca-option-label">{'accordion_choice'|@translate}</span>
          </label>
        </div>
      </div>
    </div>
  </header>

  {if isset($page.infos)}
  <div class="ca-notification ca-notification-success">
    {foreach from=$page.infos item=info}
      <p>{$info}</p>
    {/foreach}
  </div>
  {/if}

  {if isset($page.errors)}
  <div class="ca-notification ca-notification-error">
    {foreach from=$page.errors item=error}
      <p>{$error}</p>
    {/foreach}
  </div>
  {/if}

  <form method="post" class="ca-form" id="centralAdminForm">
    
    {* 1. Section Général (layout simplifié) *}
    {include file=$A01_GENERAL_TPL}
    
    {* 2. Section Couleurs du Thème (clear & dark unifiés) *}
    {include file=$A02_THEME_COLORS_TPL}
    
    {* 3. Section Couleurs des Messages (tooltips unifiés) *}
    {include file=$A03_EIW_COLORS_TPL}
    
    {* 4. Section Paramètres Avancés *}
    {include file=$A04_ADVANCED_PARAMS_SECTION_TPL}

    {* 5. Section Debug (nouveau fichier séparé) *}
    {include file=$A05_DEBUG_SECTION_TPL}
    
    {* Lien crédits *}
    <div style="text-align: right; margin-bottom: 10px; padding-right: 5px;">
      <a href="#" id="ca-credits-link" style="color: #999; font-size: 13px; text-decoration: none;">
        {'credits'|@translate} : Gotcha
      </a>
    </div>

    <div class="ca-actions">
      <button type="submit" name="save" class="ca-btn ca-btn-primary">
        <span class="ca-icon">💾</span>
        {'save'|@translate}
      </button>
      <button type="submit" name="reset" class="ca-btn ca-btn-secondary">
        <span class="ca-icon">♻</span>
        {'reset'|@translate}
      </button>
    </div>
  </form>
  
</div>

{* === JAVASCRIPT - Ordre d'exécution important === *}

{* 1. Core - Détection thème (doit être en premier) [OBSOLETE sur DOM, PHP était la solution] *}

{* 2. Modules - Debug (avant form pour être disponible) *}
<script src="{$CA_DEBUG_JS}"></script>

{* 3. Form - Contrôles et couleurs *}
<script src="{$CA_FORM_CONTROLS_JS}"></script>
<script src="{$CA_FORM_COLORS_JS}"></script>
<script src="{$CA_FORM_PREVIEW_JS}"></script>

{* 4. Modules - Modal *}
<script src="{$CA_MODAL_JS}"></script>

{* 5. Core - Initialisation (en dernier pour coordonner tout) *}
<script src="{$CA_INIT_JS}"></script>