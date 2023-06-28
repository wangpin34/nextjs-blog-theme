const withImages = require('next-images')

// next.config.js
module.exports = withImages({
    // webpack: (config, options) => {
    //     config.module.rules.push({
    //         test: /\.(jpe?g|png|svg|gif|ico|eot|ttf|woff|woff2|mp4|pdf|webm|txt)$/,
    //         type: 'asset/resource',
    //         loader: "file-loader",
    //         options: {
    //           name: '[name]_[hash].[ext]',
    //         },
    //     });

    //     return config;
    // }
  //name: "[name].[hash:base64:8].[ext]",
  webpack(config, options) {
    return config
  }
});