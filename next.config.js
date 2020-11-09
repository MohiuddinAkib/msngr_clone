// @generated: @expo/next-adapter@2.1.29
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const withPlugins = require("next-compose-plugins");
const {withExpo} = require("@expo/next-adapter");


module.exports = withPlugins(
    [
        [withExpo, {projectRoot: __dirname}],
    ],
    {
        webpack(config, options) {
            const {isServer} = options;
            config.module.rules.push({
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                exclude: config.exclude,
                use: [
                    {
                        loader: require.resolve("url-loader"),
                        options: {
                            limit: config.inlineImageLimit,
                            fallback: require.resolve("file-loader"),
                            publicPath: `${config.assetPrefix}/_next/static/images/`,
                            outputPath: `${isServer ? "../" : ""}static/images/`,
                            name: "[name]-[hash].[ext]",
                            esModule: config.esModule || false,
                        },
                    },
                ],
            });

            return config;
        },
    }
)
