const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true
    },
    sassOptions: {
        includePaths: ['./styles', './components'],
        prependData: `@import "@illuzionz-studios/design-system/style-utils";`
    }
};

module.exports = nextConfig;
