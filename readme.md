# 快速选图小帮手

用于解决人像摄影师和模特快速从一堆底片中找出想要的图。基于 Next.js + NextUI 开发，目前直接调用了百度云的开放接口。

## 部署

```bash
$ yarn

# Developing
$ yarn dev

# Build and Deployment
$ yarn build
$ yarn start
```

## 主要功能

- 登录百度云授权
- 获取文件夹列表
- 获取文件夹内图片列表
- 通过阿里云 OSS 创建选图链接和保存选图结果

## 环境变量

启动项目需要在项目根目录中新建一个 `.env.local` 文件，并在其中配置以下环境变量信息。

```
NEXT_PUBLIC_BAIDU_PCS_APPKEY=<百度云应用 AppKey>
NEXT_PUBLIC_OSS_APP_REGION=<阿里云 OSS 地区标识>
NEXT_PUBLIC_OSS_APP_APPKEY_ID=<阿里云 OSS AppKey ID>
NEXT_PUBLIC_OSS_APP_APPKEY_SECRET=<阿里云 OSS AppKey Secret>
NEXT_PUBLIC_OSS_BUCKET=<阿里云 OSS 用于存储选图信息的 Bucket>
THUMBNAIL_OSS_BUCKET=<阿里云 OSS 用于存储临时缩略图的 Bucket>
```

## Roadmap

- 增加其他存储方式的支持
- 支持本地文件 P2P 提供选图

## License

[MIT](https://choosealicense.com/licenses/mit/)
