import { defineConfig } from '@farmfe/core'
import farmPostcssPlugin from '@farmfe/js-plugin-postcss'
import farmJsPluginSolid from '@farmfe/js-plugin-solid'
import path from 'path';

export default defineConfig({
  compilation: {
    resolve: {
      alias: {
        '~': path.resolve(process.cwd(), './src')
      }
    },
  },
  plugins: [farmJsPluginSolid(), farmPostcssPlugin()],
})
