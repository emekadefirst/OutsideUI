import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from "react";
import HomePage from './pages'


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HomePage />
  </StrictMode>
);
