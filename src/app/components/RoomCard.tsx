import { RoomCardProps, TimeSlot } from "../types";
import { useState } from "react";
import { CustomPopover } from "./CustomPopover";
import { motion } from "framer-motion";



export default function RoomCard({ roomCode, buildingCode, buildingName, maxCapacity, categories, features, availability }: RoomCardProps) {
  const [showFeatures, setShowFeatures] = useState(false);
    const roomNum = roomCode.slice(4, roomCode.length);
  
    
    const formatTime = (time: number) => {
      const hour = Math.floor(time);
      const minute = (time % 1) * 60;
      const ampm = hour >= 12 ? 'pm' : 'am';
      const formattedHour = hour % 12 || 12;
      const formattedMinute = minute === 0 ? '' : `:${minute.toString().padStart(2, '0')}`;
      return `${formattedHour}${formattedMinute}${ampm}`;
    };

    return (
      <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      exit={{ opacity: 0, y: 50, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="bg-white border border-gray-200 shadow-sm rounded-md p-6 mb-6 w-full h-full flex flex-col"
    >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Room {roomNum}</h3>
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex-1 mb-2">
            <p className="text-gray-600 mb-2"><span className="font-semibold text-gray-800">Building:</span> {buildingName}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold text-gray-800">Max Capacity:</span> {maxCapacity}</p>
          </div>
          <div className="flex-1 mb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Availability:</h4>
            <ul className="list-disc list-inside text-gray-600">
              {availability && availability.map((avail: TimeSlot, index: number) => (
                <li key={index} className="mb-1">
                  {formatTime(avail.start)} - {formatTime(avail.end)}
                </li>
              ))}
            </ul>
          </div>
            <CustomPopover content={features.toString()}/>
        </div>
      </motion.div>
    );
  }