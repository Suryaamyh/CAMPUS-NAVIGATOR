import React from "react";

export const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "0.5rem 1rem",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    {children}
  </button>
);
