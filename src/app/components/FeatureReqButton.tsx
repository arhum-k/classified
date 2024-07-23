import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";

export default function FeatureReqButton(){
    const [userInput, setUserInput] = useState<string>("");

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setUserInput(e.target.value);
    }

    async function handleSubmit(){
        const res = await fetch("api/airtableFeatureReq", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              featureRequest: userInput,
            }),
          });
          setUserInput("");
          const data = await res.json();

    }
    return (
        <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline">Feature Request</Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>Feature Request</SheetTitle>
            <SheetDescription>
                Let us know how we can improve Classified!
            </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Input id="feat-req" value={userInput} onChange={handleInputChange} className="col-span-3" />
            </div>
            </div>
            <SheetFooter>
            <SheetClose asChild>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </SheetClose>
            </SheetFooter>
        </SheetContent>
        </Sheet>
    )
}
