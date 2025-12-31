const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TEMP = path.join(DIST, 'centralAdmin');

const os = require('os');
const TEMP_ROOT = path.join(
  os.tmpdir(),
  `centralAdmin-release-${Date.now()}`
);
const TEMP_BUILD = path.join(TEMP_ROOT, 'centralAdmin');

// ===================================
// CONFIGURATION - INCLUSIONS (Surcharge les exclusions globales)
// ===================================

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
// CONFIGURATION - EXCLUSIONS
// ===================================

const EXCLUDE_FOLDERS = [
  'node_modules',
  'dist',
  'docs',
  'images',
  'scripts',
  '.git',
  '.github'
];

const EXCLUDE_FILES = [
  '.gitignore',
  'package.json',
  'package-lock.json',
  'assets/css/sandbox.css'
];

// Extensions autorisées (whitelist)
const ALLOWED_EXTENSIONS = [
  '.php', '.css', '.js', '.tpl', '.txt', 
  '.md', '.pdf', '.html', '.png', '.jpg', '.jpeg'
];

// ===================================
// FONCTIONS
// ===================================

function shouldInclude(filePath) {
  const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/');

  // ✅ FICHIER explicitement inclus
  if (INCLUDE_FILES.includes(relativePath)) {
    return true;
  }

  // ✅ DOSSIER parent d’un fichier inclus
  if (INCLUDE_DIRS.has(relativePath)) {
    return true;
  }

  // 🎯 Règle spéciale : assets → uniquement fichiers minifiés
  if (relativePath.startsWith('assets/')) {

    // Toujours autoriser les dossiers pour préserver l’arborescence
    if (fs.statSync(filePath).isDirectory()) {
      return true;
    }

    // Autoriser uniquement les fichiers *.min.*
    return /\.min\./i.test(path.basename(relativePath));
  }

  // ⛔ Exclure dossiers
  for (const folder of EXCLUDE_FOLDERS) {
    if (relativePath === folder || relativePath.startsWith(folder + '/')) {
      return false;
    }
  }

  // ⛔ Exclure fichiers spécifiques
  for (const file of EXCLUDE_FILES) {
    if (relativePath === file || relativePath.endsWith('/' + file)) {
      return false;
    }
  }

  // 📄 Vérifier extension
  if (fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    return ALLOWED_EXTENSIONS.includes(ext);
  }

  // 📁 Dossiers autorisés par défaut
  return true;
}

async function copyFiles() {
  console.log('📦 Copie des fichiers vers le dossier temporaire...\n');

  await fs.ensureDir(TEMP_BUILD);

  await fs.copy(ROOT, TEMP_BUILD, {
    filter: (src) => {
      const relativePath = path.relative(ROOT, src).replace(/\\/g, '/');

      // Sécurité : ne jamais recopier dist/
      if (relativePath.startsWith('dist/')) {
        return false;
      }

      const include = shouldInclude(src);

      if (!include) {
        console.log(`  ⏭️  Exclu: ${relativePath}`);
      }

      return include;
    }
  });

  console.log('\n  ✅ Fichiers copiés dans le dossier temporaire');
}

async function createZip(version) {
  console.log('\n🗜️  Création de l\'archive ZIP...\n');

  await fs.ensureDir(DIST);

  const zipPath = path.join(DIST, `centralAdmin-${version}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      const sizeKb = (archive.pointer() / 1024).toFixed(1);
      console.log(`  ✅ Archive créée: ${path.basename(zipPath)}`);
      console.log(`     → Taille: ${sizeKb} Ko`);
      resolve();
    });

    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(TEMP_BUILD, 'centralAdmin');
    archive.finalize();
  });
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

// ===================================
// EXÉCUTION
// ===================================

async function run() {
  console.log('═══════════════════════════════════════');
  console.log('🚀 PRÉPARATION RELEASE');
  console.log('═══════════════════════════════════════\n');
  
  try {
    const version = getVersion();
    console.log(`📌 Version détectée: ${version}\n`);
    
    await copyFiles();
    await createZip(version);
    
    console.log('\n═══════════════════════════════════════');
    console.log('✨ Release prête dans dist/ !');
    console.log('═══════════════════════════════════════\n');
    console.log(`📦 Fichier: dist/centralAdmin-${version}.zip`);
    console.log('🚀 Prêt pour publication GitHub\n');
    
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