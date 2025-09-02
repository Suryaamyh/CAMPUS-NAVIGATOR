
import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import './index.css';
import {
  FaMapMarkerAlt,
  FaSun,
  FaMoon,
  FaMicrophone,
  FaMicrophoneSlash
} from 'react-icons/fa';
import Notification from './Notification';

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
  "Ratan Tata bhavan": { lat: 17.08795723335775, lng: 82.06637848866677 },
  "Bill Gates Bhavan": { lat: 17.092048984036087, lng: 82.06640841953042 },
  "Polytechnic College": { lat: 17.089783767698407, lng: 82.07068354996372 },
  "Abdul Kalam Bhavan": { lat: 17.089056623438385, lng: 82.07063327728969 },  
  "ADITYA DEGREE & PG COLLEGE": { lat: 17.090102694297926, lng: 82.07163748347436 },
  "MECHANICAL BLOCK,ACET": { lat: 17.091639541979518, lng: 82.0669544515233 },
  "Viswesharayya Bhavan": { lat: 17.09080190882834, lng: 82.06695378436845 },
};

export default function CampusNavigator() {
  const [center, setCenter] = useState({ lat: 17.089, lng: 82.067 });
  const [zoom] = useState(17);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [theme, setTheme] = useState("day");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const mapRef = useRef(null);

  const mapOptions = {
    styles: [
      { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
      { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "landscape", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "all", elementType: "labels.text.fill", stylers: [{ visibility: "off" }] },
      { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
      { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
    ],
    disableDefaultUI: true
  };

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

  const handleSearch = () => {
    if (locations[query]) {
      setSelected(query);
      setQuery("");
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      alert("Building not found.");
    }
  };

  const toggleTheme = () => setTheme((t) => (t === "day" ? "night" : "day"));
  const isNight = theme === "night";

  return (
    <div className={`page-container ${isNight ? "night" : "day"}`}>
      <h1 style={{ fontSize: "2.2rem", marginBottom: "1.2rem", color: isNight ? "#f6bd60" : "#333" }}>
         Campus Navigator
      </h1>

      <div
        className="navigator-controls"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          padding: "10px 20px",
          borderRadius: "12px",
          backgroundColor: isNight ? "#1c1c2b" : "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "900px"
        }}
      >
        <input
          list="building-list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search building"
          className={`search-input ${isNight ? "night" : "day"}`}
          style={{ flexGrow: 1, minWidth: "250px" }}
        />
        <datalist id="building-list">
          {Object.keys(locations).map((key) => <option key={key} value={key} />)}
        </datalist>
        <button onClick={handleSearch} className={`search-button ${isNight ? "night" : "day"}`}>
          Search
        </button>
        <button
          onClick={() => {
            if (isListening) {
              recognitionRef.current.stop();
              setIsListening(false);
            } else {
              recognitionRef.current.start();
              setIsListening(true);
            }
          }}
          className={`mic-button ${isListening ? "listening" : isNight ? "night" : "day"}`}
          title={isListening ? "Stop voice input" : "Start voice input"}
        >
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={toggleTheme} className={`theme-toggle-btn ${isNight ? "night" : "day"}`}>
          {isNight ? <FaSun /> : <FaMoon />}
          {isNight ? "Day" : "Night"}
        </button>
      </div>

      <div
        ref={mapRef}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            libraries: ["places", "geometry"]
          }}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          {userLocation && (
            <Marker lat={userLocation.lat} lng={userLocation.lng} text="You" color="#2a9d8f" />
          )}
          {selected && (
            <Marker
              lat={locations[selected].lat}
              lng={locations[selected].lng}
              text={selected}
              color="#e63946"
            />
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
}
