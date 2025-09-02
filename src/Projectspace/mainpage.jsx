import React from "react";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Map from "./projectspace.jsx";
import Contact from "./contact.jsx";
import AdminLogin from"./Admin.jsx";
import HomePage from "./Maphome.jsx";
import Findmap from "./Findmap.jsx";
import ScrollToTop from './ScrollToTop';
import CampusNavigator from "../CampusNavigator.jsx";
import CardsPage from"./places.jsx";
import LoginPage from './login.jsx';
import AdminPage from "./Admin.jsx";

const Mainpage = () => {
    return (
        <>
            <BrowserRouter>
            <ScrollToTop /> 

                <Routes>
                    <Route path="/" element={<Map />} >
                        <Route index element={<HomePage />} />
                        <Route path="/contact" element={<LoginPage/>} />
                         <Route path="/AdminPage" element={<AdminPage/>} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/findmap" element={<CampusNavigator/>} />
                        <Route path="/places" element={<CardsPage/>}/>
                        <Route path="/findroute" element={<CampusNavigator/>} />
                        <Route path="/find-route/:hallticket" element={<CampusNavigator/>} />


                    </Route>
                </Routes>
            </BrowserRouter>


        </>
    )
}
export default Mainpage;