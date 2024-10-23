const Pool= require('pg').Pool
const bcrypt=require('bcrypt');
const passport = require("passport");
const { deleteUser } = require('../../my-back-end-app/queries');
const LocalStrategy = require("passport-local").Strategy;
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
    const {userName, email, phoneNumber ,pass} = request.body
    const saltRound=await bcrypt.genSalt(10);
    const hashPassword=await  bcrypt.hash(pass, saltRound);
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
const createProduct=async(product_name, description, price, quantity, category_id)=>{
  try {
    let result;
    if (description) {
      result = await pool.query(
        'INSERT INTO product (product_name, description, price, quantity, category_id) VALUES ($1, $2, $3, $4, $5)',
        [product_name, description, price, quantity, category_id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO product (product_name, price, quantity, category_id) VALUES ($1, $2, $3, $4)',
        [product_name, price, quantity, category_id]
      );
    }
    return { message: 'Success' };
  } catch (error) {
    throw new Error('Error: ' + error.message);
  }
};
const updateProduct=async(id, updateData)=>{
  try{
    const fieldsToUpdate = updateData;
    console.log(fieldsToUpdate)
    if (!id || Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).send('Failed');
    }
    const columnNames = Object.keys(fieldsToUpdate);
    const columnValues = Object.values(fieldsToUpdate);
  
    const setClause = columnNames
      .map((columnName, index) => `${columnName} = $${index + 1}`)
      .join(', ');
    const query = `UPDATE product SET ${setClause} WHERE product_id = $${columnNames.length + 1}`;
    console.log(query)
    console.log([...columnValues, id])
    await pool.query(query, [...columnValues, parseInt(id, 10)]);
    return {message:`Success update with ${id}`};
  } catch (err){
    throw new Error('Error ' + err.message);
  }

}
const deleteAllProduct=async(id)=>{
  try{
    pool.query('Delete from product');
    return {message:`Success delete all product`}
  } catch(err){
    throw new Error('Error'+err.message)
  }
}
const deleteProductById=async(id)=>{
  try{
    pool.query('Delete from product where product_id=$1', [id]);
    return {message:`Success delete with ${id}`}
  } catch(err){
    throw new Error('Error'+err.message)
  }
}
const getAllUser=async()=>{
  return new Promise((resolve, reject) => {
    try{
      pool.query('select * from users', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    } catch(error){
      throw new Error('Error'+err.message)
    }
  })
}
const getUserById=async(id)=>{
  return new Promise((resolve, reject)=>{
    try{
      pool.query('select * from users where user_id=$1',[id],(error, results)=>{
        if(error){
          reject(error)
        } else{
          resolve(results.rows)
        }
      })   
    }catch(err){
      throw new Error('Error'+err.message)
    }
  })
}
const updateUser=async(id, updateData)=>{
  try{
    const fieldsToUpdate = updateData;
    console.log(fieldsToUpdate)
    if (!id || Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).send('Failed');
    }
    const columnNames = Object.keys(fieldsToUpdate);
    const columnValues = Object.values(fieldsToUpdate);
  
    const setClause = columnNames
      .map((columnName, index) => `${columnName} = $${index + 1}`)
      .join(', ');
    const query = `UPDATE users SET ${setClause} WHERE user_id = $${columnNames.length + 1}`;
    console.log(query)
    console.log([...columnValues, id])
    await pool.query(query, [...columnValues, parseInt(id, 10)]);
    return {message:`Success update with ${id}`};
  } catch (err){
    throw new Error('Error ' + err.message);
  }

}
const deleteUserById=async(id)=>{
    try{
      pool.query('Delete from users where user_id=$1', [id]);
      return {message:`Success delete with ${id}`}
    } catch(err){
      throw new Error('Error'+err.message)
    }
}
const deleteAllUser=async(id)=>{
  try{
    pool.query('Delete from users');
    return {message:`Success delete all user`}
  } catch(err){
    throw new Error('Error'+err.message)
  }
}
module.exports={
    createUser,
    login,
    findById,
    getAllProductFromDatabase,
    getProductFromDatabaseById,
    getAllCategoryFromDatabase,
    getProductFromDatabaseByCategoryName,
    createProduct,
    updateProduct,
    deleteProductById,
    deleteAllProduct, 
    getAllUser,
    getUserById,
    updateUser,
    deleteAllUser,
    deleteUserById
}