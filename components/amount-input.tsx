import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger , TooltipProvider} from "@/components/ui/tooltip";
import { parse } from "path";

type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;  
    disabled?: boolean;
}

export const AmountInput = ({ 
    value, 
    onChange, 
    placeholder, 
    disabled 
}: Props) => { 
    const parseValue = parseFloat(value);
    const inIncome = parseValue > 0;
    const inExpense = parseValue < 0;

    const onReverseValue = () => {
        if (!value) return;
        
        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    }
    return (
        <div>
            Hello
        </div>
    );
}