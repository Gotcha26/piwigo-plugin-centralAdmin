{* ================================================
   SECTION CSS PERSONNALISÉ
   ================================================ *}

<div class="ca-section" data-section="custom-css" data-section-id="custom-css">
  <div class="ca-section-header">
    <h3 class="ca-section-title">
      <span class="ca-icon">💻</span>
      {'custom_css_section_title'|@translate}
    </h3>
    <button type="button" class="ca-toggle" aria-expanded="false">
      <span class="ca-chevron">▼</span>
    </button>
  </div>
  
  <div class="ca-section-content" style="display: none;">
    
    {* Avertissement *}
    <div class="ca-advanced-warning">
      <span class="ca-warning-icon">⚠️</span>
      <p>{'custom_css_warning'|@translate}</p>
    </div>

    {* Actions backup/restore *}
    <div style="margin-bottom: 15px; display: flex; gap: 10px; justify-content: flex-end;">
      <button type="submit" name="restore_css" class="ca-btn ca-btn-secondary" style="font-size: 13px; padding: 8px 16px;">
        <span class="ca-icon">⏮️</span>
        {'custom_css_restore'|@translate}
      </button>
    </div>

    {* Zone de saisie *}
    <div class="ca-field">
      <div class="ca-field-header">
        <label class="ca-label">
          {'custom_css_label'|@translate}
          <span class="ca-help-container">
            <button type="button" class="ca-help">ⓘ</button>
            <span class="help-tooltip">{'custom_css_help'|@translate}</span>
          </span>
        </label>
      </div>
      <div class="ca-field-controls" style="display: block;">
        <textarea 
          name="custom_css[code]" 
          id="custom_css_code"
          rows="15"
          style="width: 98%; font-family: 'Courier New', monospace; font-size: 13px; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; resize: vertical;"
          placeholder="/* {'custom_css_placeholder'|@translate} */"
        >{$centralAdmin.custom_css.code}</textarea>
      </div>
    </div>

  </div>
</div>