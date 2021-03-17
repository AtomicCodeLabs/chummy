const fs = require('fs');
const detectNewline = require('detect-newline');

const tracker = {
  filename: './package.json',
  type: 'json'
};

const buildConfig = {
  filename: '../buildspec.yml',
  updater: {
    readVersion: (contents) => {
      const newLine = detectNewline(contents);
      return contents.match(new RegExp(`VERSION: "(.*)"${newLine}`)).pop();
    },
    writeVersion: (contents, version) => {
      const newLine = detectNewline(contents);
      return contents.replace(
        new RegExp(`VERSION: "(.*)"${newLine}`),
        `VERSION: "${version}"${newLine}`
      );
    }
  }
};

const versionFile = {
  filename: './.version',
  type: 'plain-text'
};

module.exports = {
  bumpFiles: [tracker, buildConfig, versionFile],
  packageFiles: [tracker]
};
