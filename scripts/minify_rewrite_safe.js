const fs = require('fs');
const path = require('path');
const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');

const ROOT = path.resolve(__dirname, '..');
const ASSETS_CSS = path.join(ROOT, 'assets', 'css');
const ASSETS_JS = path.join(ROOT, 'assets', 'js');

// ===================================
// CONFIGURATION
// ===================================

// Veuillez à ne pas inclure de fichiers des minifié !
const CSS_FILES = [
  'core/CA-admin-layout.css',
  'core/CA-admin-override.css',
  'form/CA-form-base.css',
  'form/CA-form-components.css',
  'form/CA-form-themes.css',
  'modules/CA-debug.css',
  'modules/CA-modal.css'
];

const JS_FILES = [
  'core/CA-init.js',
  'core/CA-theme-detector.js',
  'form/CA-form-colors.js',
  'form/CA-form-controls.js',
  'form/CA-form-preview.js',
  'modules/CA-debug.js',
  'modules/CA-modal.js'
];

// ===================================
// MINIFICATION CSS
// ===================================

async function minifyCSS() {
  console.log('🎨 Minification CSS...\n');
  let success = 0;
  let errors = 0;
  
  for (const file of CSS_FILES) {
    const sourcePath = path.join(ASSETS_CSS, file);
    const outputPath = path.join(ASSETS_CSS, file.replace('.css', '.min.css'));
    
    // Vérifier que le fichier source existe
    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⏭️  ${file} (n'existe pas)`);
      continue;
    }
    
    try {
      const source = fs.readFileSync(sourcePath, 'utf8');
      
      // Options de minification SAFE
      const minified = new CleanCSS({
        level: 1, // Niveau 1 = safe (pas level 2)
        format: {
          breakWith: 'lf',
          breaks: {
            afterComment: true
          }
        },
        inline: false, // Ne pas inliner les @import
        rebase: false   // Ne pas modifier les URLs
      }).minify(source);
      
      if (minified.errors.length > 0) {
        console.error(`  ❌ ${file}:`, minified.errors);
        errors++;
        continue;
      }
      
      if (minified.warnings.length > 0) {
        console.warn(`  ⚠️  ${file}:`, minified.warnings);
      }
      
      const originalSize = Buffer.byteLength(source, 'utf8');
      const minifiedSize = Buffer.byteLength(minified.styles, 'utf8');
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      fs.writeFileSync(outputPath, minified.styles);
      console.log(`  ✅ ${file}`);
      console.log(`     → ${(originalSize / 1024).toFixed(1)} Ko → ${(minifiedSize / 1024).toFixed(1)} Ko (-${savings}%)`);
      success++;
      
    } catch (err) {
      console.error(`  ❌ Erreur: ${file} - ${err.message}`);
      errors++;
    }
  }
  
  return { success, errors };
}

// ===================================
// MINIFICATION JS
// ===================================

async function minifyJavaScript() {
  console.log('\n⚙️  Minification JavaScript...\n');
  let success = 0;
  let errors = 0;
  
  for (const file of JS_FILES) {
    const sourcePath = path.join(ASSETS_JS, file);
    const outputPath = path.join(ASSETS_JS, file.replace('.js', '.min.js'));
    
    // Vérifier que le fichier source existe
    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⏭️  ${file} (n'existe pas)`);
      continue;
    }
    
    try {
      const source = fs.readFileSync(sourcePath, 'utf8');
      
      // Options de minification SAFE
      const minified = await minifyJS(source, {
        compress: {
          dead_code: true,
          drop_console: false,    // GARDER les console.log
          drop_debugger: true,
          passes: 1               // 1 seul passage (safe)
        },
        mangle: false,            // NE PAS obfusquer les noms
        format: {
          comments: 'all',        // GARDER tous les commentaires
          beautify: false
        },
        sourceMap: false
      });
      
      if (minified.error) {
        console.error(`  ❌ ${file}:`, minified.error);
        errors++;
        continue;
      }
      
      const originalSize = Buffer.byteLength(source, 'utf8');
      const minifiedSize = Buffer.byteLength(minified.code, 'utf8');
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      fs.writeFileSync(outputPath, minified.code);
      console.log(`  ✅ ${file}`);
      console.log(`     → ${(originalSize / 1024).toFixed(1)} Ko → ${(minifiedSize / 1024).toFixed(1)} Ko (-${savings}%)`);
      success++;
      
    } catch (err) {
      console.error(`  ❌ Erreur: ${file} - ${err.message}`);
      errors++;
    }
  }
  
  return { success, errors };
}

// ===================================
// EXÉCUTION
// ===================================

async function run() {
  console.log('═══════════════════════════════════════');
  console.log('🚀 MINIFICATION ASSETS - MODE SAFE');
  console.log('═══════════════════════════════════════\n');
  
  const cssResults = await minifyCSS();
  const jsResults = await minifyJavaScript();
  
  console.log('\n═══════════════════════════════════════');
  console.log('📊 RÉSUMÉ');
  console.log('═══════════════════════════════════════');
  console.log(`CSS: ${cssResults.success} succès, ${cssResults.errors} erreurs`);
  console.log(`JS:  ${jsResults.success} succès, ${jsResults.errors} erreurs`);
  
  if (cssResults.errors > 0 || jsResults.errors > 0) {
    console.log('\n⚠️  Des erreurs sont survenues !');
    process.exit(1);
  }
  
  console.log('\n✨ Minification terminée avec succès !\n');
}

run().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});