const FRAMEWORK = module.exports.FRAMEWORK = {
    type: 'nuxt',
    entry: 'server.js'
};

module.exports.SAFE = [
    '/api',
    '/package.json',
    '/.workbench',
    '/serverless.js'
];

const path = require('path');
const fs = require("fs");
module.exports.run = async function() {
  try {
    let rootPath = __dirname;
    let entryPath = FRAMEWORK.entry || '';
    if (!path.isAbsolute(entryPath)) {
        entryPath = path.join(rootPath, entryPath);
    }
    if (fs.existsSync(entryPath)) {
        let app = require(entryPath);
        if (typeof app === 'function' && !app['emit']) {
            app = await app();
        }
    } 
  } catch(e) {
    console.error(e)
  }
}