const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  const isDev = env && env.mode === 'development';
  if (isDev) {
    config.devServer = {
      ...(config.devServer || {}),
      hot: true,
      liveReload: true,
      client: { overlay: false },
      watchFiles: { paths: ['src/**/*'] },
    };
    config.watchOptions = {
      ...(config.watchOptions || {}),
      poll: Number(process.env.WATCHPACK_POLLING_INTERVAL || 1000),
      aggregateTimeout: 200,
      ignored: ['**/node_modules/**'],
    };
  }

  return config;
};
