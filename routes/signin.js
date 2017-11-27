const express = require('express')
const router = express.Router()
const sha1 = require('sha1')

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  let username = req.fields.name
  let password = req.fields.password

  UserModel.getUserByName(username)
    .then(function (user) {
      if (!user) {
        req.flash('error', '用户名不存在')
        return res.redirect('back')
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        req.flash('error', '密码错误')
        return res.redirect('back')
      }
      req.flash('success', '登录成功')
      // 用户信息写入到主页
      delete user.password
      req.session.user = user
      // 跳转到主页
      res.redirect('/posts')
    })
    .catch(next)
})

module.exports = router
