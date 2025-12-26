{if isset($CENTRAL_ADMIN_CSS_VARS)}
<style id="central-admin-vars">
:root {
{foreach from=$CENTRAL_ADMIN_CSS_VARS key=var item=value}
  {$var}: {$value};
{/foreach}
}
</style>
{/if}

<link rel="stylesheet" href="{$CENTRAL_ADMIN_CSS}">
<link rel="stylesheet" href="{$CENTRAL_ADMIN_FORM_CSS}">
<link rel="stylesheet" href="{$CENTRAL_ADMIN_THEME_CSS}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.js"></script>

<div class="centralAdmin-container">
  <header class="ca-header">
    <div class="ca-header-main">
      <div class="ca-header-left">
        <h2>{'central_admin'|@translate}</h2>
        <p class="ca-subtitle">{'central_admin_description'|@translate}</p>
      </div>
      <div class="ca-header-right">
        <div class="ca-options-group">
          <label class="ca-option-item">
            <input type="checkbox" id="ca-browser-theme" class="ca-option-checkbox">
            <span class="ca-option-label">Thème du navigateur</span>
          </label>
          <label class="ca-option-item">
            <input type="checkbox" id="ca-single-accordion" class="ca-option-checkbox" checked>
            <span class="ca-option-label">1 seul panneau ouvert</span>
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
    
    {* Section Layout *}
    {include file=$LAYOUT_SECTION_TPL}
    
    {* Section Tooltips *}
    {include file=$TOOLTIPS_SECTION_TPL}
    
    {* Section Couleurs (Clear) *}
    {if $current_scheme == 'clear'}
      {include file=$COLORS_CLEAR_SECTION_TPL}
    {/if}
    
    {* Section Couleurs (Dark) *}
    {if $current_scheme == 'dark'}
      {include file=$COLORS_DARK_SECTION_TPL}
    {/if}

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

{* Chargement du JavaScript *}
<script src="{$CENTRAL_ADMIN_JS}"></script>
<script src="{$CENTRAL_ADMIN_PREVIEW_JS}"></script>