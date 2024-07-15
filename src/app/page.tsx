"use client"

import React, { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import CampusData from "./context/CampusData";

export default function Home() {  
  
  return (
    <CampusData>
      <Navbar/>
      <div>HOME PAGE</div>
    </CampusData>
  )
}
