module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@quickbaseoss/babel-plugin-styled-components-css-namespace',
    'babel-plugin-styled-components'
  ],
  env: {
    production: {
      plugins: [
        './removeDataTestIdAttributes.js',
        '@quickbaseoss/babel-plugin-styled-components-css-namespace',
        'babel-plugin-styled-components'
      ]
    }
  }
};
