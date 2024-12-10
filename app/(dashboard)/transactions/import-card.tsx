import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
    "amount",
    "date",
    "payee",
]

interface SelectColumnsState {
    [key: string]: string | null;
}
type Props = {
    data: string[][];
    onCancel: () => void
    onSubmit: (data: any) => void
}
export const ImportCard = ({
    data,
    onCancel,
    onSubmit, 
}: Props) => {
    const [selectColumns, setSelectColumns] = useState<SelectColumnsState>({});
    const headers = data[0];
    const body = data.slice(1);
    return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transactions
                    </CardTitle>
                    <div className="flex items-center gap-x-2">
                        <Button onClick={onCancel} size="sm">
                            Cancel
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable
                        headers={headers}
                        body={body}
                        selectColumns={selectColumns}
                        onTableHeadSelectChange={() => {}}
                    />
                </CardContent>
            </Card>
        </div>
    )
}