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

<div class="centralAdmin-container">
  <header class="ca-header">
    <h2>{'central_admin'|@translate}</h2>
    <p class="ca-subtitle">{'central_admin_description'|@translate}</p>
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