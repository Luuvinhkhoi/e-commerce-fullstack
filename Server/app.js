const express=require('express');
const session= require('express-session');
//using crypto to create random sceret
const crypto = require('crypto');
const secret=crypto.randomBytes(64).toString('hex');
const bodyParser= require('body-parser')
const app=express();
const db=require('./index.js');
const cors = require('cors');
const port=4001;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const store=new session.MemoryStore();
const productRouter=require('./product.js')
const categoryRouter=require('./category.js')
const userRouter=require('./user.js')
const cartRouter=require('./cart.js')
const orderRouter=require('./order.js');
const uploadRouter=require('./upload.js')
const imageRouter=require('./image.js')
const reviewRouter=require('./review.js');
const publisherRouter = require('./publisher.js');
const Pool= require('pg').Pool;
require('dotenv').config();
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oidc').Strategy;
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
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
          maxAge: 30*60*1000,
          httpOnly: false,   // Đảm bảo rằng cookie không thể bị truy cập từ client-side JavaScript
          secure: false,
          sameSite: 'lax'    // set thành true khi sử dụng HTTPS, false cho môi trường phát triển (HTTP)
        },
    })
);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true,
}));
app.use(passport.initialize())
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:3000', // Chỉ cho phép frontend từ origin này
  methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE'], // Chỉ cho phép các phương thức này
  credentials: true, // Nếu cần gửi cookie hoặc thông tin xác thực
}));

passport.use(new FacebookStrategy({ 
   clientID: process.env.FACEBOOK_APP_ID,
   clientSecret: process.env.FACEBOOK_APP_SECRET, 
   callbackURL: 'http://localhost:4001/oauth2/redirect/facebook' 
  },
   async function (accessToken, refreshToken, profile, done) {
     console.log('get access token success')
     console.log(profile)
     try { 
      const result = await pool.query('SELECT * FROM linked_profile WHERE provider = $1 AND subject = $2', [ 'https://www.facebook.com', profile.id ]); 
      let cred = result.rows[0]; 
      if (!cred) { 
        const insertUserRes = await pool.query('INSERT INTO users (user_name) VALUES ($1) RETURNING user_id', [ profile.displayName ]); 
        const userId = insertUserRes.rows[0].user_id; 
        console.log('facebook:', userId)
        await pool.query('INSERT INTO linked_profile (user_id, provider, subject) VALUES ($1, $2, $3)', [ userId, 'https://www.facebook.com', profile.id ]); 
        const user = { 
          user_id: userId.toString(), 
          name: profile.displayName 
        };
        return done(null, user); 
      } 
      else { 
        const userRes = await pool.query('SELECT * FROM users WHERE user_id = $1', [cred.user_id]); 
        const user = userRes.rows[0]; 
        console.log('facebook:', user)
        if (!user) { 
          return done(null, false); 
        } 
        return done(null, user); } 
      } catch (err) { 
        return done(err); 
      } 
   } 
));
passport.use(new GoogleStrategy({ 
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:4001/oauth2/redirect/google',
  scope: ['profile', 'email'] 
 },
  async function(issuer, profile, done)  {
    console.log('get access token success')
    console.log(issuer)
    console.log(profile)
    try { 
     const result = await pool.query('SELECT * FROM linked_profile WHERE provider = $1 AND subject = $2', [  issuer, profile.id ]); 
     let cred = result.rows[0]; 
     if (!cred) { 
       const insertUserRes = await pool.query('INSERT INTO users (user_name, email) VALUES ($1, $2) RETURNING user_id', [ profile.displayName, profile.emails[0].value ]); 
       const userId = insertUserRes.rows[0].user_id; 
       await pool.query('INSERT INTO linked_profile (user_id, provider, subject) VALUES ($1, $2, $3)', [ userId, issuer, profile.id ]); 
       const cart= await pool.query('insert into cart (user_id) values ($1) returning cart_id',[userId])   
       const user = { 
         user_id: userId.toString(), 
         name: profile.displayName 
       };
       return done(null, user); 
     } 
     else { 
       const userRes = await pool.query('SELECT * FROM users WHERE user_id = $1', [cred.user_id]); 
       const user = userRes.rows[0]; 
       console.log('gmail:', user)
       if (!user) { 
         return done(null, false); 
       } 
       return done(null, user); } 
     } catch (err) { 
       return done(err); 
     } 
  } 
));

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'pass' }, // Đặt tên trường cho email và password
  db.login // Gọi hàm login để xác thực
));
passport.serializeUser((user, done) => {
    //console.log(`Serilize user:`, user)
    try{
      done(null, user.user_id);
    }catch(error){
      console.log(error)
    }
});
  
passport.deserializeUser(async (id, done) => {
    //console.log("Deserialized user:")
    try {
        const user = await db.findById(id); // Gọi findById
        //console.log("Deserialized user:", user); // Log user
        done(null, user); // Hoặc done(null, false) nếu không tìm thấy user
    } catch (error) {
        done(error); // Kích hoạt lỗi nếu có lỗi
    }
});

app.get('/profile', (req, res) => { 
  if (req.isAuthenticated()) { 
    res.json({ user_name: req.user.user_name, email: req.user.email, phoneNumber:req.user.phone_number }); 
  } else { 
    res.status(401).json({ message: 'Not authenticated' }); 
  } 
});
app.post('/sign-up', async (req, res) => { 
  const user= await db.createUser(req)  
  req.login(user, (err) => { 
    if (err) { 
      return res.status(500).json({ message: 'Registration error' }); 
    } 
    return res.json({ message: 'Registration successful', user }); 
  }); 
});
app.post('/login', passport.authenticate('local'), (req, res) => {
   res.status(200).json({ message: 'Login successful', user: req.user }); 
});
app.get('/oauth2/redirect/facebook',
  passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/login', failureMessage: true }),
  function(req, res) {
    res.redirect('http://localhost:3000/')
  }
);
app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/login/google', passport.authenticate('google'));
app.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login', failureMessage: true }),
  function(req, res) {
    res.redirect('http://localhost:3000/')
  }
);
function authorizedUser(req, res, next) {
    // Check for the authorized property within the session
    console.log(`AUTHORIZE${req.session.authorized}`)
    if (req.isAuthenticated()) {
      // next middleware function is invoked
      return next();
    }
    else {
      res.status(403).json({ msg: "You're not authorized to view this page" });
    }
};


app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({message:'Logout sucess'})
  });
});
app.use(express.json());
app.use('/product', productRouter)
app.use('/category',categoryRouter)
app.use('/user',authorizedUser, userRouter)
app.use('/cart',authorizedUser, cartRouter)
app.use('/order',authorizedUser, orderRouter)
app.use('/upload', uploadRouter)
app.use('/image', imageRouter)
app.use('/review', reviewRouter)
app.use('/publisher', publisherRouter)
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
});