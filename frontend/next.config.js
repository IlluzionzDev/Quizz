const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./styles', './components'],
    prependData: `@import "styles/design-system-utils.scss";`,
  },
};

module.exports = nextConfig;
