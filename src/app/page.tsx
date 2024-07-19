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

export default function Home() {  
  const [selecetedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string>(new Date().toISOString());

  
  return (
    <CampusData>
      <Navbar/>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <InfiniteTextSlider />
        <p className="text-xl pt-8 text-muted-foreground">
          Find an empty room
        </p>
        <div className="py-4">
          <>
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <SelectDropDown defaultValue={null} items={buildingsData} onChange={setSelectedBuilding} />
              <DatePicker onChange={setSelectedDateString} value={selectedDateString}/>
              <Link href={{ pathname: '/display', query: { buildingCode: selecetedBuilding } }}>
                  <Button variant="outline_grey_bg">Search</Button>
              </Link>
                    
            </div>
          </div>
          </>
        </div>
    </div>
    </CampusData>
  )
}
