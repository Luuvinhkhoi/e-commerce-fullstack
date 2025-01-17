const Pool= require('pg').Pool
const bcrypt=require('bcrypt');
const e = require('cors');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cron = require('node-cron');
require('dotenv').config();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: process.env.DATABASE_PASSWORD,
  
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
    const {user_name, email, pass} = request.body
    const saltRound=await bcrypt.genSalt(10);
    const hashPassword=await  bcrypt.hash(pass, saltRound);
    if (hashPassword){
        const userId= await pool.query('insert into users(user_name, pass, email) values ($1, $2, $3) returning *', [user_name,hashPassword, email])
        const cart= await pool.query('insert into cart (user_id) values ($1) returning cart_id',[userId.rows[0].user_id])   
        if (!cart){
          throw new Error('Failed to create cart');
        } 
        return userId.rows[0]
    } else{
        throw new Error('Failed to hash password');
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
const countItemInEachCategory= async()=>{
  try{ 
    const result = await pool.query('select category.category_name, count(product.category_id) from product inner join category on product.category_id=category.category_id group by product.category_id, category.category_name');
    if(result){
      return result.rows
    }
  } catch (error){
    throw error
  }
}
const getProductFromDatabaseByCategoryName = async (offset, pageSize,categoryName) => {
  try {
      const categoryResult = await pool.query('SELECT category_id FROM category WHERE category_name=$1', [categoryName]);
      if (categoryResult.rows.length === 0) {
          return { message: 'Category not found' };
      }
      const categoryId = categoryResult.rows[0].category_id;
      const productResult = await pool.query(`SELECT *
        FROM product
        LEFT JOIN (
          SELECT DISTINCT ON (product_id) product_id, cloudinary_url
          FROM product_images
        ) AS product_images
        ON product.product_id = product_images.product_id
        INNER JOIN category
        ON product.category_id = category.category_id
        where category.category
        LIMIT $1 OFFSET $2`, [categoryId]);
      if (productResult.rows.length === 0) {
          return { message: 'No products found for this category' };
      }
      return productResult.rows; // trả về danh sách sản phẩm
  } catch (error) {
      console.error("Error fetching products:", error);
      throw error; // ném lỗi nếu có
  }
};

const getAllProductFromDatabase = (offset, limit) => {
  return new Promise((resolve, reject) => {
    const query = `
      WITH BestSeller AS (
          SELECT 
              product.product_id,
              product.product_name,
              product.quantity,
              product.category_id,
              product_images.cloudinary_url
          FROM 
              product
          JOIN (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images order by product_id)
              product_images ON product.product_id = product_images.product_id
          order by product.quantity asc
          limit 5
      )
      SELECT 
          product.product_id,
          product.product_name,
          product.quantity,
          product.price,
          category.category_name,
          product_images.cloudinary_url,
          flash_sales.sale_price,
          CASE 
              WHEN BestSeller.product_id IS NOT NULL THEN 'Best Seller'
              ELSE 'Normal'
          END AS product_status
      FROM 
          product
      LEFT JOIN (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images)
          product_images ON product.product_id = product_images.product_id
      LEFT JOIN 
          category ON product.category_id = category.category_id
      LEFT JOIN 
          BestSeller ON product.product_id = BestSeller.product_id
      left join(select product_id as flashSale_productId,sale_price from flash_sales) flash_sales
            on product.product_id=flash_sales.flashSale_productId
      limit $1 offset $2
    `;
    pool.query(query, [limit, offset], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};
const countTotalProduct= async()=>{
  const result=await pool.query('select count(product_id) from product')
  return result.rows
}
const countFilterProduct=async(category, publisher, format, min, max)=>{
  const result = await pool.query(
      `SELECT *
       FROM product
       LEFT JOIN (
           SELECT DISTINCT ON (product_id) product_id, cloudinary_url 
           FROM product_images
       ) product_images
       ON product.product_id = product_images.product_id
       INNER JOIN category 
       ON product.category_id = category.category_id
       WHERE (category.category_name = COALESCE($1, category_name))
         AND (publisher = COALESCE($2, publisher))
         AND (format = COALESCE($3, format))
         AND (price >= COALESCE($4, price) AND price <= COALESCE($5, price))`
  ,[category, publisher, format, min, max])
  return result.rows.length
}
const getPublisher=async()=>{
  const result = await pool.query('select distinct on(publisher)publisher from product')
  const product= result.rows
  return product
}
const getProductFromDatabaseById=async(id)=>{
    console.log(id)
    const result = await pool.query('select * from product left join(select product_id as flashSale_productId,sale_price, stock_quantity from flash_sales) flash_sales on product.product_id=flash_sales.flashSale_productId where product_id=$1',[id])
    const product= result.rows[0]
    return product
}
const getProductImageFromDatabaseById=async(id)=>{
  const result= await pool.query('select cloudinary_url from product_images where product_id=$1',[id])
  return result.rows
}
const getRelatedProduct=async(id)=>{
  const categoryId = await pool.query('select category_id from product where product_id=$1',[id])
  const result=await pool.query('select * from product left join (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images) product_images on product.product_id=product_images.product_id where product.category_id=$1 and product.product_id != $2 limit 3',[categoryId.rows[0].category_id, id])
  return result.rows
}
const getSameAuthorProduct=async(id)=>{
  const author = await pool.query('select author from product where product_id=$1',[id])
  const result=await pool.query('select * from product left join product_images on product.product_id=product_images.product_id where product.author=$1',[author])
  return result.rows
}
const filterProduct=async(category, publisher, format, min, max, pageSize, offset)=>{
  
  try{
    let result = await pool.query(
      `WITH BestSeller AS (
          SELECT 
              product.product_id,
              product.product_name,
              product.quantity,
              product.category_id,
              product_images.cloudinary_url
          FROM 
              product
          JOIN (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images order by product_id)
              product_images ON product.product_id = product_images.product_id
          order by product.quantity asc
          limit 5
      )
      SELECT 
          product.product_id,
          product.product_name,
          product.quantity,
          product.price,
          category.category_name,
          product_images.cloudinary_url,
          flash_sales.sale_price,
          CASE 
              WHEN BestSeller.product_id IS NOT NULL THEN 'Best Seller'
              ELSE 'Normal'
          END AS product_status
      FROM 
          product
      LEFT JOIN (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images)
          product_images ON product.product_id = product_images.product_id
      LEFT JOIN 
          category ON product.category_id = category.category_id
      LEFT JOIN 
          BestSeller ON product.product_id = BestSeller.product_id
      left join(select product_id as flashSale_productId,sale_price from flash_sales) flash_sales
      on product.product_id=flash_sales.flashSale_productId
       WHERE (category.category_name = COALESCE($1, category_name))
         AND (publisher = COALESCE($2, publisher))
         AND (format = COALESCE($3, format))
         AND (price >= COALESCE($4, price) AND price <= COALESCE($5, price))
       LIMIT $6 OFFSET $7;`,
      [category, publisher, format, min, max, pageSize, offset]
    );
    return result.rows
  } catch (error){
    throw new Error('Error: ' + error.message);
  }
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
    console.log(columnNames)
    console.log(columnValues)
    console.log(setClause)
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
      const cartProduct = await pool.query('select cart_product.*, product_images.cloudinary_url FROM cart_product LEFT JOIN (SELECT * FROM product_images WHERE id IN (SELECT MIN(id) FROM product_images GROUP BY product_id)) product_images ON cart_product.product_id = product_images.product_id where cart_product.cart_id=$1',[cart_id.rows[0].cart_id])
      const productIds = cartProduct.rows.map(row => row.product_id);
      const productResults = await Promise.all(
        productIds.map(async (productId) => {
          const productResult = await pool.query(`select
          product.*, 
          COALESCE(flash_sales.sale_price, 0) as sale_price, 
          COALESCE(flash_sales.stock_quantity, 0) as stock_quantity
          from 
              product 
          left join 
              (select 
                  product_id as flashSale_productId, 
                  sale_price, 
                  stock_quantity 
              from flash_sales) flash_sales 
          on 
              product.product_id = flash_sales.flashSale_productId 
          where product.product_id=$1`, [productId]);
          return productResult.rows[0];
        })
      );
      console.log(productResults)
      const productMap = new Map(productResults.map(p => [p.product_id, p]));
      const combined = 
        cartProduct.rows.map(cartItem => ({
          ...productMap.get(cartItem.product_id), // Lấy sản phẩm chi tiết từ bản đồ
          cart_quantity: cartItem.cart_quantity,
          cloudinary_url: cartItem.cloudinary_url
        }))
      ;
      return combined
    }catch(err){
      throw new Error('Error'+err.message)
    }
}
const insertProductIntoCart=async(userId,productId, quantity)=>{
  try{
    const cartId=await pool.query("select cart_id from cart where user_id=$1", [userId])
    const existingItem=await pool.query('select product_id from cart_product where cart_id=$1 and product_id=$2',[cartId.rows[0].cart_id, productId])
    if(existingItem.rows.length>0){
      await pool.query("UPDATE cart_product SET cart_quantity = cart_quantity + $1 WHERE cart_id = $2 AND product_id = $3", [quantity, cartId.rows[0].cart_id, productId]);
    } else{
      const product = await pool.query("insert into cart_product(cart_id, product_id, cart_quantity) values ($1, $2, $3)", [cartId.rows[0].cart_id, productId, quantity])
    }
    return { message: 'Product added to cart' };
  }catch(error){
    throw new Error('Error'+error.message)
  }
}
const updateCart=async(userId, updateData)=>{
  try{
    const products=updateData.map(({product_id, cart_quantity})=>({product_id,cart_quantity}))
    console.log(updateData)
    const cart_id = await pool.query('select cart_id from cart where user_id=$1', [userId])
    if (cart_id.rows.length === 0) {
      throw new Error('Cart not found');
    }
    // Thực thi câu lệnh SQL với quantity, cart_id và product_id
    const productResults = await Promise.all(
      products.map(async (product) => {
        const productResult = await pool.query('update cart_product set cart_quantity = $1 where cart_id = $2 and product_id = $3', [product.cart_quantity, cart_id.rows[0].cart_id, product.product_id]);
        return productResult.rows[0];
      })
    );
    console.log(productResults)
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
const checkout=async(user_id,province, city, ward , address,phone_number, payment_method, name, fee)=>{
  try{
    const cartProduct=await getCartByUserId(user_id)
    if (!cartProduct || cartProduct.length===0){
      return ({message:'Failed'})
    }
    const totalPrice = cartProduct.reduce((total, product)=>{
      return total + (product.quantity * product.price)
    }, 0)
    const order = await pool.query('insert into orders (name, province, city, ward ,address, payment_method, total_price, shipping_fee, user_id, phone_number) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *',[name,province , city , ward,address,payment_method,totalPrice, fee,user_id, phone_number])
    const cart_id = await pool.query('select cart_id from cart where user_id=$1',[user_id])
    const cart_product = await pool.query('select product_id, quantity from cart_product where cart_id=$1',[cart_id.rows[0].cart_id])
    const order_product=await Promise.all(
      cart_product.rows.map(async (product)=>{
        const productResult=await pool.query('insert into order_product (order_id, product_id, quantity) values ($1, $2, $3)',[order.rows[0].order_id,product.product_id, product.quantity])
        return productResult.rows[0]
      })
    )
    const isFlashSale=await Promise.all(
      cart_product.rows.map(async (product)=>{
        const productResult=await pool.query('select * from flash_sales where product_id=$1',[product.product_id])
        return productResult.rows[0]
      })
    )
    console.log(isFlashSale)
    if(isFlashSale.length>0){
      const minus_quantity=await Promise.all(
        cart_product.rows.map(async (product)=>{
          const productResult=await pool.query('update flash_sales set stock_quantity= stock_quantity-$1 where product_id=$2',[product.quantity, product.product_id])
          return productResult.rows[0]
        })
      )
    }
    const minus_quantity=await Promise.all(
      cart_product.rows.map(async (product)=>{
        const productResult=await pool.query('update product set quantity= quantity-$1 where product_id=$2',[product.quantity, product.product_id])
        return productResult.rows[0]
      })
    )
    const deleteCart = await deleteAllProductInCart(user_id)
    return ({ message: 'Checkout success'});  
  } catch(error){
    throw new Error('Error'+error.message)
  }
}
const getOrderByUserId=async(user_id)=>{
  try{
    const orderId= await pool.query(`select order_id,total_price,TO_CHAR(order_time, 'YYYY-MM-DD') AS formatted_date from orders where user_id=$1`,[user_id])
    const orderTime=orderId.rows
    const orderDetail= await Promise.all(
      orderId.rows.map(async(order)=>{
        const result= await pool.query(
          `select * from order_product inner join(select product_id ,product_name, price from product) product 
          on order_product.product_id=product.product_id 
          left join (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images) product_images
          on order_product.product_id=product_images.product_id where order_id=$1`,[order.order_id])
        return result.rows
      })
    )
    return ({orderDetail, orderTime})
  } catch(error){
    throw new Error('Error'+error.message)
  }
}
const upload=async(cloudinary_url,productId)=>{
  try{
    const result=await pool.query('INSERT INTO product_images (cloudinary_url, product_id) VALUES ($1, $2)',
    [cloudinary_url ,productId])
    return (result.rows[0])
  } catch(error){
    throw new Error('Error'+error.message)
  }
}
const getAllImage=async()=>{
  try{
    const result=await pool.query('Select * from product_images where width=300 and height=500')
    return (result.rows)
  } catch(error){
    throw new Error('Error'+error.message)
  }
}
const getReview=async(id, userId)=>{
  try{
    const result=await pool.query('Select * from product_review left join users on product_review.user_id=users.user_id where product_id=$1',[id])
    const productReview=result.rows
    const isReview=await pool.query('Select * from product_review where user_id=$1 and product_id=$2',[userId, id])
    const isReviewResult=isReview.rows
    return ({productReview, isReviewResult})
  } catch(error){
    throw new Error('Error'+error.message)
  }
}
const addReview=async(score, content, product_id, user_id)=>{
  try{
    const result= await pool.query('Insert into product_review(score, content, product_id, user_id) values($1,$2,$3,$4)', [score, content, product_id, user_id])
    return result.rows
  } catch(error){
    throw new Error('Error'+error.message)
  }
}
const getRatingScore=async(id)=>{
  try{
    const result=await pool.query(`SELECT 
         SUM(score) AS total_score,
         COUNT(score) AS count_review,
         COUNT(CASE WHEN score = 5 THEN 1 END) AS count_5_star,
         COUNT(CASE WHEN score = 4 THEN 1 END) AS count_4_star,
         COUNT(CASE WHEN score = 3 THEN 1 END) AS count_3_star,
         COUNT(CASE WHEN score = 2 THEN 1 END) AS count_2_star,
         COUNT(CASE WHEN score = 1 THEN 1 END) AS count_1_star
       FROM product_review 
       WHERE product_id = $1`, [id])
    const {
      total_score,
      count_review,
      count_5_star,
      count_4_star,
      count_3_star,
      count_2_star,
      count_1_star,
    } = result.rows[0]
    return {
      totalScore: Number(total_score) || 0,
      countReview:Number(count_review) || 0,
      count5Star:Number(count_5_star) || 0,
      count4Star:Number(count_4_star) || 0,
      count3Star:Number(count_3_star) || 0,
      count2Star:Number(count_2_star) || 0,
      count1Star:Number(count_1_star) || 0,
    };
  } catch(error){
    throw new Error('Error'+error.message)
  }
}
const updateReview=async(id,userId , updateData)=>{
  try{
    const fieldsToUpdate = updateData;
    if (!id || Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).send('Failed');
    }
    const columnNames = Object.keys(fieldsToUpdate);
    const columnValues = Object.values(fieldsToUpdate);
  
    const setClause = columnNames
      .map((columnName, index) => `${columnName} = $${index + 1}`)
      .join(', ');
    const query = `UPDATE product_review SET ${setClause} WHERE user_id = $${columnNames.length + 1} AND product_id = $${columnNames.length + 2}`;
    await pool.query(query, [...columnValues, parseInt(userId, 10), parseInt(id, 10)]);
    return {message:`Success update with ${id}`};
  } catch(error){
    return error.message
  }
}
const getBestSeller=async()=>{
  try{
    const result = await pool.query(`SELECT 
      product.*, 
      product_images.cloudinary_url, 
      category.category_name
    FROM product
    LEFT JOIN (
      SELECT DISTINCT ON (product_id) product_id, cloudinary_url
      FROM product_images
      ORDER BY product_id, id ASC
    ) product_images 
    ON product.product_id = product_images.product_id
    INNER JOIN category 
    ON product.category_id = category.category_id
    ORDER BY product.quantity ASC
    LIMIT 5;`)
    return result.rows
  } catch(error){
    throw error.message
  }
}
const getDiscountItem=async()=>{
  try{
    const productResult=await pool.query('Select * from flash_sales inner join product on product.product_id=flash_sales.product_id left join (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images) product_images on product_images.product_id=flash_sales.product_id inner join category on product.category_id=category.category_id')
    return productResult.rows
  } catch(error){
    throw error.message
  }
}
const getTrendingItem=async()=>{
  try{
    const result=await pool.query(`SELECT * FROM product
    left join  (
        SELECT DISTINCT ON (product_id) product_id, cloudinary_url
        FROM product_images
    ) product_images
    on product.product_id=product_images.product_id
    LIMIT 6;`)
    return result.rows
  } catch (error){
    throw error.message
  }
}
const handleFlashSale = async () => {
  try {
    console.log('Starting flash sale process...');

    const now = new Date();
    const endTime = new Date();
    endTime.setDate(now.getDate() + 1);

    // 1. Xóa các sản phẩm flash-sale đã hết hạn và cộng lại số lượng thừa
    const expiredProducts = await pool.query(
      'SELECT product_id, stock_quantity FROM flash_sales WHERE end_time < $1',
      [now]
    );

    for (let product of expiredProducts.rows) {
      await pool.query(
        'UPDATE product SET quantity = quantity + $1 WHERE product_id = $2',
        [product.stock_quantity, product.product_id]
      );
    }

    await pool.query('DELETE FROM flash_sales WHERE end_time < $1', [now]);
    console.log('Expired flash sale items cleaned and quantities restored.');

    // 2. Lấy 3 sản phẩm có quantity cao nhất
    const productResult = await pool.query(
      'SELECT product_id, price, quantity FROM product ORDER BY quantity DESC LIMIT 3'
    );

    for (let product of productResult.rows) {
      const saleQuantity = product.quantity; // Tối đa 20 sản phẩm
      const salePrice = product.price * 0.8;

      // Giảm số lượng trong bảng product
      const result= await pool.query(
        'UPDATE product SET quantity = quantity - $1 WHERE product_id = $2',
        [saleQuantity, product.product_id]
      );
      console.log(result.rows)
      // Thêm sản phẩm vào flash_sales
      await pool.query(
        `INSERT INTO flash_sales 
         (product_id, sale_price, stock_quantity, start_time, end_time, initial_quantity)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [product.product_id, salePrice, saleQuantity, now, endTime, saleQuantity]
      );
    }

    console.log('Flash sale items added successfully.');
  } catch (error) {
    console.error('Error handling flash sale:', error.message);
  }
};
const getFeatureBook= async ()=>{
  try{
    const result=await pool.query('SELECT DISTINCT ON (category_id) product.product_id, product_name, description, price, product_images.cloudinary_url,product.category_id, category.category_name FROM product left join (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images) product_images on product.product_id=product_images.product_id inner join category on product.category_id=category.category_id')
    return result.rows
  } catch (error){
    throw error.message
  }
}
const findBookByName=async(name)=>{
  try{
    const result=await pool.query(`
      WITH BestSeller AS (
          SELECT 
              product.product_id,
              product.product_name,
              product.quantity,
              product.category_id,
              product_images.cloudinary_url
          FROM 
              product
          JOIN (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images order by product_id)
              product_images ON product.product_id = product_images.product_id
          order by product.quantity asc
          limit 5
      )
      SELECT 
          product.product_id,
          product.product_name,
          product.quantity,
          product.price,
          category.category_name,
          product_images.cloudinary_url,
          flash_sales.sale_price,
          CASE 
              WHEN BestSeller.product_id IS NOT NULL THEN 'Best Seller'
              ELSE 'Normal'
          END AS product_status
      FROM 
          product
      LEFT JOIN (SELECT DISTINCT ON (product_id) product_id, cloudinary_url FROM product_images)
          product_images ON product.product_id = product_images.product_id
      LEFT JOIN 
          category ON product.category_id = category.category_id
      LEFT JOIN 
          BestSeller ON product.product_id = BestSeller.product_id
      left join(select product_id as flashSale_productId,sale_price from flash_sales) flash_sales
            on product.product_id=flash_sales.flashSale_productId
      where product.product_name ilike $1`,[`%${name}%`]
    )
    return result.rows
  } catch (error){
    throw error.message
  }
} 

cron.schedule('17 12 * * *', () => {
    console.log('Running flash sale process at 12 AM...');
    handleFlashSale();
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh" // Múi giờ Việt Nam
  }
);
module.exports={
    createUser,
    login,
    findById,
    getAllProductFromDatabase,
    getProductFromDatabaseById,
    getAllCategoryFromDatabase,
    countItemInEachCategory,
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
    checkout, 
    getOrderByUserId,
    upload,
    getAllImage, 
    getSameAuthorProduct,
    getRelatedProduct,
    getProductImageFromDatabaseById,
    getReview,
    addReview, 
    getRatingScore,
    updateReview,
    getBestSeller, 
    getDiscountItem,
    getTrendingItem,
    getFeatureBook,
    getPublisher,
    filterProduct,
    countTotalProduct,
    countFilterProduct,
    findBookByName, 
}