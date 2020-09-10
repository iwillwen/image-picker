module.exports.FRAMEWORK = {
    type: 'egg'
};

module.exports.SAFE = [
    '/api',
    '/package.json',
    '/.workbench',
    '/serverless.js'
];

const { start } = require('egg');

module.exports.run = async function() {
  try {
    let eggApp = await start({
      ignoreWarning: true,
    });
    await new Promise((res)=>{
      eggApp.listen(process.env['port'] || 8000, () => {
        res();
      });
    })
  } catch(e) {
    console.error(e)
  }
}