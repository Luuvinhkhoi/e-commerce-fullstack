import {Header} from "../Header/header.js";
import { Banner } from "../SlideBanner/Banner";
import {Main} from "../Main/main";
import { Footer } from "../Footer/footer.js";
import { Outlet } from "react-router-dom";
export const Root = () =>{
 return(
    <>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
 )
}