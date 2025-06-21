const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.watchFolders = [
    path.resolve(__dirname),
];

defaultConfig.resolver = {
    ...defaultConfig.resolver,
    blacklistRE: /.*\/\.vs\/.*/,
};

module.exports = defaultConfig;
