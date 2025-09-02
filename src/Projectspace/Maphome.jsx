import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import styles from './maphome.module.css';
import Slides from './slides.jsx';
import Findmap from "./Findmap.jsx";

const HomePage= () => {
  return (
    <>
     <Slides/>
     <Findmap/>
    
    </>
  );
};

export default HomePage;
