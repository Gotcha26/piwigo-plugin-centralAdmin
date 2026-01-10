const fs = require('fs');
const path = require('path');
const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');
const sass = require('sass');

const ROOT = path.resolve(__dirname, '..');
const ASSETS_CSS = path.join(ROOT, 'assets', 'css');
const ASSETS_JS = path.join(ROOT, 'assets', 'js');

// ===================================
// CONFIGURATION
// ===================================

const CSS_FILES = [
  'core/CA-admin-override.css',
  'form/CA-form-base.css',
  'form/CA-form-components.css',
  'form/CA-form-themes.scss',    // Fichier SCSS
  'modules/CA-debug.css',
  'modules/CA-modal.css',
  'modules/CA-colors-unified.css'
];

const JS_FILES = [
  'core/CA-init.js',
  'form/CA-form-autosave.js',
  'form/CA-form-colors.js',
  'form/CA-form-controls.js',
  'form/CA-form-preview.js',
  'form/CA-form-tooltips.js',
  'modules/CA-debug.js',
  'modules/CA-modal.js'
];

// ===================================
// FONCTIONS
// ===================================

function compileSCSS(filePath) {
  try {
    const result = sass.compile(filePath, {
      style: 'compressed',  // Génère un CSS minifié
    });
    return result.css;
  } catch (err) {
    throw new Error(`Erreur de compilation SCSS: ${err.message}`);
  }
}

async function minifyCSS() {
  console.log('🎨 Minification CSS/SCSS...\n');

  for (const file of CSS_FILES) {
    const sourcePath = path.join(ASSETS_CSS, file);
    const outputPath = path.join(ASSETS_CSS, file.replace(/(\.scss|\.css)$/, '.min.css'));
    const isSCSS = file.endsWith('.scss');

    try {
      let source;
      if (isSCSS) {
        // Compile SCSS → CSS (version moderne avec `compile`)
        source = compileSCSS(sourcePath);
      } else {
        // Lit le fichier CSS directement
        source = fs.readFileSync(sourcePath, 'utf8');
      }

      // Minifie le CSS
      const minified = new CleanCSS({
        level: 2,
        format: { breakWith: 'lf' }
      }).minify(source);

      if (minified.errors.length > 0) {
        console.error(`  ❌ Erreurs dans ${file}:`, minified.errors);
        continue;
      }

      const originalSize = Buffer.byteLength(source, 'utf8');
      const minifiedSize = Buffer.byteLength(minified.styles, 'utf8');
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, minified.styles);
      console.log(`  ✅ ${file}`);
      console.log(`     → ${(originalSize / 1024).toFixed(1)} Ko → ${(minifiedSize / 1024).toFixed(1)} Ko (-${savings}%)`);
    } catch (err) {
      console.error(`  ❌ Erreur: ${file} - ${err.message}`);
    }
  }
}

async function minifyJavaScript() {
  console.log('\n⚙️  Minification JavaScript...\n');
  
  for (const file of JS_FILES) {
    const sourcePath = path.join(ASSETS_JS, file);
    const outputPath = path.join(ASSETS_JS, file.replace('.js', '.min.js'));
    
    try {
      const source = fs.readFileSync(sourcePath, 'utf8');
      const minified = await minifyJS(source, {
        compress: {
          dead_code: true,
          drop_console: false,  // Conserver console.log
          drop_debugger: true,
          passes: 2
        },
        mangle: false,  // Ne pas obfusquer les noms de variables
        format: {
          comments: /^!/  // Garder les commentaires commençant par !
        }
      });
      
      const originalSize = Buffer.byteLength(source, 'utf8');
      const minifiedSize = Buffer.byteLength(minified.code, 'utf8');
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, minified.code);
      console.log(`  ✅ ${file}`);
      console.log(`     → ${(originalSize / 1024).toFixed(1)} Ko → ${(minifiedSize / 1024).toFixed(1)} Ko (-${savings}%)`);
    } catch (err) {
      console.error(`  ❌ Erreur: ${file} - ${err.message}`);
    }
  }
}

// ===================================
// EXÉCUTION
// ===================================

async function run() {
  console.log('═══════════════════════════════════════');
  console.log('🚀 MINIFICATION DES ASSETS');
  console.log('═══════════════════════════════════════\n');
  
  await minifyCSS();
  await minifyJavaScript();
  
  console.log('\n═══════════════════════════════════════');
  console.log('✨ Minification terminée avec succès !');
  console.log('═══════════════════════════════════════\n');
}

run().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});