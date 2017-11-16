const path = require('path');
const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');

// 设置存放模板文件的目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs 
app.set('view engine', 'ejs');

//app.use('/', indexRouter);
// app.use('/users', userRouter);
app.use(function (req, res, next) {
  console.log('1');
  next(new Error('haha'));
});

app.use(function (req, res, next) {
  console.log('2');
  res.status(200).end();
});

app.use(function (err, req, res, next) { 
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000);
