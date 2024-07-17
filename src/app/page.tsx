"use client"

import React, { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import CampusData from "./context/CampusData";
import Link from "next/link";

export default function Home() {  
  
  return (
    <CampusData>
      <Navbar/>
      <Link href="/display/">
        <button className="border border-black"> go to display page</button>
      </Link>
    </CampusData>
  )
}
