const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN_FILE = path.join(ROOT, 'main.inc.php');
const PACKAGE_FILE = path.join(ROOT, 'package.json');

// ===================================
// FONCTIONS
// ===================================

function getCurrentVersion() {
  const mainContent = fs.readFileSync(MAIN_FILE, 'utf8');
  const versionMatch = mainContent.match(/Version:\s*([\d.]+)/);
  
  if (!versionMatch) {
    throw new Error('Version non trouvée dans main.inc.php');
  }
  
  return versionMatch[1];
}

function calculateNewVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function updateMainFile(newVersion) {
  const content = fs.readFileSync(MAIN_FILE, 'utf8');
  const updated = content.replace(
    /Version:\s*[\d.]+/,
    `Version: ${newVersion}`
  );
  fs.writeFileSync(MAIN_FILE, updated);
  console.log('  ✅ main.inc.php mis à jour');
}

function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(
    PACKAGE_FILE, 
    JSON.stringify(packageJson, null, 2) + '\n'
  );
  console.log('  ✅ package.json mis à jour');
}

// ===================================
// EXÉCUTION
// ===================================

function run() {
  console.log('═══════════════════════════════════════');
  console.log('🔢 BUMP DE VERSION');
  console.log('═══════════════════════════════════════\n');
  
  const type = process.argv[2] || 'patch';
  
  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('❌ Type invalide. Utilisez: major, minor ou patch');
    process.exit(1);
  }
  
  try {
    const currentVersion = getCurrentVersion();
    const newVersion = calculateNewVersion(currentVersion, type);
    
    console.log(`📌 Version actuelle: ${currentVersion}`);
    console.log(`📌 Nouvelle version: ${newVersion}`);
    console.log(`📌 Type de bump: ${type.toUpperCase()}\n`);
    
    updateMainFile(newVersion);
    updatePackageJson(newVersion);
    
    console.log('\n═══════════════════════════════════════');
    console.log('✨ Version mise à jour avec succès !');
    console.log('═══════════════════════════════════════\n');
    console.log('💡 Prochaines étapes:\n');
    console.log(`   git add main.inc.php package.json`);
    console.log(`   git commit -m "chore: bump version to ${newVersion}"`);
    console.log(`   git tag v${newVersion}`);
    console.log(`   git push && git push --tags\n`);
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

run();