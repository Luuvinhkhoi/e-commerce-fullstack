const Pool= require('pg').Pool
const bcrypt=require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'elkhoikun282002',
    port: 5432,
});
const findById = (id) => {
  return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, result) => {
          if (error) {
              return reject(error);
          }
          if (result.rows.length > 0) {
              resolve(result.rows[0]);
          } else {
              resolve(null); 
          }
      });
  });
};

const createUser = async (request, response)=>{
    const {user_name, email, phone_number ,pass} = request.body
    const saltRound=await bcrypt.genSalt(10);
    const hashPassword=await  bcrypt.hash(pass, saltRound);
    if (hashPassword){
        const userId= await pool.query('insert into users(user_name, pass, email, phone_number) values ($1, $2, $3, $4) returning *', [user_name,hashPassword, email, phone_number])
        const cart= await pool.query('insert into cart (user_id) values ($1)',[userId.rows[0].user_id])    
        response.status(201).send(`User added with ID: ${userId.rows[0].user_id}`)
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
        console.log('Success');
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
const getCartByUserId=async(id)=>{
    try{
      const cart_id = await pool.query('select cart_id from cart where user_id=$1',[id])
      console.log(cart_id.rows[0].cart_id)
      const cartProduct = await pool.query('select product_id, quantity, price from cart_product where cart_id=$1',[cart_id.rows[0].cart_id])
      return cartProduct.rows
    }catch(err){
      throw new Error('Error'+err.message)
    }
}
const insertProductIntoCart=async(userId,productId, quantity)=>{
  try{
    console.log(productId)
    console.log(quantity)
    const cartId=await pool.query("select cart_id from cart where user_id=$1", [userId])
    const product = await pool.query("insert into cart_product(cart_id, product_id, quantity) values ($1, $2, $3)", [cartId.rows[0].cart_id, productId, quantity])
    return { message: 'Product added to cart' };
  }catch(error){
    throw new Error('Error'+err.message)
  }
}
const updateCart=async(userId, updateData)=>{
  try{
    const { product_id, quantity } = updateData;
    const cart_id = await pool.query('select cart_id from cart where user_id=$1', [userId])
    if (cart_id.rows.length === 0) {
      throw new Error('Cart not found');
    }
    // Thực thi câu lệnh SQL với quantity, cart_id và product_id
    const result = await pool.query("UPDATE cart_product SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3", [quantity, cart_id.rows[0].cart_id, product_id]);
    return {message:`Success update with ${cart_id.rows[0].cart_id}`};
  } catch (err){
    throw new Error('Error ' + err.message);
  }

}
const deleteProductInCartByProductId=async(userId, productId)=>{
    try{
      const cart_id = await pool.query('select cart_id from cart where user_id=$1', [userId])
      console.log(productId)
      console.log(cart_id.rows[0].cart_id)
      pool.query('Delete from cart_product where cart_id=$1 and product_id=$2', [cart_id.rows[0].cart_id,parseInt(productId, 10)]);
      return {message:`Success delete with ${productId}`}
    } catch(err){
      throw new Error('Error'+err.message)
    }
}
const deleteAllProductInCart=async(userId)=>{
  try{
    const cart_id = await pool.query('select cart_id from cart where user_id=$1', [userId])
    pool.query('Delete from cart_product where cart_id=$1',[cart_id.rows[0].cart_id]);
    return {message:`Success delete all product in cart`}
  } catch(err){
    throw new Error('Error'+err.message)
  }
}
const checkout=async(user_id, address)=>{
  try{
    console.log(address)
    const cartProduct=await getCartByUserId(user_id)
    console.log(cartProduct)
    if (!cartProduct || cartProduct.length===0){
      return ({message:'Failed'})
    }
    const totalPrice = cartProduct.reduce((total, product)=>{
      const price = parseFloat(product.price.replace('$', ''))
      return total + (product.quantity * price)
    }, 0)
    console.log(totalPrice)
    const order = pool.query('insert into orders (fee, address, user_id) values($1, $2, $3)',[totalPrice, address, user_id])
    const deleteCart = await deleteAllProductInCart(user_id)
    return ({ message: 'Checkout success'});
  } catch(error){
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
    deleteUserById,
    getCartByUserId, 
    insertProductIntoCart,
    updateCart,
    deleteAllProductInCart,
    deleteProductInCartByProductId,
    checkout
}