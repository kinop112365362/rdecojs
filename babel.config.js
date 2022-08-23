const { NODE_ENV, BABEL_ENV } = process.env
const cjs = NODE_ENV === 'test' || BABEL_ENV === 'commonjs'
const loose = true

module.exports = {
  presets: [
    [
      '@babel/env',
      { targets: { chrome: '30', ie: '11' }, loose, modules: false },
      '@babel/preset-react',
    ],
  ],
  plugins: [
    [
      'transform-remove-console',
      {
        exclude:
          NODE_ENV === 'production'
            ? ['error', 'warn']
            : ['error', 'warn', 'debug'],
      },
    ],
    ['@emotion'],
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    '@babel/transform-react-jsx',
    cjs && ['@babel/transform-modules-commonjs', { loose }],
    [
      '@babel/transform-runtime',
      {
        useESModules: !cjs,
        version: require('./package.json').peerDependencies[
          '@babel/runtime'
        ].replace(/^[^0-9]*/, ''),
      },
    ],
  ].filter(Boolean),
}
