// ✅ Fixed PublicLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../navBar";
import Footer from "../footer";

const PublicLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar /> 
      <main className="flex-grow">
        <Outlet key={location.pathname} />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
