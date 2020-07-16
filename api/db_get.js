const db = require("./db_config");
const TableStore = require("tablestore");
const format = require('otswhere/format');

const fnGetOtsData = () => { //OTS 数据读取示例
  console.log('Use OTS');
  const ots = db.getOTS();
  const params = {
      tableName: 'list',
      direction: TableStore.Direction.BACKWARD,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MAX }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MIN }]
  };
  return new Promise(resolve => {
    ots.getRange(params,  (_, data) => {
      const rows = format.rows(data, { email: true });
      resolve(rows);
    });
  });
};

const fnGetRdsData = async () => { //RDS 数据读取示例
  console.log('Use RDS');
  const rds = await db.getRDS();
  const [todoList] = await rds.query('select * from todo order by id desc limit 2');
  return todoList;
};

module.exports.handler = async (event, context, callback) => {
  // false is rds:mysql
  var request = JSON.parse(event);
  var isots = request.queryParameters ? !!request.queryParameters.isots : false;
  console.log("isots:",isots);
  try {
    console.log('start log!');
    const todolist = await (isots ? fnGetOtsData : fnGetRdsData)();
    console.log('todolist', todolist);
    const response = {
      isBase64Encoded: true,
      statusCode: 200,
      headers: {
        "Content-type": "application/json"
      },
      body: Buffer.from( JSON.stringify(todolist) ).toString('base64')
    };
    callback(null, response);
  } catch (err) {
    if(callback){callback(err);}
  }
};