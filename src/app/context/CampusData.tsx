"use client";
import { CloudCog } from "lucide-react";
import React, { createContext, useEffect, useState, useRef } from "react";

interface CampusContextType {
  campusData: any;
  buildingCodes: string[] | null;
  selectedBuilding: string | null;
  isLoading: boolean;
  date: string;
  updateDate: (newDate: string) => void;
  updateSelectedBuilding: (buildingCode: string) => void;
  refreshData: () => void;

}

const initialContextState: CampusContextType = {
  campusData: null,
  buildingCodes: null,
  selectedBuilding: null,
  isLoading: true,
  date: new Date().toISOString(),
  updateDate: () => {},
  updateSelectedBuilding: () => {},
  refreshData: () => {},

};

export const CampusDataContext = createContext(initialContextState);

const CampusData = ({ children }: { children: React.ReactNode }) => {
  const [campusData, setCampusData] = useState<any>(null);
  const [buildingCodes, setBuildingCodes] = useState<string[] | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString());
  const initialFetch = useRef(true);

  useEffect(() => {
    console.log("useEffect triggered");
    if (typeof window !== "undefined") {
      const savedData = sessionStorage.getItem("campusData");
      const savedCodes = sessionStorage.getItem("buildingCodes");
      const savedSelectedBuilding = sessionStorage.getItem("selectedBuilding");
      const savedLoading = sessionStorage.getItem("isLoading");
      const savedDate = sessionStorage.getItem("date");

      console.log("Session Storage Values", { savedData, savedCodes, savedSelectedBuilding, savedLoading, savedDate });

      if (savedData && savedCodes && savedSelectedBuilding && savedLoading && savedDate) {
        setCampusData(JSON.parse(savedData));
        setBuildingCodes(JSON.parse(savedCodes));
        setSelectedBuilding(savedSelectedBuilding !== "null" ? savedSelectedBuilding : null);
        setIsLoading(JSON.parse(savedLoading));
        setDate(savedDate);
        console.log("Using saved session storage data");
      } else if (initialFetch.current) {
        getData(date);
        initialFetch.current = false;
        console.log("Initial fetch triggered");
      }
    }
  }, []);

  

  async function getData(date: string) {
    console.log("Fetching data for date:", date);
    const res = await fetch("api/getBuildings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date || new Date().toISOString(),
      }),
    });
    const data = await res.json();
    setCampusData(data.result);
    setBuildingCodes(Object.keys(data.result));
    setIsLoading(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("campusData", JSON.stringify(data.result));
      sessionStorage.setItem("buildingCodes", JSON.stringify(Object.keys(data.result)));
      sessionStorage.setItem("selectedBuilding", selectedBuilding ? selectedBuilding : JSON.stringify(null));
      sessionStorage.setItem("isLoading", JSON.stringify(false));
      sessionStorage.setItem("date", date); // Ensure date is saved

      console.log("Data saved to session storage");
    }
    console.log("Data fetched:", data.result);
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
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
    setDate(formattedDate);
    sessionStorage.setItem("selectedDate", formattedDate);
    setIsLoading(true);
    console.log("Date updated:", formattedDate);
    getData(formattedDate);
  };

  const refreshData = () => {
    setIsLoading(true);
    getData(date);
    console.log("Data refreshed");
    console.log("Selected Building:", sessionStorage.getItem("selectedBuilding"));
    console.log("Selected Date:", sessionStorage.getItem("selectedDate"));
    console.log("Campus Data:", sessionStorage.getItem("campusData"));
    console.log("Building Codes:", sessionStorage.getItem("buildingCodes"));
    
  };



  return (
    <CampusDataContext.Provider
      value={{ campusData, buildingCodes, selectedBuilding, isLoading, date, updateDate, updateSelectedBuilding, refreshData }}
    >
      {children}
    </CampusDataContext.Provider>
  );
};

export default CampusData;
