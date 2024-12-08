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
    getAllProduct(){
        return fetch('http://localhost:4001/product', {
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
    }
}
export default clevr