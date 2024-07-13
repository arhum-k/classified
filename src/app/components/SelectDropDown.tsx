"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectDropDownProps {
    items: { value: any; label: any }[];
    onChange: (value: any) => void;
  }
  

  export default function SelectDropDown({ items, onChange }: SelectDropDownProps) {
    return (
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Building" />
        </SelectTrigger>
        <SelectContent className="w-[300px]">
          {items?.map((item) => (
            <SelectItem key={item.value} value={item.value} onChange={()=>{onChange(item.value)}}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  