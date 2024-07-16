import { RoomCardProps, TimeSlot } from "../types";
import { useState } from "react";
import { CustomPopover } from "./CustomPopover";

export default function RoomCard(props: RoomCardProps) {
  const [showFeatures, setShowFeatures] = useState(false);

    const roomCode = props.roomCode;

    const roomNum = roomCode.slice(4, roomCode.length);
    const buildingCode = props.buildingCode;
    const buildingName = props.buildingName;
    const maxCapacity = props.max_capacity;
    const categories = props.categories;
    const features = props.features;
    const availability = props.availability;

    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-6 w-full h-full flex flex-col">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Room {roomNum}</h3>
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex-1 mb-4">
            <p className="text-gray-600 mb-2"><span className="font-semibold text-gray-800">Building:</span> {buildingName}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold text-gray-800">Max Capacity:</span> {maxCapacity}</p>
          </div>
          <div className="flex-1 mb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Availability:</h4>
            <ul className="list-disc list-inside text-gray-600">
              {availability && availability.map((avail: TimeSlot, index: number) => (
                <li key={index} className="mb-1">
                  <span className="font-semibold text-gray-800">Start:</span> {avail.start}, <span className="font-semibold text-gray-800">End:</span> {avail.end}
                </li>
              ))}
            </ul>
          </div>
            <CustomPopover content={features.toString()}/>
        </div>
      </div>
    );
  }