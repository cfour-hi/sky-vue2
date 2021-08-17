const path = require('path');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@packages': path.resolve('packages'),
      },
    },
  },

  devServer: {
    port: 3456,
  },

  chainWebpack: config => {
    // https://github.com/JetBrains/svg-sprite-loader
    config.module
      .rule('svg')
      .uses.delete('file-loader')
      .end()
      .include.add(path.resolve(__dirname, 'src/components/svg-icon/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()
      .use('svg-transform-loader')
      .loader('svg-transform-loader')
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end();
  },
};
