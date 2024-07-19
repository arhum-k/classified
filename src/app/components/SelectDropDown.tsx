"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectDropDownProps } from "../types"


  export default function SelectDropDown({ items, defaultValue, onChange }: SelectDropDownProps) {
    console.log(defaultValue, "default value")
    return (
      <Select onValueChange={onChange} defaultValue={defaultValue || undefined}>
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
  