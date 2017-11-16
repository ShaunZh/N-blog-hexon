module.exports = {
  port: 3000,
  session: {
    secret: 'N-blog',
    key: 'N-blog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/N-blog'
}
