import { babel } from '@rollup/plugin-babel'

const path = require('path')
const pkg = require(path.resolve(__dirname, 'package.json'))
const copyleft = `/*!
  * WhatsApp Widget v${pkg.version} (c) 2022 - ${pkg.author.name}
  * Licensed under MIT (https://github.com/griojas/standalone-whatsapp-widget.git/blob/main/LICENSE)
  * WhatsApp Widget does not affiliate with WhatsApp Inc. in any way.
  */`

export default {
  input: path.resolve(__dirname, 'src/index.js'),
  output: [
    {
      file: `dist/js/standalone-whatsapp-widget.js`,
      format: 'umd',
      banner: copyleft,
      name: 'WhatsAppWidget',
      sourcemap: false
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}