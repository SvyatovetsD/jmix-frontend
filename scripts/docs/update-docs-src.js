const rimraf = require('rimraf');
const {runCmdSync} = require('../common');
const fs = require('fs');
const childProcess = require('child_process');

const highlight = '\x1b[34m%s\x1b[0m';
const success = '\x1b[32m%s\x1b[0m';

console.log(highlight, 'Generating API Reference documentation from TSDoc comments...');
rimraf.sync('docs-src/api-reference/cuba-rest-js');
rimraf.sync('docs-src/api-reference/cuba-react-core');
rimraf.sync('docs-src/api-reference/cuba-react-ui');
runCmdSync('lerna run prepublishOnly --scope @haulmont/jmix-rest --scope @haulmont/jmix-react-core --scope @haulmont/jmix-react-ui}');
runCmdSync('lerna run generate-docs');

console.log(success, 'API Reference documentation has been updated. Please commit your changes.');
