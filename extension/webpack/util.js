const path = require('path');

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, '../package.json'))
  )
);

// All shared properties of manifest.json go here.
// eslint-disable-next-line import/prefer-default-export
function formBaseManifest(content) {
  const baseManifest = JSON.parse(content);
  return JSON.stringify(
    {
      ...baseManifest,
      description: packageInfo.description,
      version: packageInfo.version,
      permissions: [
        ...baseManifest.permissions,
        `${process.env.WEBSITE_BASE_URL}*`
      ]
    },
    null,
    2
  );
}

module.exports.formBaseManifest = formBaseManifest;
