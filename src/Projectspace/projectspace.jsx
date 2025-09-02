import React from 'react';
import Maphead from './Maphead';
import Slides from './slides.jsx';
import MapFooter from './MapFooter';
import HomePage from "./Maphome.jsx";
import { Link, Outlet } from "react-router-dom";

const Map = () => {
  return (
    <>
      <Maphead/>
     
      <Outlet/>

      <MapFooter/>
      
      
            
      


    </>
  );
};

export default Map;
