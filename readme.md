## NodeJS存量应用迁移方案
> 已有的NodeJS应用无需改造即可快速通过此方案部署到Serverless架构之上，享受实时弹性、按量付费的收益。

## 如何迁移
> 前提：应用文件总大小小于 50MB

> [Express应用迁移方案](https://help.aliyun.com/document_detail/180016.html#h1--nodejs-2)

> [Egg应用迁移方案](https://help.aliyun.com/document_detail/180661.html#h1--nodejs-2)

> [Koa应用迁移方案](https://help.aliyun.com/document_detail/180660.html#h1--nodejs-2)

> [Next应用迁移方案](http://help.aliyun.com/document_detail/183599.html)

> [Nuxt应用迁移方案](https://help.aliyun.com/document_detail/183673.html)

## 数据库示例
- 如果你的应用需要操作数据库，可以参考本示例中的数据库示例
```
defalut.html      演示了通过 AJAX 方式读取 RDS 数据库数据
/api/db_config.js 演示了如何连接 RDS 和 OTS 数据库
/api/db_get.js    演示了如何读取 RDS 和 OTS 数据库
package.json      演示了数据库操作需要安装的 npm 依赖
```
- 要测试数据库效果，需要在「应用配置」中添加以下用于测试的环境变量，如果要开发自己的数据库应用，以下环境变量需要替换成自己的真实信息
```
OTS_ENDPOINT=https://todolist.cn-shanghai.ots.aliyuncs.com
OTS_INSTANCE=todolist
OTS_ACCESSKEY=LTAI4G1j3U8ue1yT3g6Tg1TG
OTS_SECRET=WB8Ev6zMHoKQnUSLp8V4zP7xeAgbWC
RDS_HOST=rm-uf6y14uhf0080yfrb7o.mysql.rds.aliyuncs.com
RDS_DBNAME=faas-test
RDS_USERNAME=faas_db_test
RDS_PASSWORD=YY6i8Jp7W_mtYxU
```
