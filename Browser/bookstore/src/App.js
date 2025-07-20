import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import { Header } from './Components/Header/header';
import { Footer } from './Components/Footer/footer';
import { Banner } from './Components/SlideBanner/Banner';
import { Cart } from './Components/Cart/cart';
import { Main } from './Components/Main/main';
import { Login } from './Components/Login/login';
import { Signup } from './Components/Sign-up/sign-up';
import { Root } from './Components/Homepage/homepage';
import { BookDetail } from './Components/BookDetail/bookDetail';
import { SearchResult } from './Components/SearchResult/searchResult';
import { Checkout } from './Components/Checkout/checkout';
import { Profile } from './Components/Profile/profile';
import NotFound from './Components/Not found/notFound';
function App() {
  const router=createBrowserRouter(createRoutesFromElements(
      <>
        <Route path='/' element={<Root></Root>}>
          <Route index element={<Main></Main>}></Route>
          <Route path="*" element={<NotFound />} />
          <Route path='/search' element={<SearchResult></SearchResult>}></Route>
          <Route path='/book/:id' element={<BookDetail></BookDetail>}></Route>
          <Route path='/cart' element={<Cart></Cart>}></Route>
          <Route path='/profile' element={<Profile></Profile>}></Route>
          <Route path='/checkout' element={<Checkout></Checkout>}></Route>
        </Route>
        <Route path='/login' element={<Login></Login>}></Route>   
        <Route path='/sign-up' element={<Signup></Signup>}></Route> 
      </>  
  ))
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
