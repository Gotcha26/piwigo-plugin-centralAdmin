{* ================================================
   SECTION LAYOUT SIMPLIFIÉE - Général
   Paramètres principaux uniquement
   ================================================ *}

<div class="ca-section ca-section-active" data-section="layout">
  <div class="ca-section-header">
    <h3 class="ca-section-title">
      <span class="ca-icon">📐</span>
      {'central_admin_general'|@translate}
    </h3>
    <button type="button" class="ca-toggle" aria-expanded="true">
      <span class="ca-chevron">▼</span>
    </button>
  </div>
  
  <div class="ca-section-content">
    
    {* Largeur admin *}
    <div class="ca-field">
      <div class="ca-field-header">
        <label class="ca-label">
          {'admin_width'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'admin_width_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls">
        <input type="range" 
               class="ca-slider"
               id="admin_width_range"
               name="layout[admin_width]"
               min="1024" max="1800" step="1"
               value="{$centralAdmin.layout.admin_width}"
               data-output="admin_width_value">
        <div class="ca-value-group">
          <input type="number" 
                 class="ca-input-number"
                 id="admin_width_value"
                 min="1024" max="1800" step="1"
                 value="{$centralAdmin.layout.admin_width}">
          <span class="ca-unit">px</span>
        </div>
      </div>
    </div>

    {* Option : masquer bouton sync rapide *}
    <div class="ca-field ca-field-checkbox">
      <div class="ca-field-header">
        <label class="ca-label">
          {'hide_quick_sync_button'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help" data-tooltip="{'hide_quick_sync_button_tp'|@translate}">
              ⓘ
            </button>
            <span class="help-tooltip">{'hide_quick_sync_button_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls">
        <label class="ca-switch">
          <input type="checkbox" 
                 name="layout[hide_quick_sync]"
                 value="1"
                 {if isset($centralAdmin.layout.hide_quick_sync) && $centralAdmin.layout.hide_quick_sync == '1'}checked{/if}>
          <span class="ca-switch-slider"></span>
        </label>
      </div>
    </div>

  </div>
</div>