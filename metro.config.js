const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = [
  'require',
  'react-native',
  'default',
];

module.exports = withNativewind(config, { input: './global.css' });
