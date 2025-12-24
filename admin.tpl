<link rel="stylesheet" href="{$CENTRAL_ADMIN_CSS}">

<h2>{'central_admin'|@translate}</h2>

{if isset($page.infos)}
<div class="infos">
  {foreach from=$page.infos item=info}
    <p>{$info}</p>
  {/foreach}
</div>
{/if}

<form method="post" class="centralAdminForm">

{* ===================================================== *}
{* PARAMÈTRES COMMUNS — LAYOUT *}
{* ===================================================== *}

<h3>📐 {'central_admin_layout'|@translate}</h3>

<div class="field">
  <input type="checkbox"
         class="lock-toggle"
         title="{'central_admin_unlocked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'admin_width'|@translate}
    <span class="param-help"
          title="{'admin_width_tp'|@translate}"
          aria-label="{'admin_width_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[admin_width]"
         min="1024" max="1800" step="10"
         value="{$centralAdmin.layout.admin_width}"
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.admin_width}</output>
    <span class="unit">px</span>
  </div>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'admin_sidebar'|@translate}
    <span class="param-help"
          title="{'admin_sidebar_tp'|@translate}"
          aria-label="{'admin_sidebar_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[admin_sidebar]"
         min="15" max="250" step="1"
         value="{$centralAdmin.layout.admin_sidebar}"
         disabled
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.admin_sidebar}</output>
    <span class="unit">px</span>
  </div>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'align_pluginFilter_left'|@translate}
    <span class="param-help"
          title="{'align_pluginFilter_left_tp'|@translate}"
          aria-label="{'align_pluginFilter_left_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[align_pluginFilter_left]"
         min="15" max="250" step="1"
         value="{$centralAdmin.layout.align_pluginFilter_left}"
         disabled
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.align_pluginFilter_left}</output>
    <span class="unit">px</span>
  </div>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'align_pluginFilter_right'|@translate}
    <span class="param-help"
          title="{'align_pluginFilter_right_tp'|@translate}"
          aria-label="{'align_pluginFilter_right_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[align_pluginFilter_right]"
         min="15" max="250" step="1"
         value="{$centralAdmin.layout.align_pluginFilter_right}"
         disabled
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.align_pluginFilter_right}</output>
    <span class="unit">px</span>
  </div>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'alignsearch_tag_left'|@translate}
    <span class="param-help"
          title="{'alignsearch_tag_left_tp'|@translate}"
          aria-label="{'alignsearch_tag_left_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[alignsearch_tag_left]"
         min="15" max="250" step="1"
         value="{$centralAdmin.layout.alignsearch_tag_left}"
         disabled
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.alignsearch_tag_left}</output>
    <span class="unit">px</span>
  </div>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'alignsearch_tag_right'|@translate}
    <span class="param-help"
          title="{'alignsearch_tag_right_tp'|@translate}"
          aria-label="{'alignsearch_tag_right_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[alignsearch_tag_right]"
         min="15" max="250" step="5"
         value="{$centralAdmin.layout.alignsearch_tag_right}"
         disabled
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.alignsearch_tag_right}</output>
    <span class="unit">px</span>
  </div>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'footer_width'|@translate}
    <span class="param-help"
          title="{'footer_width_tp'|@translate}"
          aria-label="{'footer_width_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[footer_width]"
         min="15" max="250" step="1"
         value="{$centralAdmin.layout.footer_width}"
         disabled
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.footer_width}</output>
    <span class="unit">px</span>
  </div>
</div>

{* ===================================================== *}
{* PARAMÈTRES COMMUNS — TOOLTIPS *}
{* ===================================================== *}

<h3>💬 {'central_admin_tooltips'|@translate}</h3>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'fade_start'|@translate}
    <span class="param-help"
          title="{'fade_start_tp'|@translate}"
          aria-label="{'fade_start_tp'|@translate}">
      ⓘ
    </span>
  </label>
  <input type="range"
         name="layout[fade_start]"
         min="800" max="1600" step="25"
         value="{$centralAdmin.layout.fade_start}"
         disabled
         oninput="this.nextElementSibling.value=this.value">
  <div class="value">
    <output>{$centralAdmin.layout.fade_start}</output>
    <span class="unit">px</span>
  </div>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'infos_main_color'|@translate}
    <span class="param-help"
          title="{'infos_main_color_tp'|@translate}"
          aria-label="{'infos_main_color_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[tooltips][infos_main_color]"
         value="{$centralAdmin.colors.tooltips.infos_main_color}"
         disabled>
  <span></span>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'warning_main_color'|@translate}
    <span class="param-help"
          title="{'warning_main_color_tp'|@translate}"
          aria-label="{'warning_main_color_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[tooltips][warning_main_color]"
         value="{$centralAdmin.colors.tooltips.warning_main_color}"
         disabled>
  <span></span>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'messages_main_color'|@translate}
    <span class="param-help"
          title="{'messages_main_color_tp'|@translate}"
          aria-label="{'messages_main_color_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[tooltips][messages_main_color]"
         value="{$centralAdmin.colors.tooltips.messages_main_color}"
         disabled>
  <span></span>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'error_main_color'|@translate}
    <span class="param-help"
          title="{'error_main_color_tp'|@translate}"
          aria-label="{'error_main_color_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[tooltips][error_main_color]"
         value="{$centralAdmin.colors.tooltips.error_main_color}"
         disabled>
  <span></span>
</div>

{* ===================================================== *}
{* SCHÉMA CLEAR *}
{* ===================================================== *}

<h3>☀️ {'central_admin_scheme_clear'|@translate}</h3>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'bg_clear_global'|@translate}
    <span class="param-help"
          title="{'bg_clear_global_tp'|@translate}"
          aria-label="{'bg_clear_global_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[clear][bg_global]"
         value="{$centralAdmin.colors.clear.bg_global}"
         disabled>
  <span></span>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'bg_clear_content1'|@translate}
    <span class="param-help"
          title="{'bg_clear_content1_tp'|@translate}"
          aria-label="{'bg_clear_content1_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[clear][bg_content1]"
         value="{$centralAdmin.colors.clear.bg_content1}"
         disabled>
  <span></span>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'bg_clear_content2'|@translate}
    <span class="param-help"
          title="{'bg_clear_content2_tp'|@translate}"
          aria-label="{'bg_clear_content2_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[clear][bg_content2]"
         value="{$centralAdmin.colors.clear.bg_content2}"
         disabled>
  <span></span>
</div>

{* ===================================================== *}
{* SCHÉMA DARK *}
{* ===================================================== *}

<h3>🌙 {'central_admin_scheme_dark'|@translate}</h3>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'bg_dark_global'|@translate}
    <span class="param-help"
          title="{'bg_dark_global_tp'|@translate}"
          aria-label="{'bg_dark_global_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[dark][bg_global]"
         value="{$centralAdmin.colors.dark.bg_global}"
         disabled>
  <span></span>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'bg_dark_content1'|@translate}
    <span class="param-help"
          title="{'bg_dark_content1_tp'|@translate}"
          aria-label="{'bg_dark_content1_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[dark][bg_content1]"
         value="{$centralAdmin.colors.dark.bg_content1}"
         disabled>
  <span></span>
</div>

<div class="field locked">
  <input type="checkbox"
         class="lock-toggle"
         checked
         title="{'central_admin_locked'|@translate}"
         data-tooltip-locked="{'central_admin_locked'|@translate}"
         data-tooltip-unlocked="{'central_admin_unlocked'|@translate}">
  <label>
    {'bg_dark_content2'|@translate}
    <span class="param-help"
          title="{'bg_dark_content2_tp'|@translate}"
          aria-label="{'bg_dark_content2_tp'|@translate}">ⓘ</span>
  </label>
  <input type="color"
         name="colors[dark][bg_content2]"
         value="{$centralAdmin.colors.dark.bg_content2}"
         disabled>
  <span></span>
</div>

<div class="actions">
  <input type="submit" name="save" value="💾 {'save'|@translate}">
  <button type="submit" name="reset" class="reset">♻ {'reset'|@translate}</button>
</div>

{* ===================================================== *}
{* JS — gestion des verrous + tooltips dynamiques *}
{* ===================================================== *}

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lock-toggle').forEach(toggle => {
    const field = toggle.closest('.field');
    const input = field.querySelector('input:not(.lock-toggle)');

    const updateState = () => {
      toggle.title = toggle.checked
        ? toggle.dataset.tooltipLocked
        : toggle.dataset.tooltipUnlocked;

      toggle.checked
        ? (field.classList.add('locked'), input.disabled = true)
        : (field.classList.remove('locked'), input.disabled = false);
    };

    toggle.addEventListener('change', updateState);
    updateState();
  });
});
</script>
