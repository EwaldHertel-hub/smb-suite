const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const wsYamlPath = path.join(root, 'pnpm-workspace.yaml');
const pkgPath = path.join(root, 'package.json');

if (!fs.existsSync(wsYamlPath)) {
  console.error('pnpm-workspace.yaml nicht gefunden');
  process.exit(1);
}

const ws = yaml.load(fs.readFileSync(wsYamlPath, 'utf8'));
const catalog = ws && ws.catalog ? ws.catalog : {};

let pkg = {};
if (fs.existsSync(pkgPath)) {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} else {
  pkg = { name: "smb-suite", private: true, version: "0.0.0", dependencies: {}, devDependencies: {} };
}

pkg.dependencies = pkg.dependencies || {};
pkg.devDependencies = pkg.devDependencies || {};

// heuristik: tooling -> devDeps, sonst -> deps
const devCandidates = ['prisma','eslint','prettier','typescript','@prisma/engines'];

for (const [name, ver] of Object.entries(catalog)) {
  if (devCandidates.includes(name)) {
    pkg.devDependencies[name] = ver;
  } else {
    pkg.dependencies[name] = ver;
  }
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('package.json aktualisiert. Bitte pnpm -w install ausführen.');