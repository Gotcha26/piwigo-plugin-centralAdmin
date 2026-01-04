const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const readline = require('readline');
const { exec } = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const TEMP_ROOT = path.join(
  os.tmpdir(),
  `centralAdmin-release-${Date.now()}`
);
const TEMP_BUILD = path.join(TEMP_ROOT, 'centralAdmin');

// Interface readline pour interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ===================================
// UTILITAIRES
// ===================================

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function getVersion() {
  const mainFile = path.join(ROOT, 'main.inc.php');

  if (!fs.existsSync(mainFile)) {
    throw new Error(`Fichier introuvable : ${mainFile}`);
  }

  const mainContent = fs.readFileSync(mainFile, 'utf8');
  const versionMatch = mainContent.match(/Version:\s*([\d.]+)/);

  if (!versionMatch) {
    throw new Error('Version non trouvée dans main.inc.php');
  }

  return versionMatch[1];
}

function openFolder(folderPath) {
  const platform = os.platform();
  let command;
  
  if (platform === 'win32') {
    command = `explorer "${folderPath}"`;
  } else if (platform === 'darwin') {
    command = `open "${folderPath}"`;
  } else {
    command = `xdg-open "${folderPath}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      // console.log(`\n⚠️  Impossible d'ouvrir le dossier automatiquement`);
    }
  });
}

// ===================================
// CONFIGURATION - EXCLUSIONS
// ===================================

const EXCLUDE_FOLDERS = [
  'node_modules',
  'dist',
  'docs',
  'images',
  'scripts',
  '.git',
  'archives',
  '.github'
];

const EXCLUDE_FILES = [
  '.gitignore',
  'package.json',
  'package-lock.json'
];

const ALLOWED_EXTENSIONS = [
  '.php', '.css', '.scss', '.js', '.tpl', '.txt', 
  '.md', '.pdf', '.html', '.png', '.jpg', '.jpeg'
];

const INCLUDE_FILES = [
  'docs/TECHNICAL-DOCUMENTATION.md',
  'docs/TECHNICAL-DOCUMENTATION.pdf'
];

const INCLUDE_DIRS = new Set();

for (const file of INCLUDE_FILES) {
  let dir = path.dirname(file);
  while (dir && dir !== '.' && dir !== '/') {
    INCLUDE_DIRS.add(dir);
    dir = path.dirname(dir);
  }
}

// ===================================
// DÉTECTION VERSIONS MINIFIÉES
// ===================================

function detectMinifiedFiles() {
  const minified = { css: [], js: [] };
  const normal = { css: [], js: [] };

  // CSS + SCSS
  const cssDir = path.join(ROOT, 'assets', 'css');
  if (fs.existsSync(cssDir)) {
    const scanCssDir = (dir, base = '') => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(base, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanCssDir(fullPath, relativePath);
        } else if (item.endsWith('.min.css')) {
          minified.css.push(relativePath);
        } else if (item.endsWith('.css') || item.endsWith('.scss')) {
          normal.css.push(relativePath);
        }
      });
    };
    scanCssDir(cssDir);
  }

  // JS (inchangé)
  const jsDir = path.join(ROOT, 'assets', 'js');
  if (fs.existsSync(jsDir)) {
    const scanJsDir = (dir, base = '') => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(base, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanJsDir(fullPath, relativePath);
        } else if (item.endsWith('.min.js')) {
          minified.js.push(relativePath);
        } else if (item.endsWith('.js')) {
          normal.js.push(relativePath);
        }
      });
    };
    scanJsDir(jsDir);
  }

  return { minified, normal };
}

// ===================================
// FILTRAGE FICHIERS
// ===================================

function shouldInclude(filePath, assetMode) {
  const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/');

  // TOUJOURS inclure index.php dans assets/
  if (relativePath.startsWith('assets/') && path.basename(relativePath) === 'index.php') {
    return true;
  }

  // Fichiers explicitement inclus
  if (INCLUDE_FILES.includes(relativePath)) {
    return true;
  }

  // Dossiers parents de fichiers inclus
  if (INCLUDE_DIRS.has(relativePath)) {
    return true;
  }

  // Gestion assets selon mode choisi
  if (relativePath.startsWith('assets/')) {
    // Toujours autoriser les dossiers
    if (fs.statSync(filePath).isDirectory()) {
      return true;
    }

    const fileName = path.basename(relativePath);

    // Filtrage selon mode
    if (assetMode === 'minified') {
      // Uniquement .min.css et .min.js
      return /\.min\.(css|js)$/i.test(fileName);
    } else if (assetMode === 'normal') {
      // Fichiers normaux : .css, .scss, .js (pas .min.)
      return /\.(css|scss|js)$/i.test(fileName) && !/\.min\./i.test(fileName);
    } else if (assetMode === 'all') {
      // Tous les fichiers CSS/SCSS/JS
      return /\.(css|scss|js)$/i.test(fileName);
    }
  }

  // Exclusion dossiers
  for (const folder of EXCLUDE_FOLDERS) {
    if (relativePath === folder || relativePath.startsWith(folder + '/')) {
      return false;
    }
  }

  // Exclusion fichiers spécifiques
  for (const file of EXCLUDE_FILES) {
    if (relativePath === file || relativePath.endsWith('/' + file)) {
      return false;
    }
  }

  // Vérification extension
  if (fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    return ALLOWED_EXTENSIONS.includes(ext);
  }

  return true;
}

// ===================================
// COPIE FICHIERS
// ===================================

async function copyFiles(assetMode) {
  console.log('\n📦 Copie des fichiers vers le dossier temporaire...\n');

  await fs.ensureDir(TEMP_BUILD);

  await fs.copy(ROOT, TEMP_BUILD, {
    filter: (src) => {
      const relativePath = path.relative(ROOT, src).replace(/\\/g, '/');

      // Ne jamais recopier dist/
      if (relativePath.startsWith('dist/')) {
        return false;
      }

      const include = shouldInclude(src, assetMode);

      if (!include) {
        console.log(`  ⏭️  Exclu: ${relativePath}`);
      }

      return include;
    }
  });

  console.log('\n  ✅ Fichiers copiés dans le dossier temporaire');
}

// ===================================
// CRÉATION ZIP
// ===================================

async function createZip(version, suffix) {
  console.log('\n🗜️  Création de l\'archive ZIP...\n');

  await fs.ensureDir(DIST);

  const baseName = suffix 
    ? `centralAdmin-${version}-${suffix}` 
    : `centralAdmin-${version}`;
  const zipPath = path.join(DIST, `${baseName}.zip`);
  
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      const sizeKb = (archive.pointer() / 1024).toFixed(1);
      console.log(`  ✅ Archive créée: ${path.basename(zipPath)}`);
      console.log(`     → Taille: ${sizeKb} Ko`);
      resolve(zipPath);
    });

    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(TEMP_BUILD, 'centralAdmin');
    archive.finalize();
  });
}

// ===================================
// INTERACTION UTILISATEUR
// ===================================

async function promptUser() {
  console.log('═══════════════════════════════════════');
  console.log('🔧 CONFIGURATION DE LA RELEASE');
  console.log('═══════════════════════════════════════\n');

  // 🆕 OPTION MINIFICATION
  const shouldMinify = await question('Lancer la minification avant la release ? [o/N]: ');
  if (shouldMinify.toLowerCase() === 'o' || shouldMinify.toLowerCase() === 'y') {
    console.log('\n🗜️  Lancement de la minification...\n');
    
    await new Promise((resolve, reject) => {
      exec('npm run minify', { cwd: ROOT }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Erreur minification:', stderr);
          reject(error);
        } else {
          console.log(stdout);
          console.log('✅ Minification terminée\n');
          resolve();
        }
      });
    });
  }

  // Détection versions disponibles
  const detected = detectMinifiedFiles();
  const hasMinified = detected.minified.css.length > 0 || detected.minified.js.length > 0;

  console.log('📊 Fichiers détectés:');
  console.log(`  - CSS/SCSS normaux: ${detected.normal.css.length}`);
  console.log(`  - CSS minifiés: ${detected.minified.css.length}`);
  console.log(`  - JS normaux: ${detected.normal.js.length}`);
  console.log(`  - JS minifiés: ${detected.minified.js.length}\n`);

  // Choix assets
  let assetMode = 'normal';
  if (hasMinified) {
    console.log('Quelle version des assets inclure ?');
    console.log('  1. Uniquement minifiés (.min.css / .min.js)');
    console.log('  2. Uniquement normaux (.css / .scss / .js)');
    console.log('  3. Tout (minifiés + normaux)');
    
    const choice = await question('\nVotre choix [1-3] (défaut: 2): ');
    
    if (choice === '1') assetMode = 'minified';
    else if (choice === '3') assetMode = 'all';
    else assetMode = 'normal';
  } else {
    console.log('⚠️  Aucun fichier minifié détecté, utilisation des fichiers normaux\n');
  }

  // Suffixe optionnel
  const suffix = await question('\nSuffixe pour le nom (optionnel, ex: "beta"): ');

  // Ouverture dossier
  const openDir = await question('\nOuvrir le dossier dist/ après création ? [o/N]: ');
  const shouldOpen = openDir.toLowerCase() === 'o' || openDir.toLowerCase() === 'y';

  rl.close();

  return {
    assetMode,
    suffix: suffix.trim(),
    shouldOpen
  };
}

// ===================================
// EXÉCUTION PRINCIPALE
// ===================================

async function run() {
  console.log('═══════════════════════════════════════');
  console.log('🚀 PRÉPARATION RELEASE');
  console.log('═══════════════════════════════════════\n');
  
  try {
    const version = getVersion();
    console.log(`📌 Version détectée: ${version}\n`);

    const config = await promptUser();

    console.log('\n═══════════════════════════════════════');
    console.log('📋 RÉCAPITULATIF');
    console.log('═══════════════════════════════════════');
    console.log(`Version: ${version}`);
    console.log(`Mode assets: ${config.assetMode}`);
    console.log(`Suffixe: ${config.suffix || '(aucun)'}`);
    console.log(`Ouvrir dossier: ${config.shouldOpen ? 'Oui' : 'Non'}`);
    console.log('═══════════════════════════════════════\n');

    await copyFiles(config.assetMode);
    const zipPath = await createZip(version, config.suffix);
    
    console.log('\n═══════════════════════════════════════');
    console.log('✨ Release prête dans dist/ !');
    console.log('═══════════════════════════════════════\n');
    console.log(`📦 Fichier: ${path.basename(zipPath)}`);
    console.log('🚀 Prêt pour publication GitHub\n');

    if (config.shouldOpen) {
      console.log('📂 Ouverture du dossier dist/...\n');
      openFolder(DIST);
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);

  } finally {
    if (await fs.pathExists(TEMP_ROOT)) {
      await fs.remove(TEMP_ROOT);
      console.log('🧹 Dossier temporaire nettoyé');
    }
  }
}

run();