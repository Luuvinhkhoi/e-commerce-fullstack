const express=require('express');
const session= require('express-session');
//using crypto to create random sceret
const crypto = require('crypto');
const secret=crypto.randomBytes(64).toString('hex');
const bodyParser= require('body-parser')
const app=express();
const db=require('./index.js');
const port=4001;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const store=new session.MemoryStore();
const allProductRouter=require('./product.js')
const userRouter=require('./user.js')
const cartRouter=require('./cart.js')
const orderRouter=require('./order.js')
const Pool= require('pg').Pool;
require('dotenv').config();
var FacebookStrategy = require('passport-facebook').Strategy;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'e-commerce',
  password: 'elkhoikun282002',
  port: 5432,
});
app.use(
    session({
        secret: secret,
        cookie: {maxAge:30000000},
        resave: false,
        saveUninitialized: false,
        store,
    })
);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true,
}));
app.use(passport.initialize())
app.use(passport.session());
passport.use(new FacebookStrategy({ 
   clientID: process.env.FACEBOOK_APP_ID,
   clientSecret: process.env.FACEBOOK_APP_SECRET, 
   callbackURL: 'http://localhost:4001/oauth2/redirect/facebook' 
  },
   async function (accessToken, refreshToken, profile, done) {
     try { 
      const result = await pool.query('SELECT * FROM linked_profile WHERE provider = $1 AND subject = $2', [ 'https://www.facebook.com', profile.id ]); 
      let cred = result.rows[0]; 
      if (!cred) { 
        const insertUserRes = await pool.query('INSERT INTO users (user_name) VALUES ($1) RETURNING user_id', [ profile.displayName ]); 
        const userId = insertUserRes.rows[0].user_id; 
        console.log(userId)
        await pool.query('INSERT INTO linked_profile (user_id, provider, subject) VALUES ($1, $2, $3)', [ userId, 'https://www.facebook.com', profile.id ]); 
        const user = { 
          id: userId.toString(), 
          name: profile.displayName 
        };
        return done(null, user); 
      } 
      else { 
        const userRes = await pool.query('SELECT * FROM users WHERE user_id = $1', [cred.user_id]); 
        const user = userRes.rows[0]; 
        if (!user) { 
          return done(null, false); 
        } 
        return done(null, user); } 
      } catch (err) { 
        return done(err); 
      } 
   } 
));
passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.user_id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findById(id); // Gọi findById
        console.log("Deserialized user:", user); // Log user
        done(null, user); // Hoặc done(null, false) nếu không tìm thấy user
    } catch (error) {
        done(error); // Kích hoạt lỗi nếu có lỗi
    }
});

passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'pass' }, // Đặt tên trường cho email và password
    db.login // Gọi hàm login để xác thực
));
app.post('/register',db.createUser);
app.post("/login",
    passport.authenticate("local",{failureRedirect: '/login'}),
    (req, res) => {
      res.redirect('/homepage')
      res.status(200).send('Login succesfull')
    }
);
app.get('/oauth2/redirect/facebook',
  passport.authenticate('facebook', { failureRedirect: 'localhost:3000/login', failureMessage: true }),
  function(req, res) {
    res.redirect('http://localhost:3000/');
});
app.get('/login/facebook', passport.authenticate('facebook'));
function authorizedUser(req, res, next) {
    // Check for the authorized property within the session
    if (req.session.authorized) {
      // next middleware function is invoked
      return next();
    }
    else {
      res.status(403).json({ msg: "You're not authorized to view this page" });
    }
};
  
app.use('/allproduct', allProductRouter)
app.use('/user',authorizedUser, userRouter)
app.use('/cart',authorizedUser, cartRouter)
app.use('/order',authorizedUser, orderRouter)
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
});