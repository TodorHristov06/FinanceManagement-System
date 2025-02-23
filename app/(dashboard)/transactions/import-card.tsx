import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
    "amount",
    "date",
    "payee",
]

interface SelectedColumnsState {
    [key: string]: string | null; // Track selected columns for mapping
}
type Props = {
    data: string[][]; // CSV data (headers and rows)
    onCancel: () => void // Callback for cancel action
    onSubmit: (data: any) => void // Callback for submit action
}
export const ImportCard = ({
    data,
    onCancel,
    onSubmit, 
}: Props) => {
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({}); // Track selected columns

    const headers = data[0]; // Extract headers from CSV data
    const body = data.slice(1); // Extract rows from CSV data

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev };

            // Clear any previous selection for the same value
            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }
            }

            if (value === "skip") {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;

            return newSelectedColumns;
        })
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length; // Track progress of required columns

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1];
        }

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                })

                return transformedRow.every((item) => item === null) 
                ? [] 
                : transformedRow;
            }).filter((row) => row.length > 0)
        }

        // Transform mapped data into an array of objects
        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    acc[header] = cell; // Map cell to header
                }

                return acc;
            }, {})
        })

        // Format data for submission
        const formattedData = arrayOfData.map((item) => ({
            ...item,
            amount: convertAmountToMiliunits(parseFloat(item.amount)),
            date: format(parse(item.date, dateFormat, new Date()), outputFormat),
        }))

        onSubmit(formattedData);
    }

    return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transactions
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            onClick={onCancel} 
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            disabled={progress < requiredOptions.length}
                            onClick={handleContinue}
                            className="w-full lg:w-auto"
                        >
                            Continue({progress}/{requiredOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadSelectChange={onTableHeadSelectChange}
                    />
                </CardContent>
            </Card>
        </div>
    )
}