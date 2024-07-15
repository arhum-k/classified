import { RoomCardProps, TimeSlot } from "../types";

export default function RoomCard(props: RoomCardProps) {
    const roomCode = props.roomCode;

    const roomNum = roomCode.slice(4, roomCode.length);
    const buildingCode = props.buildingCode;
    const buildingName = props.buildingName;
    const max_capacity = props.max_capacity;
    const categories = props.categories;
    const features = props.features;
    const availability = props.availability;

return(
    <div className="bg-gray-100 shadow-md rounded-xl p-4 mb-4 w-1/2">
    <h3 className="text-xl font-bold mb-2">Room: {roomNum}</h3>
    <p className="mb-1"><span className="font-semibold">Building:</span> {buildingName}</p>
    <p className="mb-1"><span className="font-semibold">Categories:</span> {categories}</p>
    <p className="mb-1"><span className="font-semibold">Max Capacity:</span> {max_capacity}</p>
    <h4 className="text-lg font-semibold mt-4">Availability:</h4>
    <ul className="list-disc list-inside">
      {availability && availability.map((avail: TimeSlot, index: number) => (
        <li key={index} className="mb-1">
          <span className="font-semibold">Start:</span> {avail.start}, <span className="font-semibold">End:</span> {avail.end}
        </li>
      ))}
    </ul>
  </div>
)
}