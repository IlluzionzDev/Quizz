const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: ['./styles', './components'],
        prependData: `@import "@design-system/design-system-utils.scss";`
    },
    presets: ['next/babel']
};

module.exports = nextConfig;
