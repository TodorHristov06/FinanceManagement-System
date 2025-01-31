"use client"; // Mark this component to be rendered on the client side

import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";


const CategoriesPage = () => {
    const newCategory = useNewCategory(); // Hook to manage new category creation
    const deleteCategories = useBulkDeleteCategories(); // Hook to handle bulk delete
    const categoriesQuery = useGetCategories(); // Hook to fetch categories
    const categories = categoriesQuery.data || []; // Use fetched categories data or empty array

    const isDisabled =
        categoriesQuery.isLoading ||
        deleteCategories.isPending; // Disable actions during loading or deletion

    if (categoriesQuery.isLoading) {
        return(
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48"/> {/* Loading skeleton for header */}
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex justify-center items-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin" /> {/* Loading spinner */}
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
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id); 
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