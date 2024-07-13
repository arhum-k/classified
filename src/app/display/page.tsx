"use client"

import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SelectDropDown from "../components/SelectDropDown";



export default function Display() {

  const [campusData, setCampusData] = useState(null)
  const [buildingCodes, setBuildingCodes] = useState<string[] | null>(null);
  const [selectedBuildingCode, setSelectedBuildingCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const effectRan = useRef(false);
  var todaysDate = new Date().toISOString();
  var selectedDate = "2024-07-15T00:00:00"

  useEffect(() => {
    if (effectRan.current === false) {
      getData()
      return () => {
        effectRan.current = true;
      }
    }
  }, [])

  async function getData() {
    const res = await fetch('api/getBuildings', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: selectedDate || todaysDate,
      }),
    }
    )
    const data = await res.json()
    setCampusData(data.result);
    setBuildingCodes(Object.keys(data.result))
    setIsLoading(false);
    console.log(data.result)

  }

  const buidlingDropDownSelectOptions = buildingCodes?.map((buildingCode) => ({
    value: buildingCode,
    label: campusData?.[buildingCode]?.["building_name"] || "Unknown Building",
  })) || [];

  console.log(selectedBuildingCode)
  if (isLoading) {
    return (
      <div>
        <Navbar/>
        <p>Loading...</p>
      </div>
    )
  } else {
  return (
    <>
      <Navbar />
      <div className="p-2">
        <SelectDropDown items={buidlingDropDownSelectOptions} onChange={setSelectedBuildingCode} />
      </div>
    </>
  )
}
}
