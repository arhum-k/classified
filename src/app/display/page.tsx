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
import { AnimatePresence, motion } from "framer-motion";
import { GridLoader } from "react-spinners";


export default function Display() {
  const { campusData, selectedBuilding, isLoading, dateString, updateDate, updateSelectedBuilding, refreshData } = useContext(CampusDataContext);
  const [selectedDateString, setSelectedDateString] = useState<string>(new Date().toISOString());
  const dateReadable = new Date(selectedDateString).toDateString();
  const [buildingCode, setBuildingCode] = useState<string | null>(null);
  const [isBuildingCodeLoaded, setIsBuildingCodeLoaded] = useState<boolean>(false);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);


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

 
  useEffect(() => {
    if (campusData && buildingCode && campusData[buildingCode]) {
      setRoomsLoading(true);
      setAvailableRooms([]); // Clear the old rooms immediately
      const rooms = Object.keys(campusData[buildingCode].rooms).filter(roomCode =>
        campusData[buildingCode].rooms[roomCode]?.availability.length > 0
      );
      setTimeout(() => {
        setAvailableRooms(rooms);
        setRoomsLoading(false);
      }, 650); // Small delay to ensure the state is updated
    } else {
      setAvailableRooms([]);
    }
  }, [buildingCode, campusData]);


  const handleDateChange = (date: Date) => {
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

  return (
    <Layout>
      <div className="p-6">
        <AnimatePresence>
          {isBuildingCodeLoaded && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, y: -50 }} // Start above the view
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20, delay: 0.65 } }} // Slower entry with delay
              exit={{ opacity: 0, y: -50, transition: { type: "spring", stiffness: 1200, damping: 40 } }} // Faster exit, moves up
              className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2 mb-4"
            >
              <div className="flex items-center space-x-2">
                <SelectDropDown defaultValue={buildingCode} items={buildingsData} onChange={handleUpdateSelectedBuilding} />
                <DatePicker onChange={handleDateChange} value={selectedDateString} />
              </div>
              <Button variant="outline_grey_bg" onClick={handleUpdateDate} className="md:mt-0 mt-2">
                Search
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <AnimatePresence>
            <motion.div
              key="filters"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20, delay: 0.65 } }} // Slower entry with delay
              exit={{ opacity: 0, y: -50, transition: { type: "spring", stiffness: 1200, damping: 40 } }} // Faster exit, moves up
              className="flex items-center justify-center mt-32 md:mt-64"
              >
                <GridLoader
                  speedMultiplier={0.9}
                  margin={4}
                />
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
          {buildingCode ? (
            campusData && campusData[buildingCode] ? (
              <>
                <div className="flex flex-wrap -mx-2">
                  <AnimatePresence>
                    {!roomsLoading && availableRooms.length > 0 ? (
                      availableRooms.map((roomCode: string) => {
                        const room = campusData[buildingCode].rooms[roomCode];
                        return room ? (
                          <motion.div
                            key={roomCode}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }}
                            exit={{ opacity: 0, y: -50, transition: { type: "spring", stiffness: 350, damping: 40 } }}
                            className="px-2 mb-4 w-full md:w-1/2 md:w-1/3 xl:w-1/4"
                          >
                            <RoomCard
                              roomCode={roomCode}
                              buildingCode={buildingCode}
                              buildingName={campusData[buildingCode].building_name}
                              maxCapacity={room.max_capacity}
                              categories={room.categories}
                              features={room.features}
                              availability={room.availability}
                            />
                          </motion.div>
                        ) : null;
                      })
                    ) : null}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {!roomsLoading && availableRooms.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.65 } }}
                      exit={{ opacity: 0, y: 50, transition: { type: "spring", stiffness: 1200, damping: 40 } }}
                      className="flex items-center justify-center w-full mt-64"
                    >
                      <p className="pl-3 font-semibold">No Available Rooms</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.65 } }}
                  exit={{ opacity: 0, y: 50, transition: { type: "spring", stiffness: 1200, damping: 40 } }}
                  className="flex items-center justify-center w-full mt-64"
                >
                  <p className="pl-3 font-semibold">No Data Found</p>
                </motion.div>
              </AnimatePresence>
            )
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.65 } }}
                exit={{ opacity: 0, y: 50, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                className="flex"
              >
                <img className="h-40 md:h-80" src="/arrow-turn.png"></img>
                <p className="text-2xl md:text-4xl font-semibold mt-[60px] md:mt-[200px]">Select a building</p>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>

    </Layout>
  )
}

