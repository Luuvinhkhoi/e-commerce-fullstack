const Pool= require('pg').Pool
const bcrypt=require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { response } = require('express');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'elkhoikun282002',
    port: 5432,
});
const findById=(id)=>{
  const user = pool.query('select * from users where id=$1',[id], ()=>{
  if (user){
    return user
  } else{
    throw error
  }
  })
}
const createUser = async (request, response)=>{
    const {userName, email, phoneNumber ,password} = request.body
    const saltRound=await bcrypt.genSalt(10);
    const hashPassword=await  bcrypt.hash(password, saltRound);
    if (hashPassword){
        pool.query('insert into users(user_name, pass, email, phone_number) values ($1, $2, $3, $4) returning *', [userName,hashPassword, email, phoneNumber], (error, results)=>{
            if (error){
                throw error
            } else if (!Array.isArray(results.rows)||results.rows.length < 1){
                throw error
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`)
        })    
    } else{
        reponse.status(500).send('Fall to hashpassword')
    }
};
const login = async (email, password, done)=>{
    try {
        // Tìm kiếm người dùng trong cơ sở dữ liệu dựa trên email
        const result = await pool.query('SELECT user_id, email, pass FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // Nếu không tìm thấy người dùng, trả về false
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        // So sánh mật khẩu đã hash với mật khẩu đã nhập
        const matchFound = await bcrypt.compare(password, user.pass);

        // Nếu mật khẩu không khớp, trả về false
        if (!matchFound) {
            return done(null, false, { message: 'Incorrect password' });
        }

        // Xác thực thành công, trả về người dùng
        return done(null, user);
    } catch (error) {
        // Trả về lỗi nếu có
        return done(error);
    }
};

module.exports={
    createUser,
    login,
    findById
}