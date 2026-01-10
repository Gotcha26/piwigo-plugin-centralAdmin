/**
 * CentralAdmin - Auto-save
 * Version: 3.4.0 - Simplifié
 */

const CAFormAutosave = (function() {
  'use strict';
  
  let saveTimeout = null;
  let isSaving = false;
  let saveButton = null;
  let originalButtonHTML = '';
  
  function init() {
    saveButton = document.querySelector('button[name="save"]');
    if (!saveButton) return;
    
    originalButtonHTML = saveButton.innerHTML;
    
    const form = document.getElementById('centralAdminForm');
    if (!form) return;
    
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
        if (!isSaving) performSave();
      }, 500);
      return;
    }
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      performSave();
    }, 800);
  }
  
  function performSave() {
    isSaving = true;
    
    // Phase 1 : Saving (orange)
    saveButton.classList.add('ca-btn-saving');
    saveButton.innerHTML = '<span class="ca-icon">💾</span> Enregistrement';
    saveButton.disabled = true;
    
    const form = document.getElementById('centralAdminForm');
    const formData = new FormData(form);
    formData.append('autosave', '1');
    
    fetch(window.location.href, {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(() => {
      // Phase 2 : Success (vert) - 800ms seulement
      saveButton.classList.remove('ca-btn-saving');
      saveButton.classList.add('ca-btn-success');
      saveButton.innerHTML = '<span class="ca-icon">✓</span> Enregistré';
      
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
      saveButton.innerHTML = '<span class="ca-icon">✗</span> Erreur';
      saveButton.disabled = false;
      
      setTimeout(() => {
        saveButton.classList.remove('ca-btn-error');
        saveButton.innerHTML = originalButtonHTML;
        isSaving = false;
      }, 1500);
    });
  }
  
  return { init: init };
})();