#!/usr/bin/env node
/** Source parser + local import existence check. A supplementary sanity test, not a typecheck. */
const fs = require('node:fs');
const path = require('node:path');
let ts;
try { ts = require('typescript'); }
catch {
  try { const { execFileSync } = require('node:child_process');
    ts = require(path.join(execFileSync('npm', ['root', '-g'], { encoding:'utf8' }).trim(), 'typescript')); }
  catch { console.error('Install TypeScript first (pnpm install); unable to parse source'); process.exit(2); }
}
const projectRoot = path.resolve(__dirname, '..', '..');
const frontend = path.join(projectRoot, 'front-end');
const backend = path.join(projectRoot, 'backends');
const files = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', 'dist', 'coverage', 'test-results', '.git'].includes(item.name)) continue;
    const target = path.join(dir, item.name);
    if (item.isDirectory()) walk(target);
    else if (/\.(tsx?|mts|cts)$/.test(item.name) && !item.name.endsWith('.d.ts')) files.push(target);
  }
}
walk(path.join(frontend, 'app'));
walk(path.join(frontend, 'src'));
walk(path.join(frontend, 'e2e'));
files.push(path.join(frontend, 'playwright.config.ts'));
walk(path.join(backend, 'src'));
const suffixes = ['', '.ts','.tsx','.d.ts','.mts','.cts','.js','.jsx','.json','/index.ts','/index.tsx','/index.js'];
const errors = []; let checked = 0;
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  const parsed = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  for (const diagnostic of parsed.parseDiagnostics) {
    const location = parsed.getLineAndCharacterOfPosition(diagnostic.start || 0);
    errors.push(`${path.relative(projectRoot, file)}:${location.line+1} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
  }
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      verify(node.moduleSpecifier.text);
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      verify(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  function verify(specifier) {
    const root = specifier.startsWith('@/') ? path.join(frontend, specifier.slice(2)) :
      specifier.startsWith('.') ? path.resolve(path.dirname(file), specifier) : null;
    if (!root) return;
    checked++;
    if (!suffixes.some(extension => fs.existsSync(root + extension) && fs.statSync(root + extension).isFile())) {
      errors.push(`${path.relative(projectRoot, file)}: unresolved import ${specifier}`);
    }
  }
  visit(parsed);
}
console.log(`Source audit: ${files.length} TS/TSX files parsed, ${checked} local import references checked, ${errors.length} problems`);
for (const issue of errors.slice(0, 100)) console.error(issue);
if (errors.length) process.exitCode = 1;
