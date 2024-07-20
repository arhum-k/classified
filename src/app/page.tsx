"use client"

import React, { useEffect, useState, useRef, useContext } from "react";
import Navbar from "./components/Navbar";
import CampusData, { CampusDataContext } from "./context/CampusData";
import Link from "next/link";
import InfiniteTextSlider from "./components/InfiniteTextSlider";
import SelectDropDown from "./components/SelectDropDown";
import { DatePicker } from "./components/DatePicker";
import { Button } from "@/components/ui/button";
import buildingsData from "./context/buildingsData";
import Layout from "./layouts/Layout";

export default function Home() {  
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string>(new Date().toISOString());

  async function fetchData() {
    const res = await fetch("api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    })
    const data = await res.json();
    console.log(data);
  } 

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <CampusData>
      <Layout>
      <div className="relative flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-32 md:mt-64">
          <InfiniteTextSlider />
          <p className="text-xl pt-2 md:pt-6 text-muted-foreground text-center"> 
            Find an empty room.
          </p>
          <div className="py-4">
            <>
              <div className="flex flex-col md:flex-row items-center justify-between pb-10 mb-4 space-y-4 md:space-y-0"> 
                <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-2 space-y-4 md:space-y-0">
                  <SelectDropDown defaultValue={null} items={buildingsData} onChange={setSelectedBuilding} />
                  <DatePicker onChange={setSelectedDateString} value={selectedDateString} />
                  <Link href={{ pathname: '/display', query: { buildingCode: selectedBuilding } }}>
                    <Button variant="outline_grey_bg">Search</Button>
                  </Link>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
      </Layout>
    </CampusData>
  );
  
}
  