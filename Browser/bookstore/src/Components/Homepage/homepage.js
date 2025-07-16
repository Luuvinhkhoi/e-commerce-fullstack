import {Header} from "../Header/header.js";
import { Banner } from "../SlideBanner/Banner";
import {Main} from "../Main/main";
import { Footer } from "../Footer/footer.js";
import { Outlet } from "react-router-dom";
export const Root = () =>{
 return(
    <>
      <Header></Header>
      <div style={{backgroundColor:'#FBF7FC', height:'3rem'}}></div>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
 )
}