"use client"

import { useEffect, useState, useRef } from "react";

export default function Home() {

  const [campusData, setCampusData] = useState(null);
  const effectRan = useRef(false);
  var todaysDate = new Date().toISOString();

  useEffect(() => {
    if (effectRan.current === false) {
      getData()
      return () => {
        effectRan.current = true;
      }
    }
  },[])

  async function getData(){
    const res = await fetch('api/getBuildings', {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: todaysDate,
      }),
    }
    )
    const data = await res.json()
    console.log(data.result)
    setCampusData(data.result);

  }
  

  
  return (
    <>
      <nav></nav>
      <div className='border border-4'>Get Available Rooms</div>
    </>
  )
}
