import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import {
  FaMapMarkerAlt,
  FaMicrophone,
  FaMicrophoneSlash
} from 'react-icons/fa';
import './index.css';

const Marker = ({ text, color = "#e63946" }) => (
  <div style={{ color, fontSize: 28, position: "relative", textShadow: "0 0 4px #fff" }}>
    <FaMapMarkerAlt />
    <div style={{
      position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)",
      background: "rgba(255, 255, 255, 0.9)", padding: "4px 10px", borderRadius: 8,
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)", fontWeight: "600", fontSize: 14,
      whiteSpace: "nowrap", color: "#1d3557", pointerEvents: "none"
    }}>
      {text}
    </div>
  </div>
);

const locations = {
  "Cotton Bhavan": { lat: 17.088013678520706, lng: 82.0667950465543 },
  "Aditya Cbse Academy": { lat:17.08997223257523, lng:82.07345946281688},
  "Aditya Engineering College Gallery" : { lat:17.09013527375354, lng: 82.06792337577386},
  "satya canteen":{ lat: 17.09293626571032, lng: 82.06759757609912},
  "Aditya Eat and play girls hostel canteen " : {lat:17.090146902454094, lng: 82.07188911043804},
  "aditya college bus stop": { lat:17.08393946387457, lng: 82.06629712401173},
  "Aditya Park":{ lat:17.092235444926867, lng: 82.06813137287268},
  "Aditya eng college. Canten":{ lat:17.09090982325976 , lng: 82.06746030621622},
  "Kakinada Buses Ground":{lat :17.089841353872, lng: 82.06751267260867},
  "Technical Hub":{lat:17.088088610205524,lng: 82.06865164902284},
  "Ratan Tata bhavan": { lat: 17.08795723335775, lng: 82.06637848866677 },
  "Bill Gates Bhavan": { lat: 17.092048984036087, lng: 82.06640841953042 },
  "Polytechnic College": { lat: 17.089783767698407, lng: 82.07068354996372 },
  "Abdul Kalam Bhavan": { lat: 17.089056623438385, lng: 82.07063327728969 },
  "ADITYA DEGREE & PG COLLEGE": { lat: 17.090102694297926, lng: 82.07163748347436 },
  "MECHANICAL BLOCK,ACET": { lat: 17.091639541979518, lng: 82.0669544515233 },
  "Viswesharayya Bhavan": { lat: 17.083573264111504,  lng:82.06608739002958 },
};

export default function CampusNavigator() {
  const [center, setCenter] = useState({ lat: 17.089, lng: 82.067 });
  const [zoom] = useState(17);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [mapObject, setMapObject] = useState(null);
  const [mapsObject, setMapsObject] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [places, setPlaces] = useState([]);
  const [placePhotoUrl, setPlacePhotoUrl] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const recognitionRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (userLocation && selected && mapObject && mapsObject) {
      const directionsService = new mapsObject.DirectionsService();
      if (directionsRenderer) directionsRenderer.setMap(null);
      const newRenderer = new mapsObject.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: { strokeColor: "#0d6efd", strokeWeight: 5 }
      });
      newRenderer.setMap(mapObject);
      setDirectionsRenderer(newRenderer);
      directionsService.route(
        {
          origin: userLocation,
          destination: locations[selected],
          travelMode: mapsObject.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK") newRenderer.setDirections(result);
        }
      );
    }
  }, [userLocation, selected, mapObject, mapsObject]);

  const handleSearch = () => {
    if (locations[query]) {
      setSelected(query);
      setCenter(locations[query]);
      setQuery("");
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else alert("Building not found.");
  };

  const toggleFavorite = (placeName) => {
    const updated = favorites.includes(placeName)
      ? favorites.filter(f => f !== placeName)
      : [...favorites, placeName];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "2.2rem", marginBottom: "1.2rem", color: "black" }}>
        Campus Navigator
      </h1>

      <div className="navigator-controls" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", padding: "10px 20px", borderRadius: "12px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: "900px" }}>
        <input list="building-list" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search building" className="search-input" style={{ flexGrow: 1, minWidth: "250px" }} />
        <datalist id="building-list">
          {Object.keys(locations).map((key) => <option key={key} value={key} />)}
        </datalist>
        <button onClick={handleSearch} className="search-button">Search</button>
        <button onClick={() => {
          if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
          } else {
            recognitionRef.current.start();
            setIsListening(true);
          }
        }} className={`mic-button ${isListening ? "listening" : ""}`} title={isListening ? "Stop voice input" : "Start voice input"}>
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
      </div>

      {selected && (
        <div style={{ marginBottom: "20px", backgroundColor: "lightblue", padding: "16px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <h2 style={{ color: "#222", marginBottom: "10px" }}>{selected}</h2>
        </div>
      )}

      <div ref={mapRef} style={{ height: "500px", width: "100%", borderRadius: "16px", overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}>
        <GoogleMapReact bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, libraries: ["places", "geometry"] }} center={center} zoom={zoom} options={{ disableDefaultUI: true }} yesIWantToUseGoogleMapApiInternals onGoogleApiLoaded={({ map, maps }) => {
          setMapObject(map);
          setMapsObject(maps);
        }}>
          {userLocation && <Marker lat={userLocation.lat} lng={userLocation.lng} text="You" color="#2a9d8f" />}
          {selected && <Marker lat={locations[selected].lat} lng={locations[selected].lng} text={selected} color="#e63946" />}
        </GoogleMapReact>
      </div>
    </div>
  );
}
