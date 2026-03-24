module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo']],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      'babel-plugin-transform-import-meta',
      'react-native-reanimated/plugin',
    ],
  };
};
