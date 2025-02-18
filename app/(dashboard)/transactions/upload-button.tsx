import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Props = {
  onUpload: (results: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <CSVReader onUploadAccepted={onUpload}>
        {({ getRootProps }: any) => (
          <Button
            size="sm"
            className="w-full lg:w-auto"
            {...getRootProps()}
          >
            <Upload className="size-4 mr-2" />
            Import CSV
          </Button>
        )}
      </CSVReader>
    </div>
  );
};