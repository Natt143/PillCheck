const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add tfjs model extensions to the asset resolver
config.resolver.assetExts.push('bin');

module.exports = config;