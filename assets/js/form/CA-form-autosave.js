/**
 * CentralAdmin - Auto-save
 * Version: 4.0.0 - caFlash + AJAX save manuel
 */

const CAFormAutosave = (function() {
  'use strict';

  let saveTimeout = null;
  let isSaving = false;
  let saveButton = null;
  let originalButtonHTML = '';

  function init() {
    // type="button" with id — form association doesn't matter
    saveButton = document.getElementById('ca-save-btn');
    if (!saveButton) return;

    originalButtonHTML = saveButton.innerHTML;

    const form = document.getElementById('centralAdminForm');
    if (!form) return;

    // Direct click handler (type="button", no form submit involved)
    saveButton.addEventListener('click', function() {
      if (!isSaving) performSave(false);
    });

    // Sliders
    form.querySelectorAll('.ca-slider').forEach(input => {
      input.addEventListener('change', () => triggerSave());
    });

    // Inputs numériques (changement via boutons +/-)
    form.querySelectorAll('.ca-input-number').forEach(input => {
      input.addEventListener('ca-value-changed', () => triggerSave());
    });

    // Color pickers
    form.querySelectorAll('.ca-color-picker, .ca-color-input').forEach(input => {
      input.addEventListener('change', () => triggerSave());
    });

    // Checkboxes
    form.querySelectorAll('input[type="checkbox"]').forEach(input => {
      if (!input.id.startsWith('ca-')) {
        input.addEventListener('change', () => triggerSave());
      }
    });

    console.log('[CA Autosave] ✅ Initialisé');
  }

  function triggerSave() {
    if (isSaving) {
      console.log('[CA Autosave] ⏸️ Sauvegarde en cours, en attente...');
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        if (!isSaving) performSave(true);
      }, 500);
      return;
    }

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      performSave(true);
    }, 800);
  }

  /**
   * @param {boolean} isAutosave - true for debounced autosave, false for manual click
   */
  function performSave(isAutosave) {
    isSaving = true;

    // Phase 1 : Saving (orange)
    saveButton.classList.add('ca-btn-saving');
    saveButton.innerHTML = '<span class="ca-icon">💾</span> ' + (window.CA_L10N ? window.CA_L10N.saving : 'Saving...');
    saveButton.disabled = true;

    const form = document.getElementById('centralAdminForm');
    const formData = new FormData(form);
    formData.append('autosave', '1');

    fetch(window.location.href, {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(text => {
      // Parse JSON robustly (PHP warnings may precede the JSON)
      var data = {};
      try {
        var jsonStart = text.indexOf('{');
        if (jsonStart >= 0) data = JSON.parse(text.substring(jsonStart));
      } catch(e) {
        console.warn('[CA Autosave] Réponse non-JSON:', text);
      }
      // Phase 2 : Success (vert) - 800ms
      saveButton.classList.remove('ca-btn-saving');
      saveButton.classList.add('ca-btn-success');
      saveButton.innerHTML = '<span class="ca-icon">✓</span> ' + (window.CA_L10N ? window.CA_L10N.saved : 'Saved');

      // Marquer que la page revient d'une sauvegarde (pour restauration des accordions)
      sessionStorage.setItem('ca-accordion-restore', 'true');

      // Flash notification
      var msg = isAutosave
        ? (window.CA_L10N ? window.CA_L10N.autosave_success : 'Changes saved automatically')
        : (window.CA_L10N ? window.CA_L10N.save_success : 'Configuration saved successfully');
      caFlash(msg, 'success', 3000);

      setTimeout(() => {
        // Phase 3 : Reset
        saveButton.classList.remove('ca-btn-success');
        saveButton.innerHTML = originalButtonHTML;
        saveButton.disabled = false;
        isSaving = false;
      }, 800);
    })
    .catch(error => {
      console.error('[CA Autosave] ❌ Erreur:', error);

      saveButton.classList.remove('ca-btn-saving');
      saveButton.classList.add('ca-btn-error');
      saveButton.innerHTML = '<span class="ca-icon">✗</span> ' + (window.CA_L10N ? window.CA_L10N.save_error : 'Error');
      saveButton.disabled = false;

      var errMsg = window.CA_L10N ? window.CA_L10N.save_net_error : 'Network error. Please try again.';
      caFlash(errMsg, 'error', 5000);

      setTimeout(() => {
        saveButton.classList.remove('ca-btn-error');
        saveButton.innerHTML = originalButtonHTML;
        isSaving = false;
      }, 1500);
    });
  }

  return { init: init, save: function() { performSave(false); } };
})();