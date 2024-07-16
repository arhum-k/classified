"use client"

import React, { useEffect, useState, useRef, useContext } from "react";
import { CampusDataContext } from "../context/CampusData";
import Navbar from "../components/Navbar";
import SelectDropDown from "../components/SelectDropDown";
import { Room, RoomUnavailability, TimeSlot } from "../types";
import { time } from "console";
import RoomCard from "../components/RoomCard";
import { DatePicker } from "../components/DatePicker";


export default function Display() {
  const { campusData, buildingCodes, selectedBuilding, isLoading, date, updateDate, updateSelectedBuilding, refreshData } = useContext(CampusDataContext);
  const [selectedDateString, setSelectedDateString] = useState(date);
  const [selectedBuildingCode, setSelectedBuildingCode] = useState<string | null>(null);
  console.log("context", campusData)

  const handleDateChange = (date: Date) => {
    console.log("change date", date);
    setSelectedDateString(date.toISOString());
  };

  const handleUpdateDate = () => {
    updateDate(selectedDateString);
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SelectDropDown defaultValue={selectedBuilding} items={buidlingDropDownSelectOptions} onChange={handleUpdateSelectedBuilding} />
           
            <DatePicker onChange={handleDateChange} value={new Date(selectedDateString)}/>
            <button 
              onClick={handleUpdateDate} 
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Update Date
            </button>
          </div>
          <button 
            onClick={handleRefresh} 
            className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Refresh
          </button>
        </div>


        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {selectedBuilding && campusData && campusData[selectedBuilding] ? (
                Object.keys(campusData[selectedBuilding].rooms).map((roomCode) => {
                  const room = campusData[selectedBuilding].rooms[roomCode];
                  return (
                    <RoomCard
                      roomCode={roomCode}
                      buildingCode={selectedBuildingCode}
                      buildingName = {campusData[selectedBuilding].building_name}
                      max_capacity={room.max_capacity}
                      categories={room.categories}
                      features={room.features}
                      availability={room.availability}
                  />
                  );
                })
              ) : (
                <p>Select a building</p>
              )}
            </div>
          )}
        </div>

      </div>
    </>
  )
}
}
