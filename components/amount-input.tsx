import React, { forwardRef } from "react";
import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;  
    disabled?: boolean;
}

export const AmountInput = forwardRef<HTMLInputElement, Props>((
    { value, onChange, placeholder, disabled }: Props,
    ref
) => {
    // Parsing the value to determine if it's income or expense
    const parseValue = parseFloat(value);
    const isIncome = parseValue > 0;
    const isExpense = parseValue < 0;

    // Function to reverse the amount (toggle between positive and negative)
    const onReverseValue = () => {
        if (!value) return;

        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    };

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button 
                            type="button" 
                            onClick={onReverseValue} 
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition", 
                                isIncome && "bg-emerald-500 hover:bg-emerald-600", 
                                isExpense && "bg-rose-500 hover:bg-rose-600"
                            )}
                        >
                            {!parseValue && <Info className="size-3 text-white" />}
                            {isIncome && <PlusCircle className="size-3 text-white" />}
                            {isExpense && <MinusCircle className="size-3 text-white" />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] or [-] to reverse the amount
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                prefix="€"
                className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
                disabled={disabled}
                ref={ref} 
            />
            <p className="text-sm text-muted-foreground mt-2">
                {isIncome && "This will count as an income"}
                {isExpense && "This will count as an expense"}
            </p>
        </div>
    );
});

AmountInput.displayName = "AmountInput"; 
