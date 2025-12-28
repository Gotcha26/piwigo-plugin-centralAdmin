<div class="ca-section" data-section="colors-dark">
  <div class="ca-section-header">
    <h3 class="ca-section-title">
      <span class="ca-icon">🌙</span>
      {'central_admin_scheme_dark'|@translate}
    </h3>
    <button type="button" class="ca-toggle" aria-expanded="false">
      <span class="ca-chevron">▼</span>
    </button>
  </div>
  
  <div class="ca-section-content" style="display: none;">
    
    {* bg_global *}
    <div class="ca-field">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="false" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔓</span>
        </button>
        <label class="ca-label">
          {'bg_dark_global'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'bg_dark_global_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="bg_dark_global_picker"
                 value="{$centralAdmin.colors.dark.bg_global}">
          <input type="text" 
                 class="ca-color-input"
                 id="bg_dark_global_text"
                 name="colors[dark][bg_global]"
                 value="{$centralAdmin.colors.dark.bg_global}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7">
        </div>
      </div>
    </div>

    {* bg_content2 *}
    <div class="ca-field">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="false" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔓</span>
        </button>
        <label class="ca-label">
          {'bg_dark_content2'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'bg_dark_content2_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="bg_dark_content2_picker"
                 value="{$centralAdmin.colors.dark.bg_content2}">
          <input type="text" 
                 class="ca-color-input"
                 id="bg_dark_content2_text"
                 name="colors[dark][bg_content2]"
                 value="{$centralAdmin.colors.dark.bg_content2}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7">
        </div>
      </div>
    </div>

    {* bg_content1 *}
    <div class="ca-field">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="false" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔓</span>
        </button>
        <label class="ca-label">
          {'bg_dark_content1'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'bg_dark_content2_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="bg_dark_content1_picker"
                 value="{$centralAdmin.colors.dark.bg_content1}">
          <input type="text" 
                 class="ca-color-input"
                 id="bg_dark_content1_text"
                 name="colors[dark][bg_content1]"
                 value="{$centralAdmin.colors.dark.bg_content1}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7">
        </div>
      </div>
    </div>

    {* bg_content3 *}
    <div class="ca-field">
      <div class="ca-field-header">
        <button type="button" class="ca-lock" data-locked="false" title="{'central_admin_locked'|@translate}">
          <span class="ca-lock-icon">🔓</span>
        </button>
        <label class="ca-label">
          {'bg_dark_content3'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">
              ⓘ
            </button>
            <span class="help-tooltip">{'bg_dark_content2_tp'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls ca-field-controls-color">
        <div class="ca-color-picker-wrapper">
          <input type="color" 
                 class="ca-color-picker"
                 id="bg_dark_content3_picker"
                 value="{$centralAdmin.colors.dark.bg_content3}">
          <input type="text" 
                 class="ca-color-input"
                 id="bg_dark_content3_text"
                 name="colors[dark][bg_content3]"
                 value="{$centralAdmin.colors.dark.bg_content3}"
                 pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                 maxlength="7">
        </div>
      </div>
    </div>

  </div>
</div>