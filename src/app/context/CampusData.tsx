"use client";
import { CloudCog } from "lucide-react";
import React, { createContext, useEffect, useState, useRef } from "react";

interface CampusContextType {
  campusData: any;
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
      console.log(sessionStorage)

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
        console.log("Initial fetch triggered");
      }
    }
  }, []);

  

  async function getData(dateString: string) {
    if (abortControllerRef.current) {
      console.log("ABORTING")
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
    console.log("Fetching data for dateString:", dateString);
    const res = await fetch("api/getBuildingsInfoAndBookings", {
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
    //console.log("Data fetched:", data.result);
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
    console.log("Selected Building:", sessionStorage.getItem("selectedBuilding"));
    console.log("Date:", sessionStorage.getItem("dateString"));
    console.log("Campus Data:", sessionStorage.getItem("campusData"));
    console.log("Building Codes:", sessionStorage.getItem("buildingCodes"));
    
  };



  return (
    <CampusDataContext.Provider
      value={{ campusData, buildingCodes, selectedBuilding, isLoading, dateString, updateDate, updateSelectedBuilding, refreshData }}
    >
      {children}
    </CampusDataContext.Provider>
  );
};

export default CampusData;
