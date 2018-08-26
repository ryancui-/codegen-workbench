# 代码生成平台 codegen-workbench

在 Web 页面配置代码生成器信息，生成代码并自动提交到对应的 Git 项目中。不需要在本地配置代码生成项目，直接在 Server 端执行。

## 技术栈

- Node.js + Koa v2
- jQuery + Vue.js + Bootstrap

## 开发

- 将 `config/config.default.js` 复制为新的一份 `config/config.local.js`，并做好相应的配置（Gitlab 地址、Gitlab Private Token 等）

- 安装依赖，调试模式开启服务，访问 localhost:3000 即可

```shell
$ npm i

$ npm run dev
```

## 部署

- 将 `config/config.default.js` 复制为新的一份 `config/config.local.js`，并做好相应的配置（Gitlab 地址、Gitlab Private Token 等）

- 安装依赖，生产模式开启服务（注意需要全局安装 pm2）

```shell
$ npm i

$ npm run prd
```
