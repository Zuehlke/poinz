const plugins = [
  '@quickbaseoss/babel-plugin-styled-components-css-namespace',
  'babel-plugin-styled-components'
];

export const babel = {
  plugins,
  env: {
    production: {
      plugins: ['./viteConfig/removeDataTestIdAttributes.js', ...plugins]
    }
  }
};
