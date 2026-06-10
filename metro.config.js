const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Explicitly add 'bin' to the asset extensions list
config.resolver.assetExts.push('bin');

module.exports = config;