const fs = require('fs');
const detectNewline = require('detect-newline');

// Read contents of a Jenkinsfile and update the version variable on the first line
const tracker = {
  filename: '../Jenkinsfile',
  updater: {
    readVersion: (contents) => {
      const newLine = detectNewline(contents);
      return contents.match(new RegExp(`version = (.*)${newLine}`)).pop();
    },
    writeVersion: (contents, version) => {
      const newLine = detectNewline(contents);
      return contents.replace(
        new RegExp(`version = (.*)${newLine}`),
        `version = ${version}${newLine}`
      );
    }
  }
};

module.exports = {
  bumpFiles: [tracker]
};
