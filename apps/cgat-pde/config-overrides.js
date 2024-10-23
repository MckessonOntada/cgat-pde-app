const path = require('path');
const fs = require('fs');


module.exports = function override(config, env) {
    const mfeDir = path.resolve(__dirname, '../../mfe');


    const mfePackages = fs.readdirSync(mfeDir)
        .filter((file) => {
            return fs.statSync(path.join(mfeDir, file)).isDirectory();
        })
        .map((folder) => {
            return path.resolve(mfeDir, folder);
        });


    config.module.rules[1].oneOf.unshift({
        test: /\.(js|jsx|ts|tsx)$/,
        include: mfePackages,
        use: {
            loader: require.resolve('babel-loader'),
            options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react',
                ],
                cacheDirectory: true,
            },
        },
    });

    // config.resolve.extensions.push('.ts', '.tsx');

    return config;
};
