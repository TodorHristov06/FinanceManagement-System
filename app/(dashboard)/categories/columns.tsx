"use client"; // Mark this component to be rendered on the client side

import { Button } from "@/components/ui/button"; // Import Button component from UI library
import { ColumnDef } from "@tanstack/react-table"; // Import ColumnDef for defining table columns
import { ArrowUpDown } from "lucide-react"; // Import sorting icon
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component from UI library       
import { InferResponseType } from "hono"; // Type inference for the API response
import { client } from "@/lib/hono"; // Import client for API communication
import { Actions } from "./actions"; // Import Actions component for each row

// Define response type from API to infer account data shape
export type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"] [0]

// Define table columns
export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select", // Define the 'select' column for selecting rows
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false, // Disable sorting for this column
    enableHiding: false, // Disable hiding for this column
  },
  {
    accessorKey: "name", // Define column for account name
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
        </Button>
      )
    },
  },
  {
    id: "actions", // Define the 'actions' column for each row
    cell: ({ row }) => <Actions id={row.original.id} /> // Render the Actions component with the account ID
  }
]
