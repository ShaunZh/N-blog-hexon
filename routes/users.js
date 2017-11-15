const express = require('express');
const router = express.Router();

router.get('/:name', function( req, res ) {
  // 调用 res.render 函数渲染ejs模板，
  // users: 是模板名字，在index.js中的app.set设置了users，指向的是views/users.ejs
  // 第二个参数是传给模板的数据，这里传入name，则在ejs模板中可以使用name
  // res.render 函数的作用是将模板与数据结合生成html，同时设置响应头中的 Content-Type: text/html，告诉浏览器我返回的是html，要按html来展示
  res.render('users', {
    name: req.params.name
  });
});

module.exports = router;
