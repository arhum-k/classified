import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomPopoverProps {
  content: string;
}

export function CustomPopover(props: CustomPopoverProps) {
  const content = props.content;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Show Features</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div>
            {content}
        </div>
      </PopoverContent>
    </Popover>
  )
}
