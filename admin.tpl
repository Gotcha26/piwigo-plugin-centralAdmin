{* Variables CSS dynamiques *}
{if isset($CENTRAL_ADMIN_CSS_VARS)}
<style id="central-admin-vars">
:root {
{foreach from=$CENTRAL_ADMIN_CSS_VARS key=var item=value}
  {$var}: {$value};
{/foreach}
}
</style>
{/if}

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
        <h2>{'central_admin'|@translate}</h2>
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
            <td><span id="spectrum-version">{'verification_'|@translate}Vérification...</span></td>
          </tr>
        </table>
        
        <h4>{'theme_detection'|@translate}</h4>
        <table class="ca-debug-table">
          <tr>
            <td><strong>{'theme_applied'|@translate}</strong></td>
            <td><span class="ca-debug-value">{$theme_debug.theme_final}</span></td>
          </tr>
          <tr>
            <td><strong>{'method_used'|@translate}</strong></td>
            <td>{$theme_debug.methode_utilisee}</td>
          </tr>
          <tr>
            <td><strong>$user['theme'] :</strong></td>
            <td>{$theme_debug.user_theme}</td>
          </tr>
          {if isset($theme_debug.admin_theme_brut)}
          <tr>
            <td><strong>{'raw_admin_theme'|@translate}</strong></td>
            <td>{$theme_debug.admin_theme_brut}</td>
          </tr>
          {/if}
        </table>
        
        <h4 style="margin-top: 20px;">{'files_charged'|@translate}</h4>
        <ul class="ca-debug-list">
          <li>{'css_principal'|@translate} {$CENTRAL_ADMIN_CSS}</li>
          <li>{'css_rebuild'|@translate} {$CENTRAL_ADMIN_REBUILD_CSS}</li>
          <li>{'css_form'|@translate} {$CENTRAL_ADMIN_FORM_CSS}</li>
          <li>{'css_admin_theme'|@translate} {$CENTRAL_ADMIN_THEME_CSS}</li>
          <li>{'css_spectrum'|@translate} CDN cloudflare</li>
		  <li>{'loading_spectrum_eop'|@translate}</li>
          <li>{'spectrum_js'|@translate} CDN cloudflare</li>
          <li>{'js_form'|@translate} {$CENTRAL_ADMIN_FORM_JS}</li>
          <li>{'js_preview'|@translate} {$CENTRAL_ADMIN_PREVIEW_JS}</li>
        </ul>
        
        <h4 style="margin-top: 20px;">{'browser_consol'|@translate}</h4>
        <p>{'messages_verification'|@translate}</p>
        <ul class="ca-debug-list">
          <li>[CentralAdmin] {'detected_piwigo_admin_theme'|@translate} {$theme_debug.theme_final}</li>
          <li>[CentralAdmin] user[theme]: {$theme_debug.user_theme}</li>
          <li>[CentralAdmin] {'jquery_version'|@translate} {$theme_debug.jquery_version}</li>
          <li>[CentralAdmin] {'spectrum_availability'|@translate} true</li>
          <li>[CentralAdmin] {'initialisation_colorpicker'|@translate} X</li>
        </ul>
      </div>
    </div>
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
// <script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.js"></script>

{* Vérification du chargement *}																							 
<script>
// Détecter la version de Spectrum
(function() {
  if (typeof jQuery !== 'undefined' && typeof jQuery.fn.spectrum !== 'undefined') {
    var spectrumEl = document.getElementById('spectrum-version');
    if (spectrumEl) {
      spectrumEl.textContent = '1.8.1 (disponible)';
      spectrumEl.style.color = '#28a745';
    }
  } else {
    setTimeout(function() {
      var spectrumEl = document.getElementById('spectrum-version');
      if (spectrumEl) {
        if (typeof jQuery !== 'undefined' && typeof jQuery.fn.spectrum !== 'undefined') {
          spectrumEl.textContent = '1.8.1 (chargé avec délai)';
          spectrumEl.style.color = '#ffa500';
        } else {
          spectrumEl.textContent = 'Non disponible';
          spectrumEl.style.color = '#dc3545';
        }
      }
    }, 500);
  }
})();
</script>

{* Scripts du plugin - EN DERNIER *}
<script src="{$CENTRAL_ADMIN_FORM_JS}"></script>
<script src="{$CENTRAL_ADMIN_PREVIEW_JS}"></script>