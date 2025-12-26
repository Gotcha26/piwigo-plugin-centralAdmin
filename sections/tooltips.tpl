<div class="ca-section" data-section="tooltips">
  <div class="ca-section-header">
    <h3 class="ca-section-title">
      <span class="ca-icon">💬</span>
      {'central_admin_tooltips'|@translate}
    </h3>
    <button type="button" class="ca-toggle" aria-expanded="false">
      <span class="ca-chevron">▼</span>
    </button>
  </div>
  
  <div class="ca-section-content" style="display: none;">
    
    {* fade_start *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'fade_start'|@translate}
          <button type="button" class="ca-help" data-tooltip="{'fade_start_tp'|@translate}">ⓘ</button>
        </label>
      </div>
      <div class="ca-field-controls">
        <input type="range" 
               class="ca-slider"
               id="fade_start_range"
               name="layout[fade_start]"
               min="800" max="1600" step="25"
               value="{$centralAdmin.layout.fade_start}"
               data-output="fade_start_value"
               disabled>
        <div class="ca-value-group">
          <input type="number" 
                 class="ca-input-number"
                 id="fade_start_value"
                 min="800" max="1600" step="25"
                 value="{$centralAdmin.layout.fade_start}"
                 disabled>
          <span class="ca-unit">px</span>
        </div>
      </div>
    </div>

    {* infos_main_color *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'infos_main_color'|@translate}
          <button type="button" class="ca-help" data-tooltip="{'infos_main_color_tp'|@translate}">ⓘ</button>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="infos_main_color_picker"
                 value="{$centralAdmin.colors.tooltips.infos_main_color}"
                 disabled>
          <input type="text" 
                 class="ca-color-input"
                 id="infos_main_color_text"
                 name="colors[tooltips][infos_main_color]"
                 value="{$centralAdmin.colors.tooltips.infos_main_color}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7"
                 disabled>
        </div>
      </div>
    </div>

    {* warning_main_color *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'warning_main_color'|@translate}
          <button type="button" class="ca-help" data-tooltip="{'warning_main_color_tp'|@translate}">ⓘ</button>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="warning_main_color_picker"
                 value="{$centralAdmin.colors.tooltips.warning_main_color}"
                 disabled>
          <input type="text" 
                 class="ca-color-input"
                 id="warning_main_color_text"
                 name="colors[tooltips][warning_main_color]"
                 value="{$centralAdmin.colors.tooltips.warning_main_color}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7"
                 disabled>
        </div>
      </div>
    </div>

    {* messages_main_color *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'messages_main_color'|@translate}
          <button type="button" class="ca-help" data-tooltip="{'messages_main_color_tp'|@translate}">ⓘ</button>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="messages_main_color_picker"
                 value="{$centralAdmin.colors.tooltips.messages_main_color}"
                 disabled>
          <input type="text" 
                 class="ca-color-input"
                 id="messages_main_color_text"
                 name="colors[tooltips][messages_main_color]"
                 value="{$centralAdmin.colors.tooltips.messages_main_color}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7"
                 disabled>
        </div>
      </div>
    </div>

    {* error_main_color *}
    <div class="ca-field ca-field-locked">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="true" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔒</span>
        </button>
        <label class="ca-label">
          {'error_main_color'|@translate}
          <button type="button" class="ca-help" data-tooltip="{'error_main_color_tp'|@translate}">ⓘ</button>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="error_main_color_picker"
                 value="{$centralAdmin.colors.tooltips.error_main_color}"
                 disabled>
          <input type="text" 
                 class="ca-color-input"
                 id="error_main_color_text"
                 name="colors[tooltips][error_main_color]"
                 value="{$centralAdmin.colors.tooltips.error_main_color}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7"
                 disabled>
        </div>
      </div>
    </div>

  </div>
</div>