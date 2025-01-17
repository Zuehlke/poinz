import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import packageInformation from './package.json';
import {parseChangelogMd} from './viteConfig/parseChangelogMd';
import {getGitInformation} from './viteConfig/getGitInformation';
import {babel} from './viteConfig/babelConfig';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const poinzConfig =
    mode === 'production'
      ? {
          env: 'production',
          version: packageInformation.version
        }
      : {
          dev: 'dev',
          version: packageInformation.version + '-dev', // Poinz version that is displayed in the ui
          vcsInfo: getGitInformation()
        };

  return {
    define: {
      __POINZ_CONFIG__: {
        buildTime: Date.now(),
        changeLog: parseChangelogMd(),
        ...poinzConfig
      }
    },
    server: {
      port: 9000,
      proxy: {
        '/api': 'http://localhost:3000',
        '/socket.io': 'http://localhost:3000'
      }
    },
    plugins: [react({babel})]
  };
});
