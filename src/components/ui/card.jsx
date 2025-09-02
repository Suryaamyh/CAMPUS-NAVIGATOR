import React from "react";

export const Card = ({ children, className }) => (
  <div className={className} style={{ border: "1px solid #ccc", borderRadius: "12px" }}>
    {children}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={className} style={{ padding: "1rem" }}>
    {children}
  </div>
);
