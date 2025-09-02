import React, { useEffect, useState } from "react";
import styles from "./places.module.css";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";


const places = [
  {
    id: 1,
    name: "COTTON BHAVAN",
    image: "./cottonbhavan.jpg",
    location: { lat: 17.088013678520706, lng: 82.0667950465543  }
  },
  
  {
    id: 2,
    name: "BILLGATES BHAVAN",
    image: "./billgates.jpg",
    location: { lat: 17.092048984036087, lng: 82.06640841953042 }
  },
  {
    id: 3,
    name: "RATAN TATA BHAVAN",
    image: "ratantata.jpg",
    location: { lat: 17.08795723335775, lng: 82.06637848866677  }
  },
  {
    id: 4,
    name: "ABDUL KALAM BHAVAN",
    image: "abdulkalam.jpeg",
    location: { lat: 17.089056623438385, lng: 82.07063327728969 }
  },
  {
    id: 5,
    name: "VISWESHAWARA BHAVAN",
    image: "./billgates.jpg",
    location: { lat: 17.083573264111504,  lng:82.06608739002958 }
  },
  {
    id: 6,
    name: "POLYTECHNIC BLOCK",
    image: "polytechnic.jpeg",
    location: { lat: 17.089783767698407, lng: 82.0706835499637 }
  },
  {
    id: 7,
    name: "TECHINICAL HUB",
    image: "thub.webp",
    location: { lat:17.088088610205524,lng: 82.06865164902284}
  },
  {
    id: 8,
    name: " EAT AND PLAY CANTEEN",
    image: "pencil.jpeg",
    location: { lat:17.090146902454094, lng: 82.07188911043804}
  },
  {
    id: 9,
    name: "GALLERY",
    image: "gallery.jpeg",
    location: { lat:17.09013527375354, lng: 82.06792337577386 }
  }
];


const CardsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setErrorMessage("Unable to retrieve your location. Please allow GPS access.");
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
    }
  }, []);

  const openInGoogleMaps = (location) => {
    if (!userLocation) {
      alert(errorMessage || "User location not available yet.");
      return;
    }
    const directionUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${location.lat},${location.lng}&travelmode=driving`;
    window.open(directionUrl, "_blank");
  };

  return (
    <div>
      {loadingLocation && (
        <div className={styles.loader}>Detecting your location via GPS...</div>
      )}
      {errorMessage && !loadingLocation && (
        <div className={styles.error}>{errorMessage}</div>
      )}
      <div className={styles.gridContainer}>
        {places.map((place) => (
          <motion.div key={place.id} className={styles.cardWrapper}>
            <Card className={styles.card}>
              <img src={place.image} alt={place.name} className={styles.image} />
              <CardContent className={styles.cardContent}>
                <h3 className={styles.placeName}>{place.name}</h3>
                <button className={styles.get} onClick={() => openInGoogleMaps(place.location)}>
                  Get Directions
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CardsPage;
