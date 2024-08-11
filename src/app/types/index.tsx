
export interface RoomInfo {
    templateType: number;
    itemId: number | string;
    itemName: string;
    itemTypeId: number;
  }
export interface Room {
    contextId: number;
    row: [
      RoomInfo,
      string, // Building Name
      string, // Categories
      string, // Features
      string, // Layouts
      number, // Max Capacity
      number, // Default Capacity
      RoomInfo
    ];
  }

export interface TimeSlot {
    start: number;
    end: number;
    itemName: string;

  }
  
export interface RoomUnavailability {
    itemId: number;
    itemName: string;
    items: TimeSlot[];
  }

export interface RoomCardProps {
    roomCode: string;
    buildingCode: string | null;
    buildingName: string;
    maxCapacity: number;
    categories: string[];
    features: string[];
    availability: TimeSlot[];
    dateString: string;
}

export interface SelectDropDownProps {
  items: { value: any; label: any }[];
  defaultValue: string | null;
  onChange: (value: any) => void;
}