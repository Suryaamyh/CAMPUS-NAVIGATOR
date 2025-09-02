import React, { useEffect, useState } from "react";

const Notification = ({ message, onClose, isNight }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: visible ? 20 : -300,
        backgroundColor: isNight ? "#f6bd60" : "#ff6f61",
        color: isNight ? "#000" : "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "all 0.4s ease-in-out",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: 600,
      }}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: isNight ? "#000" : "#fff",
          fontWeight: "bold",
          fontSize: 18,
          cursor: "pointer",
        }}
        aria-label="Close notification"
      >
        ✖
      </button>
    </div>
  );
};

export default Notification;
