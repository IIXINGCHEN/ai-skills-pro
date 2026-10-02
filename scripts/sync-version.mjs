import fs from 'fs';
import { readJson } from './read-json.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getVersion } from './version.mjs';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

const versionFilePath = path.join(rootDir, 'VERSION');
const args = process.argv.slice(2);
// `npm run version` runs `changeset version` first, which bumps package.json.
// `--from-package` promotes that bumped value into the canonical VERSION file
// before propagating it. Without it, sync-version read the still-stale VERSION
// file and wrote the old version back into package.json, so the changeset bump
// was silently discarded (CHANGELOG said 3.2.2 while every version file stayed
// 3.2.1). The VERSION file remains the single source every downstream reader
// (getVersion) trusts; it is now populated from the changeset bump instead of
// being expected to change on its own.
const fromPackage = args.includes('--from-package');
const newArg = args.find((a) => !a.startsWith('--'));
if (fromPackage) {
  const pkg = readJson(path.join(rootDir, 'package.json'));
  const promoted = String(pkg.version || '').trim();
  if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(promoted)) {
    throw new Error(`Invalid version in package.json: "${promoted}"`);
  }
  fs.writeFileSync(versionFilePath, promoted + '\n', 'utf8');
  console.log(`[UPDATED] VERSION -> ${promoted} (promoted from package.json)`);
} else if (newArg) {
  fs.writeFileSync(versionFilePath, newArg.trim() + '\n', 'utf8');
  console.log(`[UPDATED] VERSION -> ${newArg.trim()}`);
}

const targetVersion = getVersion();

console.log(`--- Synchronizing repository version to ${targetVersion} (Single Source of Truth: VERSION) ---`);

// 1. package.json
const pkgPath = path.join(rootDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = readJson(pkgPath);
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
  const lock = readJson(lockPath);
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
  const plugin = readJson(pluginPath);
  plugin.version = targetVersion;
  fs.writeFileSync(pluginPath, JSON.stringify(plugin, null, 2) + '\n', 'utf8');
  console.log(`[PASS] .claude-plugin/plugin.json -> ${targetVersion}`);
}

// 4. .claude-plugin/marketplace.json
const marketPath = path.join(rootDir, '.claude-plugin', 'marketplace.json');
if (fs.existsSync(marketPath)) {
  const market = readJson(marketPath);
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
  const manifest = readJson(manifestPath);
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
  releaseText = releaseText.replace(/^Release version:\s*.*$/m, `Release version: ${targetVersion}`);
  releaseText = releaseText.replace(/^-\s*Package\/plugin\/marketplace versions aligned at .*$/m, `- Package/plugin/marketplace versions aligned at ${targetVersion}.`);
  fs.writeFileSync(releasePath, releaseText, 'utf8');
  console.log(`[PASS] RELEASE.md -> ${targetVersion}`);
}

console.log(`\nVersion synchronization complete: all manifests aligned to ${targetVersion}`);
