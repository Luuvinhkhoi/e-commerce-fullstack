import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import { Header } from './Components/Header/header';
import { Banner } from './Components/SlideBanner/Banner';
import { Main } from './Components/Main/main';
import { Login } from './Components/Login/login';
import { Signup } from './Components/Sign-up/sign-up';
import { BookGrid} from './Components/BookGrid/bookGrid';
import { Root } from './Components/Homepage/homepage';
function App() {
  const router=createBrowserRouter(createRoutesFromElements(
      <>
        <Route path='/' element={<Root></Root>}>
        </Route>
        <Route path='/search' element={<BookGrid></BookGrid>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>   
        <Route path='/sign-up' element={<Signup></Signup>}></Route> 
      </>  
  ))
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
