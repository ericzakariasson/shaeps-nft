const withTM = require("next-transpile-modules")([]);
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = withTM({
  reactStrictMode: true,
});

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
