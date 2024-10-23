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
    passport.authenticate("local"),
    (req, res) => {
      console.log(req.session);
      res.status(200).send('Login succesfull')
    }
);
app.use('/allproduct', allProductRouter)
app.use('/user', userRouter)
app.use('/cart', cartRouter)
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
});