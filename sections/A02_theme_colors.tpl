{* ================================================
   SECTION COULEURS UNIFIÉE - CLEAR & DARK
   Affichage côte à côte des deux thèmes
   ================================================ *}

<div class="ca-section" data-section="colors-unified" data-section-id="theme-colors" data-accordion-group="ca-global">
  <div class="ca-section-header">
    <h3 class="ca-section-title">
      <span class="ca-icon">🎨</span>
      {'central_admin_colors_by_theme'|@translate}
    </h3>
    <button type="button" class="ca-toggle" aria-expanded="false">
      <span class="ca-chevron">▼</span>
    </button>
  </div>
  
  <div class="ca-section-content" style="display: none;">
    
    {* Info thème actif *}
    <div class="ca-theme-info">
      <p>{'active_theme_info'|@translate} <strong class="ca-theme-badge ca-theme-badge-{$current_scheme}">{$current_scheme|upper}</strong></p>
      <p class="ca-theme-note">{'theme_preview_note'|@translate}</p>
    </div>

    {* Container grille 2 colonnes *}
    <div class="ca-colors-grid">
      
      {* ========================================
         COLONNE GAUCHE - THÈME CLAIR
         ======================================== *}
      <div class="ca-theme-column ca-theme-clear {if $current_scheme == 'clear'}ca-theme-active{/if}">
        
        {* En-tête colonne *}
        <div class="ca-theme-column-header">
          <span class="ca-icon">☀️</span>
          <h4>{'theme_clear_title'|@translate}</h4>
          {if $current_scheme == 'clear'}
            <span class="ca-active-badge">{'active'|@translate}</span>
          {/if}
        </div>

        {* Champs couleurs Clear *}
        
        {* bg_global *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_global'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_clear_global_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_clear_global_picker"
                     value="{$centralAdmin.colors.clear.bg_global}"
                     {if $current_scheme != 'clear'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_clear_global_text"
                     name="colors[clear][bg_global]"
                     value="{$centralAdmin.colors.clear.bg_global}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'clear'}disabled{/if}>
            </div>
          </div>
        </div>

        {* bg_content2 *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_content2'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_clear_content2_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_clear_content2_picker"
                     value="{$centralAdmin.colors.clear.bg_content2}"
                     {if $current_scheme != 'clear'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_clear_content2_text"
                     name="colors[clear][bg_content2]"
                     value="{$centralAdmin.colors.clear.bg_content2}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'clear'}disabled{/if}>
            </div>
          </div>
        </div>

        {* bg_content1 *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_content1'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_clear_content1_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_clear_content1_picker"
                     value="{$centralAdmin.colors.clear.bg_content1}"
                     {if $current_scheme != 'clear'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_clear_content1_text"
                     name="colors[clear][bg_content1]"
                     value="{$centralAdmin.colors.clear.bg_content1}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'clear'}disabled{/if}>
            </div>
          </div>
        </div>

        {* bg_content3 *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_content3'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_clear_content3_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_clear_content3_picker"
                     value="{$centralAdmin.colors.clear.bg_content3}"
                     {if $current_scheme != 'clear'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_clear_content3_text"
                     name="colors[clear][bg_content3]"
                     value="{$centralAdmin.colors.clear.bg_content3}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'clear'}disabled{/if}>
            </div>
          </div>
        </div>

      </div>

      {* ========================================
         COLONNE DROITE - THÈME SOMBRE
         ======================================== *}
      <div class="ca-theme-column ca-theme-dark {if $current_scheme == 'dark'}ca-theme-active{/if}">
        
        {* En-tête colonne *}
        <div class="ca-theme-column-header">
          <span class="ca-icon">🌙</span>
          <h4>{'theme_dark_title'|@translate}</h4>
          {if $current_scheme == 'dark'}
            <span class="ca-active-badge">{'active'|@translate}</span>
          {/if}
        </div>

        {* Champs couleurs Dark *}
        
        {* bg_global *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_global'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_dark_global_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_dark_global_picker"
                     value="{$centralAdmin.colors.dark.bg_global}"
                     {if $current_scheme != 'dark'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_dark_global_text"
                     name="colors[dark][bg_global]"
                     value="{$centralAdmin.colors.dark.bg_global}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'dark'}disabled{/if}>
            </div>
          </div>
        </div>

        {* bg_content2 *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_content2'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_dark_content2_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_dark_content2_picker"
                     value="{$centralAdmin.colors.dark.bg_content2}"
                     {if $current_scheme != 'dark'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_dark_content2_text"
                     name="colors[dark][bg_content2]"
                     value="{$centralAdmin.colors.dark.bg_content2}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'dark'}disabled{/if}>
            </div>
          </div>
        </div>

        {* bg_content1 *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_content1'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_dark_content1_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_dark_content1_picker"
                     value="{$centralAdmin.colors.dark.bg_content1}"
                     {if $current_scheme != 'dark'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_dark_content1_text"
                     name="colors[dark][bg_content1]"
                     value="{$centralAdmin.colors.dark.bg_content1}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'dark'}disabled{/if}>
            </div>
          </div>
        </div>

        {* bg_content3 *}
        <div class="ca-field">
          <div class="ca-field-header">
            <label class="ca-label">
              {'bg_content3'|@translate}
              <span class="ca-help-container">
                <button type="button" class="ca-help">ⓘ</button>
                <span class="help-tooltip">{'bg_dark_content3_tp'|@translate}</span>
              </span>
            </label>
          </div>
          <div class="ca-field-controls ca-field-controls-color">
            <div class="ca-color-picker-wrapper">
              <input type="color" 
                     class="ca-color-picker"
                     id="bg_dark_content3_picker"
                     value="{$centralAdmin.colors.dark.bg_content3}"
                     {if $current_scheme != 'dark'}disabled{/if}>
              <input type="text" 
                     class="ca-color-input"
                     id="bg_dark_content3_text"
                     name="colors[dark][bg_content3]"
                     value="{$centralAdmin.colors.dark.bg_content3}"
                     pattern="^#[0-9A-Fa-f]{literal}{{/literal}6{literal}}{/literal}$"
                     maxlength="7"
                     {if $current_scheme != 'dark'}disabled{/if}>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</div>