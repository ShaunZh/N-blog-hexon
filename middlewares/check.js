module.exports = {
  // 当用户信息不存在时，判断为没有登录，则跳转到登录页面，同时显示 未登录 通知，
  // 需要用户登录才能操作的页面
  checkLogin: function checkLogin (req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录');
      return res.redirect('/signin');
    }
    next();
  },
  // 当用户信息存在是，则认为已经登录了，显示 已登录 通知，并重定向登录之前的页面
  checkNotLogin: function checkNotLogin (req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录');
      return res.redirect('back');    // 返回之前的页面
    }
    next();
  }

}
