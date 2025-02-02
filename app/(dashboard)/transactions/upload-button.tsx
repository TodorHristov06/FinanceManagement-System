import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse"
import { Button } from "@/components/ui/button";

type Props = {
    onUpload: (results: any) => void // Callback for handling uploaded CSV data
}

export const UploadButton = ({ onUpload }: Props) => {
    const { CSVReader } = useCSVReader(); // Hook for CSV file reading
    //ToDo Add paywall
    return (
        <CSVReader onUploadAccepted={onUpload}>
            {({ getRootProps }: any) => (
                <Button 
                size = "sm"
                className="w-full lg:w-auto"
                {...getRootProps()} // Spread root props for file upload
                >
                    <Upload className="size-4 mr-2" />
                    Import
                </Button>
            )}
        </CSVReader>
    )
};