const config = require('config-lite')
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

mongolass.connect(config.mongodb)

exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bil: { type: 'string' }
})

exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
})

// 按创建时间降序查看用户的文章列表
exports.Post.index({ author: 1, _id: -1 }).exec()

mongolass.plugin('addCreateAt', {
  afterFind: function (results) {
    results.forEach(item => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

// 根据用户用户名找到用户，用户名全局唯一
exports.User.index({ name: 1 }, { unique: true }).exec()
