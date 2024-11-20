"use client"; // Mark this component to be rendered on the client side

import { Loader2, Plus } from "lucide-react"; // Import icons for loading and adding
import { Button } from "@/components/ui/button"; // Import Button component from UI library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components for layout
import { columns } from "./columns"; // Import column definitions for the table
import { DataTable } from "@/components/data-table"; // Import DataTable component for displaying categories

import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component for loading state
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories"; // Import bulk delete hook
import { useGetCategories } from "@/features/categories/api/use-get-categories"; // Import hook for fetching categories
import { useNewCategory } from "@/features/categories/hooks/use-new-category"; // Import hook for creating new categories


const CategoriesPage = () => {
    const newCategory = useNewCategory(); // Hook to manage new category creation
    const deleteCategories = useBulkDeleteCategories(); // Hook to handle bulk delete of categories
    const categoriesQuery = useGetCategories(); // Hook to fetch category data
    const categories = categoriesQuery.data || []; // Use fetched categories data or empty array

    const isDisabled =
        categoriesQuery.isLoading ||
        deleteCategories.isPending; // Disable actions if data is loading or deletion is in progress

    if (categoriesQuery.isLoading) {
        return(
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex justify-center items-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Categories Page  
                    </CardTitle>
                    <Button onClick={newCategory.onOpen} size="sm">
                        <Plus className="size-4 mr-2"/>
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        filterKey="name" 
                        columns={columns} 
                        data={categories} 
                        onDelete={(row: any[]) => {
                            const ids = row.map((r: any) => r.original.id); 
                            deleteCategories.mutate({ids});
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoriesPage;