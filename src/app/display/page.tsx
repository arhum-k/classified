"use client"

import React, { useEffect, useState, useRef, useContext } from "react";
import { CampusDataContext } from "../context/CampusData";
import Navbar from "../components/Navbar";
import SelectDropDown from "../components/SelectDropDown";
import { Room, RoomUnavailability, TimeSlot } from "../types";
import { time } from "console";
import RoomCard from "../components/RoomCard";
import { DatePicker } from "../components/DatePicker";
import { Button } from "@/components/ui/button"


export default function Display() {
  const { campusData, buildingCodes, selectedBuilding, isLoading, dateString, updateDate, updateSelectedBuilding, refreshData } = useContext(CampusDataContext);
  const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
  console.log("campus Data context", campusData)
  useEffect(() => {
    console.log("dateString useEffect triggered", dateString);
    setSelectedDateString(dateString);
  }, [dateString]);


  const handleDateChange = (date: Date) => {
    console.log("change date", date);
    setSelectedDateString(date.toISOString());
  };

  const handleUpdateDate = () => {
    if (selectedDateString != null) {
      updateDate(selectedDateString);
    }
  }

  const handleUpdateSelectedBuilding = (buildingCode: string) => {
    updateSelectedBuilding(buildingCode);
  }

   const handleRefresh = () => {
    refreshData();
  };

  const buidlingDropDownSelectOptions = buildingCodes?.map((buildingCode) => ({
    value: buildingCode,
    label: campusData?.[buildingCode]?.["building_name"] || "Unknown Building",
  })) || [];

  if (selectedDateString === null) {
    return <p></p>;
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SelectDropDown defaultValue={selectedBuilding} items={buidlingDropDownSelectOptions} onChange={handleUpdateSelectedBuilding} />
           
            {selectedDateString && <DatePicker onChange={handleDateChange} value={new Date(selectedDateString)}/>}
            <Button variant="outline_grey_bg" onClick={handleUpdateDate}>Update Date</Button>
          </div>
          <Button variant="ghost" onClick={handleRefresh}>Refresh</Button>
        </div>

        <div className="flex flex-wrap -mx-2">
          {selectedBuilding && campusData && campusData[selectedBuilding] ? (
            Object.keys(campusData[selectedBuilding].rooms).map((roomCode) => {
              const room = campusData[selectedBuilding].rooms[roomCode];
              return (
                <div key={roomCode} className="px-2 mb-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                  <RoomCard
                    roomCode={roomCode}
                    buildingCode={selectedBuilding}
                    buildingName={campusData[selectedBuilding].building_name}
                    max_capacity={room.max_capacity}
                    categories={room.categories}
                    features={room.features}
                    availability={room.availability}
                  />
                </div>
              );
            })
          ) : (
            <p>Select a building</p>
          )}
        </div>

      </div>
    </>
  )
}

