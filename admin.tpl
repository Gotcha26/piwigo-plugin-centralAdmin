{* Variables CSS dynamiques - INJECTION CORRECTE DES VALEURS *}
<style id="central-admin-vars-preview">
:root {
  {* Layout *}
  --ca-layout-admin-width: {$centralAdmin.layout.admin_width}px;
  --ca-layout-menubar-width: {$centralAdmin.layout.menubar_width}px;
  --ca-layout-align-pluginFilter-left: {$centralAdmin.layout.align_pluginFilter_left}px;
  --ca-layout-align-pluginFilter-right: {$centralAdmin.layout.align_pluginFilter_right}px;
  --ca-layout-fade-start: {$centralAdmin.layout.fade_start}px;
  --ca-layout-hide-quick-sync: {if $centralAdmin.layout.hide_quick_sync == '1'}none{else}block{/if};
  
  {* Tooltips (commun) *}
  --ca-color-infos-main-color: {$centralAdmin.colors.tooltips.infos_main_color};
  --ca-color-warning-main-color: {$centralAdmin.colors.tooltips.warning_main_color};
  --ca-color-messages-main-color: {$centralAdmin.colors.tooltips.messages_main_color};
  --ca-color-error-main-color: {$centralAdmin.colors.tooltips.error_main_color};
  
  {* Couleurs du schéma actif (avec modifications utilisateur fusionnées) *}
  {if isset($active_scheme_colors)}
    --ca-color-bg-global: {$active_scheme_colors.bg_global};
    --ca-color-bg-content2: {$active_scheme_colors.bg_content2};
    --ca-color-bg-content1: {$active_scheme_colors.bg_content1};
    --ca-color-bg-content3: {$active_scheme_colors.bg_content3};
  {else}
    {* Fallback si active_scheme_colors n'existe pas *}
    --ca-color-bg-global: {$centralAdmin.colors[$current_scheme].bg_global};
    --ca-color-bg-content2: {$centralAdmin.colors[$current_scheme].bg_content2};
    --ca-color-bg-content1: {$centralAdmin.colors[$current_scheme].bg_content1};
    --ca-color-bg-content3: {$centralAdmin.colors[$current_scheme].bg_content3};
  {/if}
}
</style>

{* CSS du plugin *}
<link rel="stylesheet" href="{$CENTRAL_ADMIN_CSS}">
<link rel="stylesheet" href="{$CENTRAL_ADMIN_REBUILD_CSS}">
<link rel="stylesheet" href="{$CENTRAL_ADMIN_FORM_CSS}">
<link rel="stylesheet" href="{$CENTRAL_ADMIN_THEME_CSS}">

{* Spectrum Color Picker *}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.css">

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

	{* SECTION DEBUG - Accordion replié par défaut *}
	<div class="ca-section" data-section="debug">
	  <div class="ca-section-header">
		<h3 class="ca-section-title">
		  <span class="ca-icon">🐛</span>
		  {'debug_infos_area'|@translate}
		</h3>
		<button type="button" class="ca-toggle" aria-expanded="false">
		  <span class="ca-chevron">▼</span>
		</button>
	  </div>
	  
	  <div class="ca-section-content" style="display: none;">
		<div class="ca-debug-info">
		  
		  {* VERSIONS *}
		  <h4>{'versions'|@translate}</h4>
		  <table class="ca-debug-table">
			<tr>
			  <td><strong>{'plugin_internal_version'|@translate}</strong></td>
			  <td>{$theme_debug.plugin_version}</td>
			</tr>
			<tr>
			  <td><strong>jQuery :</strong></td>
			  <td>{$theme_debug.jquery_version}</td>
			</tr>
			<tr>
			  <td><strong>Smarty :</strong></td>
			  <td>{$theme_debug.smarty_version}</td>
			</tr>
			<tr>
			  <td><strong>Spectrum :</strong></td>
			  <td><span id="spectrum-version">{'verification_'|@translate}</span></td>
			</tr>
		  </table>
		  
		  {* DÉTECTION THÈME PHP *}
		  <h4 style="margin-top: 20px;">{'theme_detection_php'|@translate}</h4>
		  <table class="ca-debug-table">
			<tr>
			  <td><strong>{'detection_method'|@translate}</strong></td>
			  <td><span class="ca-debug-badge ca-badge-info">{$theme_debug.detection_method}</span></td>
			</tr>
			<tr>
			  <td><strong>{'raw_value_userprefs'|@translate}</strong></td>
			  <td><span class="ca-debug-badge ca-badge-warning">{$theme_debug.admin_theme_value}</span></td>
			</tr>
			<tr>
			  <td><strong>{'normalized_value'|@translate}</strong></td>
			  <td>{$theme_debug.normalized}</td>
			</tr>
			<tr>
			  <td><strong>{'theme_applied'|@translate}</strong></td>
			  <td><span class="ca-debug-value">{$theme_debug.current_scheme_returned}</span></td>
			</tr>
			<tr>
			  <td><strong>{'is_roma_check'|@translate}</strong></td>
			  <td>{if $theme_debug.is_roma}✅ Oui{else}❌ Non{/if}</td>
			</tr>
			<tr>
			  <td><strong>{'is_clear_check'|@translate}</strong></td>
			  <td>{if $theme_debug.is_clear}✅ Oui{else}❌ Non{/if}</td>
			</tr>
		  </table>
		  
		  {* DÉTECTION THÈME JS *}
		  <h4 style="margin-top: 20px;">{'theme_detection_js'|@translate}</h4>
		  <table class="ca-debug-table">
			<tr>
			  <td><strong>{'js_detected_scheme'|@translate}</strong></td>
			  <td><span id="js-scheme-value">{'verification_'|@translate}</span></td>
			</tr>
			<tr>
			  <td><strong>{'html_classes'|@translate}</strong></td>
			  <td><code id="html-classes-value">{'verification_'|@translate}</code></td>
			</tr>
			<tr>
			  <td><strong>{'body_classes'|@translate}</strong></td>
			  <td><code id="body-classes-value">{'verification_'|@translate}</code></td>
			</tr>
			<tr>
			  <td><strong>{'body_bgcolor'|@translate}</strong></td>
			  <td><code id="body-bgcolor-value">{'verification_'|@translate}</code></td>
			</tr>
			<tr>
			  <td><strong>{'php_js_concordance'|@translate}</strong></td>
			  <td><span id="concordance-value">{'verification_'|@translate}</span></td>
			</tr>
		  </table>
		  
		  {* INFORMATIONS COMPLÉMENTAIRES *}
		  <h4 style="margin-top: 20px;">{'additional_info'|@translate}</h4>
		  <table class="ca-debug-table">
			<tr>
			  <td><strong>$user['theme'] ({'gallery_theme'|@translate}) :</strong></td>
			  <td><em>{$theme_debug.user_theme_gallery}</em></td>
			</tr>
		  </table>
		  
		  {* FICHIERS CHARGÉS *}
		  <h4 style="margin-top: 20px;">{'files_charged'|@translate}</h4>
		  <ul class="ca-debug-list">
			<li>{'css_principal'|@translate} {$CENTRAL_ADMIN_CSS}</li>
			<li>{'css_rebuild'|@translate} {$CENTRAL_ADMIN_REBUILD_CSS}</li>
			<li>{'css_form'|@translate} {$CENTRAL_ADMIN_FORM_CSS}</li>
			<li>{'css_admin_theme'|@translate} {$CENTRAL_ADMIN_THEME_CSS}</li>
			<li>{'css_spectrum'|@translate} CDN cloudflare</li>
			<li>{'spectrum_js'|@translate} CDN cloudflare (EOP)</li>
			<li>{'js_form'|@translate} {$CENTRAL_ADMIN_FORM_JS}</li>
			<li>{'js_preview'|@translate} {$CENTRAL_ADMIN_PREVIEW_JS}</li>
		  </ul>
		  
		  {* CONSOLE NAVIGATEUR *}
		  <h4 style="margin-top: 20px;">{'browser_consol'|@translate}</h4>
		  <p>{'open_console_f12'|@translate}</p>
		  <ul class="ca-debug-list">
			<li>🔍 PHP Detection (userprefs): {$theme_debug.current_scheme_returned}</li>
			<li>🔍 JS Detection (DOM/CSS): <span id="console-js-detection">{'verification_'|@translate}</span></li>
			<li>✅ PHP et JS concordent : <span id="console-concordance">{'verification_'|@translate}</span></li>
		  </ul>
		</div>
	  </div>
	</div>

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

{* Spectrum JS - Charger APRÈS jQuery mais AVANT nos scripts *}
<script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.js"></script>

{* Scripts du plugin - EN DERNIER *}
<script src="{$CENTRAL_ADMIN_FORM_JS}"></script>
<script src="{$CENTRAL_ADMIN_DEBUG_JS}"></script>
<script src="{$CENTRAL_ADMIN_THEME_DETECTION_JS}"></script>
<script src="{$CENTRAL_ADMIN_PREVIEW_JS}"></script>