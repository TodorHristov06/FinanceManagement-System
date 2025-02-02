import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon} from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Defining the props for the DatePicker component
type Props = {
    value?: Date;
    onChange?: SelectSingleEventHandler;
    disabled?: boolean;
}

export const DatePicker = ({ 
    value,                  // Current selected date
    onChange,               // Function to handle date change
    disabled,               // Whether the date picker is disabled
}: Props) => {
    return(
    <Popover>
        <PopoverTrigger asChild>
            <Button disabled={disabled} variant={"outline"} className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
                <CalendarIcon className="size-4 mr-2" />
                {value ? format(value, "PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={value} onSelect={onChange} disabled={disabled} initialFocus />  
        </PopoverContent>
    </Popover>
    )
}
