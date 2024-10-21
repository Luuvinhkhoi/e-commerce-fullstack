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
const getAllCategoryFromDatabase = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM category', (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};
const convert = (string) => {
  const categoriesMap = {
      'ao_khoac': 'Áo khoác',
      'ao_thun': 'Áo thun',
      'quan_dai': 'Quần dài',
      'phu_kien': 'Phụ kiện',
  };

  return categoriesMap[string] || slug.replace(/_/g, ' ')
};

const getProductFromDatabaseByCategoryName = async (categoryName) => {
  const category_name = convert(categoryName);
  console.log(category_name)
  try {
      const categoryResult = await pool.query('SELECT category_id FROM category WHERE category_name=$1', [category_name]);

      if (categoryResult.rows.length === 0) {
          return { message: 'Category not found' };
      }
      console.log(categoryResult)
      const categoryId = categoryResult.rows[0].category_id;
      const productResult = await pool.query('SELECT * FROM product WHERE category_id = $1', [categoryId]);
      if (productResult.rows.length === 0) {
          return { message: 'No products found for this category' };
      }
      return productResult.rows; // trả về danh sách sản phẩm
  } catch (error) {
      console.error("Error fetching products:", error);
      throw error; // ném lỗi nếu có
  }
};

const getAllProductFromDatabase=()=>{
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM product', (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
}
const getProductFromDatabaseById=async(id)=>{
    const result = await pool.query('select * from product where product_id=$1',[id])
    const product= result.rows
    return product
}
module.exports={
    createUser,
    login,
    findById,
    getAllProductFromDatabase,
    getProductFromDatabaseById,
    getAllCategoryFromDatabase,
    getProductFromDatabaseByCategoryName,
}