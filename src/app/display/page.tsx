"use client"

import React, { useEffect, useState, useRef, useContext } from "react";
import { CampusDataContext } from "../context/CampusData";
import Navbar from "../components/Navbar";
import SelectDropDown from "../components/SelectDropDown";
import { Room, RoomUnavailability, TimeSlot } from "../types";
import { time } from "console";
import RoomCard from "../components/RoomCard";


export default function Display() {
  const { campusData, buildingCodes, isLoading, date, updateDate, refreshData } = useContext(CampusDataContext);
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedBuildingCode, setSelectedBuildingCode] = useState<string | null>(null);
  console.log("context", campusData)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleUpdateDate = () => {
    updateDate(selectedDate);
  }

   const handleRefresh = () => {
    refreshData();
  };

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
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SelectDropDown items={buidlingDropDownSelectOptions} onChange={setSelectedBuildingCode} />
            <input 
              type="datetime-local" 
              value={selectedDate} 
              onChange={handleDateChange} 
              className="p-2 border rounded"
            />
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
              {selectedBuildingCode && campusData && campusData[selectedBuildingCode] ? (
                Object.keys(campusData[selectedBuildingCode].rooms).map((roomCode) => {
                  const room = campusData[selectedBuildingCode].rooms[roomCode];
                  console.log(room.availability);
                  return (
                    <RoomCard
                      roomCode={roomCode}
                      buildingCode={selectedBuildingCode}
                      buildingName = {campusData[selectedBuildingCode].building_name}
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
