const path = require('path');

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, 'package.json'))
  )
);

exports.onCreateWebpackConfig = ({ stage, plugins, actions }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        'process.env.CHROME_EXTENSION_ID': JSON.stringify(
          packageInfo.chromeExtensionId
        ),
        'process.env.EDGE_EXTENSION_ID': JSON.stringify(
          packageInfo.edgeExtensionId
        )
      })
    ]
  });
};
