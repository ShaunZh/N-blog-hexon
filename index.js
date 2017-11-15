const path = require('path');
const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');

// 设置存放模板文件的目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs 
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(3000);
