## NodeJS存量应用迁移方案
> 已有的NodeJS应用无需改造即可快速通过此方案部署到Serverless架构之上，享受实时弹性、按量付费的收益。

## 如何迁移
> 前提：应用文件总大小小于 50MB

### 步骤一
- 登录云开发平台，进入「应用列表」，创建新应用，在「技术场景」「WEB」类目下选择「NodeJS存量应用迁移方案」，并根据指引完成应用的创建

### 步骤二
- 在新创建出来的应用卡片上，点击「开发部署」，进入 CloudIDE 云开发界面

- 打开 CloudIDE 资源管理器的文件列表，打开本地的 NodeJS 存量应用的根目录，将应用根目录下的所有文件拖拽至 CloudIDE 资源管理器的文件列表

### 步骤三
- 打开 CloudIDE 部署插件，选择「日常环境」，点击「部署」，部署成功后即可通过自动分配的临时域名查看运行效果

### 步骤四
- 在日常环境和预发环境都测试无误后，在应用卡片的「应用管理」面板，选择「线上环境」按照提示绑定您自己的域名

### 步骤五
- 回到 CloudIDE，打开部署插件，选择「线上环境」，点击「部署」，部署成功后，即可通过您自己的域名查看线上运行的效果

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
