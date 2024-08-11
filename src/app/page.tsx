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
import Layout from "./layouts/Layout";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {  
  const { updateDate } = useContext(CampusDataContext);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string>(new Date().toISOString());

  function hanldeUpdateDate(){
    if (selectedDateString != null && selectedDateString != (new Date().toISOString())){
      updateDate(selectedDateString);
    }
  }
  return (
    <CampusData>
      <Layout>
      <div className="relative flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-32 md:mt-64">
          <AnimatePresence>
            <motion.div
             initial={{ opacity: 0, y: -50 }}
             animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness:2800, damping: 100 } }} // Slower entry with delay
             exit={{ opacity: 0, y: 50, transition: { type: "spring", stiffness: 1800, damping: 40 } }} // Faster exit, moves up
            >
              <InfiniteTextSlider />
           
              <p className="text-xl pt-2 md:pt-6 text-muted-foreground text-center"> 
                Find an empty room.
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="py-4">
            <AnimatePresence>
              <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 1000, damping: 40 } }} // Slower entry with delay
              exit={{ opacity: 0, y: -50, transition: { type: "spring", stiffness: 1200, damping: 40 } }} // Faster exit, moves up
              className="flex flex-col md:flex-row items-center justify-between pb-10 mb-4 space-y-4 md:space-y-0"> 
                <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-2 space-y-4 md:space-y-0">
                  <SelectDropDown defaultValue={null} items={buildingsData} onChange={setSelectedBuilding} />
                  <DatePicker onChange={setSelectedDateString} value={selectedDateString} />
                  <Link href={{ pathname: '/display', query: { buildingCode: selectedBuilding } }}>
                    <Button onClick={hanldeUpdateDate} variant="outline_grey_bg">Search</Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      </Layout>
    </CampusData>
  );
  
}
  