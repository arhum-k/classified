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
import buildingsData from "../context/buildingsData";
import Layout from "../layouts/Layout";


export default function Display() {
  const { campusData, selectedBuilding, isLoading, dateString, updateDate, updateSelectedBuilding, refreshData } = useContext(CampusDataContext);
  const [selectedDateString, setSelectedDateString] = useState<string>(new Date().toISOString());
  const dateReadable = new Date(selectedDateString).toDateString();
  const [buildingCode, setBuildingCode] = useState<string | null>(null);
  const [isBuildingCodeLoaded, setIsBuildingCodeLoaded] = useState<boolean>(false);

  console.log("campus Data context", campusData)


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('buildingCode');
    setBuildingCode(code);
    setIsBuildingCodeLoaded(true)
  }, []);

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
    setBuildingCode(buildingCode);
    const params = new URLSearchParams(window.location.search);
    params.set('buildingCode', buildingCode);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    updateSelectedBuilding(buildingCode);
  }

   const handleRefresh = () => {
    refreshData();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-6">
        <>
            <div className="flex items-center justify-between mb-4">
               {isBuildingCodeLoaded && <div className="flex items-center space-x-2">
                  <SelectDropDown defaultValue={buildingCode} items={buildingsData} onChange={handleUpdateSelectedBuilding} />
                  <DatePicker onChange={handleDateChange} value={selectedDateString}/>
                  <Button variant="outline_grey_bg" onClick={handleUpdateDate}>Search</Button>
                </div>}
            </div>
        </>
        <p>Loading</p>
        </div>
      </>
    )
  }
  console.log("isBuildingCodeLoaded", isBuildingCodeLoaded)
  let availableRooms:any = []
  if (buildingCode && campusData[buildingCode]) {
    availableRooms = Object.keys(campusData[buildingCode].rooms).filter(roomCode => 
        campusData[buildingCode].rooms[roomCode].availability.length > 0
    );
  }
  console.log(availableRooms)
  return (
    <Layout>
      <div className="p-6">
        <>
            {/* <div className="flex items-center justify-between mb-4">
               {isBuildingCodeLoaded && 
                <div className="flex items-center space-x-2">
                  <SelectDropDown defaultValue={buildingCode} items={buildingsData} onChange={handleUpdateSelectedBuilding} />
                  <DatePicker onChange={handleDateChange} value={selectedDateString}/>
                  <Button variant="outline_grey_bg" onClick={handleUpdateDate}>Search</Button>
                </div>}
            </div> */}
          <div className="flex items-center justify-between mb-4">
            {isBuildingCodeLoaded && 
              <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <div className="flex items-center space-x-2">
                  <SelectDropDown defaultValue={buildingCode} items={buildingsData} onChange={handleUpdateSelectedBuilding} />
                  <DatePicker onChange={handleDateChange} value={selectedDateString}/>
                </div>
                <Button variant="outline_grey_bg" onClick={handleUpdateDate} className="md:mt-0 mt-2">Search</Button>
              </div>}
          </div>
        </>
        

        <div className="flex flex-wrap -mx-2">
          {buildingCode ? (
            campusData && campusData[buildingCode] ? (
              availableRooms.length > 0 ? (
                availableRooms.map((roomCode: string) => {
                  const room = campusData[buildingCode].rooms[roomCode];
                  return (
                    room.availability.length > 0 && (
                      <div key={roomCode} className="px-2 mb-4 w-full md:w-1/2 md:w-1/3 xl:w-1/4">
                        <RoomCard
                          roomCode={roomCode}
                          buildingCode={buildingCode}
                          buildingName={campusData[buildingCode].building_name}
                          max_capacity={room.max_capacity}
                          categories={room.categories}
                          features={room.features}
                          availability={room.availability}
                        />
                      </div>
                    )
                  );
                })
              ) : (
                <p className="pl-3 font-semibold">No Available Rooms on {dateReadable}</p>
              )
            ) : (
              <p className="pl-3 font-semibold">No Data Found</p>
            )
          ) : (
            <p className="pl-3 font-semibold">Select a building</p>
          )}
        </div>

      </div>
    </Layout>
  )
}

