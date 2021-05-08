const MongoStore = require('connect-mongo');
const session = require('express-session');

module.exports = app => {
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/express-basic-auth-dev',
        ttl: 24 * 60 * 60
      }),
      secret: process.env.SESS_SECRET,
      resave: true, 
      saveUninitialized: true, 
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      }
    })
  )
}
