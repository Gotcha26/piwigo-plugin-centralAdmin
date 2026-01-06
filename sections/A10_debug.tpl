{* ================================================
   SECTION DEBUG SIMPLIFIÉE v3.1.0
   ================================================ *}

<div class="ca-section" data-section="debug" data-section-id="debug">
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
      
      {* ========================================
        SECTION 1 : VERSIONS DES COMPOSANTS
        ======================================== *}
      <h4>{'versions'|@translate}</h4>
      <table class="ca-debug-table">
        <tr>
          <td><strong>{'plugin_internal_version'|@translate}</strong></td>
          <td>{$theme_debug.plugin_version}</td>
        </tr>
        <tr>
          <td><strong>jQuery :</strong></td>
          <td><span id="jquery-version">{'verification_'|@translate}</span></td>
        </tr>
        <tr>
          <td><strong>jQuery Confirm :</strong></td>
          <td><span id="jquery-confirm-status">{'verification_'|@translate}</span></td>
        </tr>
        <tr>
          <td><strong>Smarty :</strong></td>
          <td>{$theme_debug.smarty_version}</td>
        </tr>
      </table>
      
      {* ========================================
        SECTION 2 : DÉTECTION THÈME PHP
        ======================================== *}
      <h4 style="margin-top: 20px;">{'theme_detection_php'|@translate}</h4>
      <table class="ca-debug-table">
        <tr>
          <td>{'debug_detection_method'|@translate}</td>
          <td><span class="ca-debug-value">{$theme_debug.detection_method}</span></td>
        </tr>
        <tr>
          <td>{'debug_piwigo_theme'|@translate}</td>
          <td><span class="ca-debug-value">{$theme_debug.admin_theme_value}</span></td>
        </tr>
        <tr>
          <td>{'debug_normalized'|@translate}</td>
          <td>{$theme_debug.normalized}</td>
        </tr>
        <tr>
          <td>{'debug_final_theme'|@translate}</td>
          <td><span class="ca-debug-value">{$theme_debug.theme_final|upper}</span></td>
        </tr>
      </table>
      
      {* ========================================
        SECTION 3 : CONSOLE NAVIGATEUR
        ======================================== *}
      <h4 style="margin-top: 20px;">{'browser_console'|@translate}</h4>
      <p style="color: #666; font-size: 13px; line-height: 1.6;">
        {'open_console_f12'|@translate}
      </p>
      
      {* ========================================
        SECTION 4 : DEMANDE D'AIDE
        ======================================== *}
      <h4 style="margin-top: 20px;">{'help_section_title'|@translate}</h4>
      <div class="ca-help-links">
        <p style="margin-bottom: 15px; color: #666;">{'help_section_description'|@translate}</p>
        <ul class="ca-debug-list" style="list-style: none; padding-left: 0;">
          <li style="margin-bottom: 10px;">
            <a href="https://github.com/Gotcha26/centralAdmin/wiki" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 600;">
              📚 {'help_link_wiki'|@translate}
            </a>
          </li>
          <li style="margin-bottom: 10px;">
            <a href="https://github.com/Gotcha26/centralAdmin/discussions" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 600;">
              💬 {'help_link_forum'|@translate}
            </a>
          </li>
          <li style="margin-bottom: 10px;">
            <a href="https://github.com/Gotcha26/centralAdmin/issues" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 600;">
              🐛 {'help_link_issues'|@translate}
            </a>
          </li>
          <li style="margin-bottom: 10px;">
            <a href="https://github.com/Gotcha26/centralAdmin/blob/main/docs/TECHNICAL-DOCUMENTATION.md" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 600;">
              📖 {'help_link_documentation'|@translate}
            </a>
          </li>
        </ul>
      </div>
      
    </div>
  </div>
</div>