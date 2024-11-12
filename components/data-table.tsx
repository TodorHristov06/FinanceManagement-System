// DataTable component for managing tabular data with filtering, sorting, selection, and deletion.
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useConfirm } from "@/hooks/use-confirm"
import { Button } from "@/components/ui/button"
import { Input} from "@/components/ui/input"
import { Trash } from "lucide-react"

// Defining the props for the DataTable component
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]  // Column definitions
  data: TData[]                        // Data to be displayed in the table
  filterKey: string                    // Column filter key (e.g., email)
  onDelete: (rows: Row<TData>[]) => void  // Function for deleting selected rows
  disabled?: boolean                   // If the delete button is disabled
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled,
}: DataTableProps<TData, TValue>) {
   // Initializing a confirmation dialog for deleting rows
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete the selected accounts."
  )
   // States for sorting, filtering, and row selection
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const [rowSelection, setRowSelection] = React.useState({})
  // Setting up the table using the useReactTable hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    }
  })

  return (
    <div>
      {/* Confirmation dialog for deletion */}
        <ConfirmDialog />
        <div className="flex items-center py-4">
          <Input
            placeholder={`Filter ${filterKey}...`} // Input field for filtering a specific column
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {/* Button for deleting selected rows */}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              disabled={disabled}
              variant="outline"
              size="sm"
              className="ml-auto font-normal text-xs"
              onClick={async() => {
                const ok = await confirm(); // Confirmation before deletion

                if(ok){
                onDelete(table.getFilteredSelectedRowModel().rows) // Deleting the rows
                table.resetRowSelection(); // Reset row selection after deletion
                }
              }}
            >
              <Trash className="size-4 mr-2"/>
              Delete({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
        </div>
        {/* Table for displaying the data */}
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"} // Displays if the row is selected
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        {/* Pagination controls for navigating the table pages */}
        <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.  {/* Display selected rows count */}
        </div>
        {/* Previous page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        {/* Next page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
