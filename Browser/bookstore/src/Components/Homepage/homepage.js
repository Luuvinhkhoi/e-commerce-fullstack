import {Header} from "../Header/header.js";
import { Banner } from "../SlideBanner/Banner";
import {Main} from "../Main/main";
import { Outlet } from "react-router-dom";
export const Root = () =>{
 return(
    <>
      <Header></Header>
      <Banner></Banner>
      <Main></Main>
    </>
 )
}