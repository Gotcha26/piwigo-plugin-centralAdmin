{* ================================================
   SECTION PARAMÈTRES AVANCÉS
   Paramètres techniques de mise en page
   ================================================ *}

<div class="ca-section" data-section="advanced-params">
  <div class="ca-section-header">
    <h3 class="ca-section-title">
      <span class="ca-icon">⚙️</span>
      {'central_admin_advanced_params'|@translate}
    </h3>
    <button type="button" class="ca-toggle" aria-expanded="false">
      <span class="ca-chevron">▼</span>
    </button>
  </div>
  
  <div class="ca-section-content" style="display: none;">
    
    {* Avertissement utilisateurs avancés *}
    <div class="ca-advanced-warning">
      <span class="ca-warning-icon">⚠️</span>
      <p>{'advanced_params_warning'|@translate}</p>
    </div>

    {* Menubar width *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'menubar_width'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'menubar_width_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls">
        <input type="range" 
               class="ca-slider"
               id="menubar_width_range"
               name="layout[menubar_width]"
               min="15" max="250" step="1"
               value="{$centralAdmin.layout.menubar_width}"
               data-output="menubar_width_value"
               disabled>
        <div class="ca-value-group">
          <input type="number" 
                 class="ca-input-number"
                 id="menubar_width_value"
                 min="15" max="250" step="1"
                 value="{$centralAdmin.layout.menubar_width}"
                 disabled>
          <span class="ca-unit">px</span>
        </div>
      </div>
    </div>

    {* align_pluginFilter_left *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'align_pluginFilter_left'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'align_pluginFilter_left_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls">
        <input type="range" 
               class="ca-slider"
               id="align_pluginFilter_left_range"
               name="layout[align_pluginFilter_left]"
               min="15" max="250" step="1"
               value="{$centralAdmin.layout.align_pluginFilter_left}"
               data-output="align_pluginFilter_left_value"
               disabled>
        <div class="ca-value-group">
          <input type="number" 
                 class="ca-input-number"
                 id="align_pluginFilter_left_value"
                 min="15" max="250" step="1"
                 value="{$centralAdmin.layout.align_pluginFilter_left}"
                 disabled>
          <span class="ca-unit">px</span>
        </div>
      </div>
    </div>

    {* align_pluginFilter_right *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'align_pluginFilter_right'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'align_pluginFilter_right_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls">
        <input type="range" 
               class="ca-slider"
               id="align_pluginFilter_right_range"
               name="layout[align_pluginFilter_right]"
               min="15" max="250" step="1"
               value="{$centralAdmin.layout.align_pluginFilter_right}"
               data-output="align_pluginFilter_right_value"
               disabled>
        <div class="ca-value-group">
          <input type="number" 
                 class="ca-input-number"
                 id="align_pluginFilter_right_value"
                 min="15" max="250" step="1"
                 value="{$centralAdmin.layout.align_pluginFilter_right}"
                 disabled>
          <span class="ca-unit">px</span>
        </div>
      </div>
    </div>

  </div>
</div>