
const baseUrl="http://localhost:4001"
let clevr={
    sigUpAccount(userName, email, password){
        console.log(userName)
        return fetch(`${baseUrl}/sign-up`,{
            method:'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: userName,
                email: email,
                pass: password
            }),
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            console.log(response);
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getUserProfile(){
        return fetch(`${baseUrl}/profile`,{
            method:'GET',
            credentials: 'include'
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            console.log(response);
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    logOut(){
        return  fetch(`${baseUrl}/logout`, {
            method: 'POST',
            credentials: 'include',
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }
            return response
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    logIn(email, password){
        return fetch(`${baseUrl}/login`,{
            method:'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pass: password
            }),
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            console.log(response);
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });

    },
    facebookLogin(){
        return fetch(`${baseUrl}/login/facebook`,{
            method:'GET',
            credentials:'include',
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            console.log(response);
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    emailLogin(){
        return fetch(`${baseUrl}/login/google`,{
            method:'GET',
            credentials:'include',
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            console.log(response);
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getAllProduct(query){
        return fetch(`${baseUrl}/product?${query}`, {
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getBookDetail(id){
        console.log(id)
        return fetch(`${baseUrl}/product/${id}`,{
            method:'GET'
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getRelatedBook(id){
        return fetch(`${baseUrl}/product/related_product/${id}`,{
            method:'GET'
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getProductImages(id){
        return fetch(`${baseUrl}/product/product_images/${id}`,{
            method:'GET'
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    submitReview(score, content, id){
        console.log(score)
        console.log(content)
        return fetch(`${baseUrl}/review/${id}`,{
            method:'POST',
            credentials: 'include',
            body:JSON.stringify({
                score,
                content
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getReview(id){
        return fetch(`${baseUrl}/review/${id}`,{
            method:'GET',
            credentials:'include'
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getRatingStat(id){
        return fetch(`${baseUrl}/review/stat/${id}`,{
            method:'GET',
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getCart(){
        return fetch(`${baseUrl}/cart`,{
            method:'GET',
            credentials:'include',
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    insertCart(product_id, quantity){
        return fetch(`${baseUrl}/cart`,{
            method:'POST',
            credentials:'include',
            body:JSON.stringify({
                product_id,
                quantity
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    updateCart(updateData){
        console.log(updateData)
        return fetch(`${baseUrl}/cart`,{
            method:"PUT",
            credentials:'include',
            body:JSON.stringify({
                updateData
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    deleteItemInCart(id){
        return fetch(`${baseUrl}/cart`,{
            method:"DELETE",
            credentials:'include',
            body:JSON.stringify({
                id
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getBestSeller(){
        return fetch(`${baseUrl}/product/best-seller`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    },
    getFlashSaleItems(){
        return fetch(`${baseUrl}/product/discount`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    }, getAllCategory(){
        return fetch(`${baseUrl}/category`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    }, getTrendingItem(){
        return fetch(`${baseUrl}/product/trending`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    }, getFeatureItem(){
        return fetch(`${baseUrl}/product/feature-book`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    }, getEndtime(){
        return fetch(`${baseUrl}/product/discount/flash-sale-endtime`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        });
           
    }, getPublisher(){
        return fetch(`${baseUrl}/publisher`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        }); 
    }, filterProduct(query){
        return fetch(`${baseUrl}/product/filter?${query}`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        }); 
    }, getProductByName(query){
        return fetch(`${baseUrl}/product/search?${query}`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        }); 
    }, getProductByCategory(category){
        return fetch(`${baseUrl}/category/category-filter?${category}`,{
            method:"GET",
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Reques failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        }); 
    }, checkout(name, province, city, ward ,address, payment_method, fee, phone_number){
        return fetch(`${baseUrl}/cart/checkout`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json" 
            },
            credentials:'include',
            body:JSON.stringify({
                name,
                province,
                city,
                ward,
                address,
                payment_method,
                fee,
                phone_number
            })
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Request failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        }); 
    }, updateUser(updateData){
        return fetch(`${baseUrl}/user`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json" 
            },
            credentials:'include',
            body:JSON.stringify({
                updateData
            })
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Request failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        });
    }, getOrderHistory(){
        return fetch(`${baseUrl}/order`,{
            method:"GET",
            credentials:'include'
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Request failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        });
    },updateReview(updateData, id){
        return fetch(`${baseUrl}/review/${id}`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json" 
            },
            credentials:'include',
            body:JSON.stringify({
                updateData
            })
        }).then(response=>{
            if (response.ok){
                return response.json()
            }
            throw Error('Request failed')
        }).then(jsonResponse=>{
            if(!jsonResponse){
                console.log('response error')
            } return jsonResponse
        }). catch(networkError=>{
            console.log(networkError.message)
        })
    }
}
export default clevr