<link rel="stylesheet" href="{$CENTRAL_ADMIN_CSS}">

<h2>{'central_admin'|@translate} – {$SCHEME|capitalize}</h2>

{if isset($page.infos)}
<div class="infos">
  {foreach from=$page.infos item=info}
    <p>{$info}</p>
  {/foreach}
</div>
{/if}

<form method="post" class="centralAdminForm">

<h3>📐 {'layout_settings'|@translate}</h3>
{foreach from=$centralAdmin.layout key=key item=value}
<div class="field">
  <label>{$key}</label>
  <input type="range"
         min="0" max="2000" step="5"
         name="layout[{$key}]"
         value="{$value}"
         oninput="this.nextElementSibling.value=this.value">
  <output>{$value}</output> px
</div>
{/foreach}

{if $SCHEME}
<h3>🎨 {'color_settings'|@translate} ({$SCHEME})</h3>
{foreach from=$centralAdmin.colors[$SCHEME] key=key item=value}
<div class="field">
  <label>{$key}</label>
  <input type="color"
         name="colors[{$SCHEME}][{$key}]"
         value="{$value}">
</div>
{/foreach}
{/if}

<div class="actions">
  <input type="submit" name="save" value="💾 {'save'|@translate}">
  <button type="submit" name="reset" class="reset">♻ {'reset'|@translate}</button>
</div>

</form>