# 学习nodejs搭建简单博客



**运行方法**
- 必须先启动MongoDB，然后才能通过`supervisor index`运行程序

## module.exports 和 exports的区别
- module.exports 初始值为一个空对象{}
- exports是指向module.exports的引用
- require()返回的module.exports而不是exports

常见用法:
`exports = module.exports = {...}`
原理：module.exports指向了新的对象，因此断开了exports与module.exports的连接，然后重新将exports指向module.exports

## 环境变量
环境变量就是传递参数给运行程序的，在mac和linux下输入env，会列出当前的环境变量

## semver(语义化版本)
semver格式：`主版本号.次版本号.修订号`。版本号递增规则如下：
- 主版本号：做了不兼容的API修改
- 此版本号：做了向下兼容的功能性新增
- 修订号：做了向下兼容的bug修正

## npm的使用
`npm i express --save --save-exact` 这种方式安装模块(例如：express)时，会锁定模块的版本号

- 设置安装npm模块时锁定版本号
`npm config set save-exact true`
使用上面命令后，每次使用`npm i xxx --save`的时候会锁定依赖的版本号，相当于加了`--save-exact`参数

- npm shrinkwrap
前面说了使用`--save-exact`参数安装模块时，会锁定模块的版本号，但是这种方式只能锁定模块最外层的版本号，模块内部依赖的其他模块的版本并不会被锁定，
因此，可以运行`npm shrinkwrap`命令，在目录下生成`npm-shrinkwrap.json`的文件，它会计算出模块的依赖树及版本，在使用`npm install`进行安装时，如果有`npm-shrinkwrap.json`文件，则优先使用该文件，否则使用`package.json`进行安装


## node下监听文件改变 supervisor 模块
安装：`npm i -g supervisor`

## Nodejs相关
### res.render
```js
const express = require('express')
const router = express.Router()

router.get('/:name', function (req, res) {
  res.render('users', {
    name: req.params.name
  })
})

module.exports = router
```
`res.render()`中的users表示的是模板的名字，第二个参数是传给模板的数据，这里传入的是name

### res.set设置views

## ejs的使用
使用模板引擎通常不是一个页面对应一个模板，而是把模板拆成可复用的模板片段组合使用。
如一个页面包含header、footer和body，一般会建立三个模板，然后将其组成在一个成为一个页面

**引入组件**
使用`<%- inlude('components')> %>`

## express
### 中间件与next
express中的中间件(middleware)就是用来处理请求的，当一个“中间件”处理完，可以调用`next()`传递给下一个中间件，如果没有调用`next()`，则请求不会往下传递，
如内置的`res.render`其实就是渲染完html直接返回给客户端，没有调用`next()`，从而没有传递给下一个中间件。如下：
```js
const express = require('express')
const app = express()

app.use(function (req, res, next) {
  console.log('1')
  next()
})

app.use(function (req, res, next) {
  console.log('2')
  res.status(200).end()
})

app.listen(3000)
```
此时访问`localhost:3000`，终端会输出：
```js
1
2
```

通过`app.use`加载中间件，在中间件中通过`next`将请求传递到下一个中间件，`next`可以接受一个参数用于接受错误信息，如果使用了`next(error`，则会返回错误而不会传递到下一个中间件

### app.locals 和 res.locals
在模板中我们用到了 blog、user、success、error 变量，我们将 blog 变量挂载到 app.locals 下，将 user、success、error 挂载到 res.locals
express 中有两个对象可用于模板的渲染：`app.locals` 和 `res.locals`. 
在调用 res.render 的时候，express 合并（merge）了 3 处的结果后传入要渲染的模板，优先级：res.render 传入的对象> res.locals 对象 > app.locals 对象，所以 app.locals 和 res.locals 几乎没有区别，都用来渲染模板，使用上的区别在于：**app.locals 上通常挂载常量信息（如博客名、描述、作者信息），res.locals 上通常挂载变量信息，即每次请求可能的值都不一样（如请求者信息，res.locals.user = req.session.user）**

## config-lite模块
不管是小项目还是大项目，将配置与代码分离是一个非常好的做法。我们通常将配置写到一个配置文件里，如 config.js 或 config.json ，并放到项目的根目录下。但实际开发时我们会有许多环境，如本地开发环境、测试环境和线上环境等，不同环境的配置不同（如：MongoDB 的地址），我们不可能每次部署时都要去修改引用 config.test.js 或者 config.production.js。config-lite 模块正是你需要的。
`config-lite`是一个轻量级的读取配置文件的模块。config-lite会根据环境(`NODE_ENV`)的不同，加载config目录下不同的配置文件。
如果不设置`NODE_ENV`，则读取默认的default配置文件，如果设置了NODE_ENV，则会合并指定的配置文件和default配置文件作为配置

## 路由和功能设计
接口API设计要遵循`RESTful`，参考文章：
- http://www.ruanyifeng.com/blog/2011/09/restful
- http://www.ruanyifeng.com/blog/2014/05/restful_api.html

**注意**：路由的加载顺序很重要
### 会话
因为HTTP协议是无状态的，如果服务器需要记录用户的状态，则需要某种机制来识别用户，这个机制就是`会话(session)`。

**cookie和session的区别**
- cookie存储在浏览器端(有大小限制), session存储在服务器端(没有大小限制)
- 通常session的实现是基于cookie的，session id存储在cookie中
- session更安全，cookie可以直接查看和编辑
更多session资料，参考：https://www.zhihu.com/question/19786827
**注意**: 上面的说的几点不知道是否准确，session是否就是一种会话机制，例如当用户注册时，服务器端会生成唯一的一个session id给用户，以后用户与服务器端进行http通信时，必须在http中添加该session id用于识别该用户，而该id可以放在cookie中一起传输给服务器

通过引入`express-session`中间件实现对会话的支持：
`app.use(session(option))`
session 中间件会在 req 上添加 session 对象，即 req.session 初始值为 {}，当我们登录后设置 req.session.user = 用户信息，返回浏览器的头信息中会带上 set-cookie 将 session id 写到浏览器 cookie 中，那么该用户下次请求时，通过带上来的 cookie 中的 session id 我们就可以查找到该用户，并将用户信息保存到 req.session.user。

### 页面通知


### 权限控制
例如一个博客，在没有登录的情况下，只能查看不能更改，同时，即使在登录的情况下也无法更改别人的帖子，这就是**权限管理**。
如何实现权限管理？**把用户状态的检查封装成一个中间件，在每个需要权限管理的路由加载该中间件，即可实现权限管理**

## mongodb安装与启动

### 运行 MongoDB
1. 创建一个 data directory
`mkdir -p /data/db`

2. 设置 /data/db 目录的读写权限
Before running mongod for the first time, ensure that the user account running mongod has read and write permissions for the directory.

3. Run MongoDB
输入`mongod`启动mongoDB


## 页面设计
- 将页面拆分为组件，然后使用ejs的include方法将组件组合起来进行渲染


## 使用到的模块
- 加密
  使用 `sha1`



















