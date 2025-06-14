// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

// Resolve project and workspace roots
const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

// Load default Metro config
const config = getDefaultConfig(projectRoot, {})

// Add support for mjs files
config.resolver.sourceExts.push('mjs')

// Include the monorepo root and its node_modules in Metro
config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// Redirect monorepo dependencies to the workspace root node_modules
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (_target, name) => path.join(workspaceRoot, 'node_modules', name.toString()),
  }
)

module.exports = config
