"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

type Props = {
    onChange: (value?: string) => void; // Function to handle value change
    onCreate?: (value: string) => void; // Optional function to handle new value creation
    options?: { label: string; value: string }[]; // Array of options for the select component
    value?: string | null | undefined; // Current selected value
    disabled?: boolean; // Whether the select is disabled
    placeholder?: string; // Placeholder text when no value is selected
};

export const Select = ({
    value,
    onChange,
    disabled,
    onCreate,
    options = [],
    placeholder,
}: Props) => {
    const onSelect = (
        option: SingleValue<{ label: string; value: string }>
    ) => {
        onChange(option?.value); // Update the selected value when an option is selected
    };

    // Memoize the formatted value to prevent unnecessary re-renders
    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [options, value]);
    return (
        <CreateableSelect
            placeholder={placeholder}
            className="text-sm h-10"
            styles={{
                control: (base) => ({
                    ...base,
                    borderColor: "#e2e8f0",
                    ":hover": {
                        borderColor: "#e2e8f0",
                    },
                })
            }}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    )
}
