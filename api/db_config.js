const TableStore = require("tablestore");
const { Sequelize } = require('sequelize');

module.exports.getOTS = function(){
	const OTSConfig = { //从环境变量中读取数据库配置信息
		accessKeyId: process.env.OTS_ACCESSKEY, // 阿里云账号 AK，建议用受限子账号AK
		secretAccessKey: process.env.OTS_SECRET, // 阿里云账号AKSK，建议用受限子账号AK
		endpoint: process.env.OTS_ENDPOINT, // OTS 数据库公网连接地址
		instancename: process.env.OTS_INSTANCE // OTS 数据库名称
	};
	const DB_OTS =  new TableStore.Client({
		accessKeyId: OTSConfig.accessKeyId,
		secretAccessKey: OTSConfig.secretAccessKey,
		endpoint: OTSConfig.endpoint,
		instancename: OTSConfig.instancename,
		maxRetries: 20
	});
	return DB_OTS;
};


module.exports.getRDS = async () => {
	const RDSConfig = { //从环境变量中读取数据库配置信息
		host: process.env.RDS_HOST, // RDS 数据库公网连接地址
		port: process.env.RDS_PORT || 3306, // RDS 数据库端口
		database: process.env.RDS_DBNAME, // RDS 数据库名称
		username: process.env.RDS_USERNAME, // RDS 数据库用户名
		password: process.env.RDS_PASSWORD // RDS 数据库连接密码
  };
  console.info('RDSConfig: '+JSON.stringify(RDSConfig));
	const DB_RDS = new Sequelize(RDSConfig.database, RDSConfig.username, RDSConfig.password, {
			host: RDSConfig.host,
			port: RDSConfig.port,
			logging: console.log,
			dialect: "mysql",
			define: { charset: "utf8" },
			timezone: "+08:00"
  });
  try {
		await DB_RDS.authenticate();
  } catch(error) {
		console.log("error", error)
		error.message = `db connect error: ${error.message}`;
		throw error;
	}
	return DB_RDS;
};