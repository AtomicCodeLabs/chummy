const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AssetsPlugin = require('assets-webpack-plugin');

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, '../package.json'))
  )
);

const stripDomain = (s) => {
  // Remove https:// and https://www. from all urls
  return s.replace(/^(http|https):\/\/(www.)?/, '');
};

// All shared properties of manifest.json go here.
// eslint-disable-next-line import/prefer-default-export
function formBaseManifest(content) {
  const baseManifest = JSON.parse(content);
  return {
    ...baseManifest,
    description: packageInfo.description,
    version: packageInfo.version,
    permissions: [
      ...baseManifest.permissions,
      ...(process.env.NODE_ENV === 'development'
        ? [process.env.WEBSITE_BASE_URL]
        : [
            `https://${stripDomain(process.env.WEBSITE_BASE_URL)}*`, // always secure https://
            `https://www.${stripDomain(process.env.WEBSITE_BASE_URL)}*` // include www. version
          ])
    ]
  };
}

const generateReports = (domain, browser) => {
  return [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(
        __dirname,
        `./reports/report.${domain}.${browser}.html`
      ),
      statsFilename: path.join(
        __dirname,
        `./reports/stats.${domain}.${browser}.json`
      ),
      generateStatsFile: true,
      openAnalyzer: false
    }),
    new AssetsPlugin({
      filename: `assets.${domain}.${browser}.json`,
      path: path.join(__dirname, './reports')
    })
  ];
};

module.exports.formBaseManifest = formBaseManifest;
module.exports.generateReports = generateReports;
module.exports.stripDomain = stripDomain;
module.exports.packageInfo = packageInfo;
