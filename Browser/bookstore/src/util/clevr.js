
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
        return  fetch('http://localhost:4001/logout', {
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
        return fetch('http://localhost:4001/login',{
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
    getAllProduct(query){
        return fetch(`http://localhost:4001/product?${query}`, {
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
        return fetch(`http://localhost:4001/product/${id}`,{
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
        return fetch(`http://localhost:4001/product/related_product/${id}`,{
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
        return fetch(`http://localhost:4001/product/product_images/${id}`,{
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
        return fetch(`http://localhost:4001/review/${id}`,{
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
        return fetch(`http://localhost:4001/review/${id}`,{
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
    getRatingStat(id){
        return fetch(`http://localhost:4001/review/stat/${id}`,{
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
        return fetch(`http://localhost:4001/cart`,{
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
        return fetch(`http://localhost:4001/cart`,{
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
        return fetch(`http://localhost:4001/cart`,{
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
        return fetch(`http://localhost:4001/cart`,{
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
        return fetch(`http://localhost:4001/product/best-seller`,{
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
        return fetch(`http://localhost:4001/product/discount`,{
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
        return fetch('http://localhost:4001/category',{
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
        return fetch('http://localhost:4001/product/trending',{
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
        return fetch('http://localhost:4001/product/feature-book',{
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
        return fetch('http://localhost:4001/product/discount/flash-sale-endtime',{
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
        return fetch('http://localhost:4001/publisher',{
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
        return fetch(`http://localhost:4001/product/filter?${query}`,{
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
        return fetch(`http://localhost:4001/product/search?${query}`,{
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
        return fetch(`http://localhost:4001/category/category-filter?${category}`,{
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
    }

}
export default clevr