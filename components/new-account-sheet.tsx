import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet"

export const NewAccountSheet = () => {
    return (
        <Sheet open>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create a new account</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet> 
    )
}