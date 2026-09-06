import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

const versionFilePath = path.join(rootDir, 'VERSION');
if (!fs.existsSync(versionFilePath)) {
  console.error('[ERROR] VERSION file not found in repository root');
  process.exit(1);
}

const newArg = process.argv[2];
if (newArg) {
  fs.writeFileSync(versionFilePath, newArg.trim() + '\n', 'utf8');
  console.log(`[UPDATED] VERSION -> ${newArg.trim()}`);
}

const targetVersion = fs.readFileSync(versionFilePath, 'utf8').trim();
if (!/^\d+\.\d+\.\d+/.test(targetVersion)) {
  console.error(`[ERROR] Invalid semantic version format in VERSION: "${targetVersion}"`);
  process.exit(1);
}

console.log(`--- Synchronizing repository version to ${targetVersion} (Single Source of Truth: VERSION) ---`);

// 1. package.json
const pkgPath = path.join(rootDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = targetVersion;
  if (Array.isArray(pkg.files)) {
    if (!pkg.files.includes('VERSION')) {
      pkg.files.push('VERSION');
    }
    const idx = pkg.files.indexOf('version.json');
    if (idx !== -1) {
      pkg.files.splice(idx, 1);
    }
  }
  if (!pkg.scripts['sync-version']) {
    pkg.scripts['sync-version'] = 'node scripts/sync-version.mjs';
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`[PASS] package.json -> ${targetVersion}`);
}

// 2. package-lock.json
const lockPath = path.join(rootDir, 'package-lock.json');
if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  lock.version = targetVersion;
  if (lock.packages && lock.packages['']) {
    lock.packages[''].version = targetVersion;
  }
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
  console.log(`[PASS] package-lock.json -> ${targetVersion}`);
}

// 3. .claude-plugin/plugin.json
const pluginPath = path.join(rootDir, '.claude-plugin', 'plugin.json');
if (fs.existsSync(pluginPath)) {
  const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
  plugin.version = targetVersion;
  fs.writeFileSync(pluginPath, JSON.stringify(plugin, null, 2) + '\n', 'utf8');
  console.log(`[PASS] .claude-plugin/plugin.json -> ${targetVersion}`);
}

// 4. .claude-plugin/marketplace.json
const marketPath = path.join(rootDir, '.claude-plugin', 'marketplace.json');
if (fs.existsSync(marketPath)) {
  const market = JSON.parse(fs.readFileSync(marketPath, 'utf8'));
  if (Array.isArray(market.plugins) && market.plugins.length > 0) {
    market.plugins[0].version = targetVersion;
  }
  if (market.version) {
    market.version = targetVersion;
  }
  fs.writeFileSync(marketPath, JSON.stringify(market, null, 2) + '\n', 'utf8');
  console.log(`[PASS] .claude-plugin/marketplace.json -> ${targetVersion}`);
}

// 5. RELEASE-MANIFEST.json
const manifestPath = path.join(rootDir, 'RELEASE-MANIFEST.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = targetVersion;
  manifest.artifact_names = {
    zip: `ai-skills-pro-v${targetVersion}-production.zip`,
    npm: `ai-skills-pro-${targetVersion}.tgz`
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`[PASS] RELEASE-MANIFEST.json -> ${targetVersion}`);
}

// 6. RELEASE.md
const releasePath = path.join(rootDir, 'RELEASE.md');
if (fs.existsSync(releasePath)) {
  let releaseText = fs.readFileSync(releasePath, 'utf8');
  releaseText = releaseText.replace(/^# AI Skills Pro .* Production Release/m, `# AI Skills Pro ${targetVersion} Production Release`);
  releaseText = releaseText.replace(/^Version:\s*.*$/m, `Version: ${targetVersion}`);
  releaseText = releaseText.replace(/Package\/plugin\/marketplace versions aligned at .*?\./g, `Package/plugin/marketplace versions aligned at ${targetVersion}.`);
  fs.writeFileSync(releasePath, releaseText, 'utf8');
  console.log(`[PASS] RELEASE.md -> ${targetVersion}`);
}

console.log(`\nVersion synchronization complete: all manifests aligned to ${targetVersion}`);
