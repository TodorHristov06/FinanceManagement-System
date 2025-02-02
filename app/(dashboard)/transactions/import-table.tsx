import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableHeadSelect } from "./table-head-select";

type Props = {
    headers: string[]; // Array of CSV headers
    body: string[][]; // Array of CSV rows
    selectedColumns: Record<string, string | null>; // Track selected columns for mapping
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void; // Callback for column selection changes
}

export const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadSelectChange
}: Props) => {
    return(
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        {headers.map((_item, index) => (
                            <TableHead key={index}>
                                <TableHeadSelect
                                    columnIndex={index}
                                    selectedColumns={selectedColumns}
                                    onChange={onTableHeadSelectChange}
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index}>
                                    {cell} 
                                </TableCell> // Render each cell
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}