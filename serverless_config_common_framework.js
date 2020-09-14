const FRAMEWORK = module.exports.FRAMEWORK = {
    type: '框架名称，如：express, koa, next, nuxt 等',
    entry: '应用入口文件，如：app.js, server.js 等'
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