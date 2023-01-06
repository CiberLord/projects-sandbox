const { getConfig } = require('../core/webpack/getConfig');

module.exports = getConfig({
    entry: {
        main: './client/index.tsx',
    },
    html: {
        path: './index.html',
        favicon: './favicon.ico',
    },
});
