"use client";
import { CloudCog } from "lucide-react";
import React, { createContext, useEffect, useState, useRef } from "react";
import buildingsInfoData from '@/app/context/buildingsInfoData.json';

interface CampusContextType {
  campusData: any;
  useMockData: boolean;
  buildingCodes: string[] | null;
  selectedBuilding: string | null;
  isLoading: boolean;
  dateString: string;
  updateDate: (newDate: string) => void;
  updateSelectedBuilding: (buildingCode: string) => void;
  refreshData: () => void;

}

const initialContextState: CampusContextType = {
  campusData: null,
  useMockData: false,
  buildingCodes: null,
  selectedBuilding: null,
  isLoading: true,
  dateString: new Date().toISOString(),
  updateDate: () => {},
  updateSelectedBuilding: () => {},
  refreshData: () => {},

};

export const CampusDataContext = createContext(initialContextState);

const CampusData = ({ children }: { children: React.ReactNode }) => {
  const [campusData, setCampusData] = useState<any>(null);
  const buildingsInfo: Record<string, any> = buildingsInfoData
  const [useMockData, setUseMockData] = useState<boolean>(true);
  const [buildingCodes, setBuildingCodes] = useState<string[] | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateString, setDateString] = useState(new Date().toISOString());
  const initialFetch = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);



  useEffect(() => {
    console.log("useEffect triggered");
    if (typeof window !== "undefined") {
      const savedData = sessionStorage.getItem("campusData");
      const savedCodes = sessionStorage.getItem("buildingCodes");
      const savedSelectedBuilding = sessionStorage.getItem("selectedBuilding");
      const savedLoading = sessionStorage.getItem("isLoading");
      const savedDate = sessionStorage.getItem("dateString");

      if (savedData && savedCodes && savedSelectedBuilding && savedLoading && savedDate) {
        setCampusData(JSON.parse(savedData));
        setBuildingCodes(JSON.parse(savedCodes));
        setSelectedBuilding(savedSelectedBuilding !== "null" ? savedSelectedBuilding : null);
        setIsLoading(JSON.parse(savedLoading));
        setDateString(savedDate);
        console.log("Using saved session storage data");
      } else if (initialFetch.current) {
        getData(dateString);
        initialFetch.current = false;
        console.log("No saved session storage data - initial fetch triggered");
      }
    }
  }, []);

  function getMockData(dateString: string) {
    console.log(dateString)
    const mockBuildingsInfo = { ...buildingsInfo };
    const closedHours = [{ startstart: 6, end: 8 }, { start: 22, end: 24 }];
    
    function getRandomBookings() {
      const bookings = [];
      for (let i = 0, n = Math.floor(Math.random() * 4) + 1; i < n; i++) {
        const start = Math.floor(Math.random() * 12) + 8;
        const duration = Math.floor(Math.random() * 4) + 1;
        bookings.push({ start: start, end: start + duration });
      }
      return bookings;
    }
    
    for (const building in mockBuildingsInfo) {
      for (const room in mockBuildingsInfo[building].rooms) {
        const bookings = getRandomBookings();
        mockBuildingsInfo[building].rooms[room].closed_hours = closedHours;
        mockBuildingsInfo[building].rooms[room].bookings = bookings;
        mockBuildingsInfo[building].rooms[room].availability = [];
  
        let currentTime = 8;
        for (const { start, end } of bookings) {
          if (currentTime < start) mockBuildingsInfo[building].rooms[room].availability.push({ start: currentTime, end: start });
          currentTime = end;
        }
        if (currentTime < 22) mockBuildingsInfo[building].rooms[room].availability.push({ start: currentTime, end: 22 });
      }
    }
    console.log("Mock data generated");

    setCampusData(mockBuildingsInfo);
    setBuildingCodes(Object.keys(mockBuildingsInfo));
    setIsLoading(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("campusData", JSON.stringify(mockBuildingsInfo));
      sessionStorage.setItem("buildingCodes", JSON.stringify(Object.keys(mockBuildingsInfo)));
      sessionStorage.setItem("selectedBuilding", selectedBuilding ? selectedBuilding : JSON.stringify(null));
      sessionStorage.setItem("isLoading", JSON.stringify(false));
      sessionStorage.setItem("dateString", dateString); // Ensure dateString is saved

      console.log("Data saved to session storage");
    }
  }

  async function getData(dateString: string) {
    if (useMockData) {
      getMockData(dateString)
      return;
    }
    if (abortControllerRef.current) {
      console.log("ABORTING")
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
    console.log("Fetching data for date:", dateString);
    const res = await fetch("api/getBuildingsBookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateString: dateString || new Date().toISOString(),
      }),
      signal: controller.signal,

    });
    const data = await res.json();
    if (data.result) {
      setCampusData(data.result);
      setBuildingCodes(Object.keys(data.result));
      setIsLoading(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("campusData", JSON.stringify(data.result));
        sessionStorage.setItem("buildingCodes", JSON.stringify(Object.keys(data.result)));
        sessionStorage.setItem("selectedBuilding", selectedBuilding ? selectedBuilding : JSON.stringify(null));
        sessionStorage.setItem("isLoading", JSON.stringify(false));
        sessionStorage.setItem("dateString", dateString); // Ensure dateString is saved

        console.log("Data saved to session storage");
      }
      }
    } catch (error) {
      if (error === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching data:", error);
      }
    }
  }
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const formattedDate = d.toISOString().split(".")[0]; // Removing milliseconds
    return formattedDate;
  };

  const updateSelectedBuilding = (buildingCode: string) => {
    setSelectedBuilding(buildingCode);
    sessionStorage.setItem("selectedBuilding", buildingCode);
    console.log("Selected building updated:", buildingCode);
  }

  const updateDate = (newDate: string) => {
    const formattedDate = formatDate(newDate);
    setDateString(formattedDate);
    sessionStorage.setItem("dateString", formattedDate);
    setIsLoading(true);
    console.log("Date updated:", formattedDate);
    getData(formattedDate);
  };

  const refreshData = () => {
    setIsLoading(true);
    getData(dateString);
    console.log("Data refreshed");
    // console.log("Selected Building:", sessionStorage.getItem("selectedBuilding"));
    // console.log("Date:", sessionStorage.getItem("dateString"));
    // console.log("Campus Data:", sessionStorage.getItem("campusData"));
    // console.log("Building Codes:", sessionStorage.getItem("buildingCodes"));
    
  };



  return (
    <CampusDataContext.Provider
      value={{ campusData, useMockData, buildingCodes, selectedBuilding, isLoading, dateString, updateDate, updateSelectedBuilding, refreshData }}
    >
      {children}
    </CampusDataContext.Provider>
  );
};

export default CampusData;
