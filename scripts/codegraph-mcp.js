#!/usr/bin/env node
/**
 * Cursor MCP launcher for clariverse-ui.
 */
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

const codegraphRoot = path.join(
  process.env.APPDATA || '',
  'npm',
  'node_modules',
  '@colbymchenry',
  'codegraph'
);

const CodeGraph = require(path.join(codegraphRoot, 'dist', 'index.js')).default;
const { MCPServer } = require(path.join(codegraphRoot, 'dist', 'mcp', 'index.js'));

const dbPath = path.join(projectRoot, '.codegraph', 'codegraph.db');
if (!fs.existsSync(dbPath)) {
  process.stderr.write(
    `[codegraph-mcp] No index. Run: cd "${projectRoot}" && codegraph init -i\n`
  );
  process.exit(1);
}

const cg = CodeGraph.openSync(projectRoot);
const server = new MCPServer(projectRoot);
server.cg = cg;
server.projectPath = projectRoot;
server.toolHandler.setDefaultCodeGraph(cg);
server.start();
