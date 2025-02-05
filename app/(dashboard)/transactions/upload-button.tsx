import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";
import { scanReceipt } from "@/features/transactions/api/use-scan-receipt";
import { useToast } from "@/hooks/use-toast";

type Props = {
  onUpload: (results: any) => void;
  onReceiptUpload?: (receiptData: any) => void;
};

export const UploadButton = ({ onUpload, onReceiptUpload }: Props) => {
  const { CSVReader } = useCSVReader();
  const scan = scanReceipt;
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      console.log("Selected file:", file); // Log the selected file
      handleReceiptUpload(file);
    }
  };

  const handleReceiptUpload = async (file: File) => {
    try {
      const receiptData = await scan(file); // Scan the receipt
      console.log("Scanned receipt data:", receiptData); // Log the scanned data

      if (onReceiptUpload) {
        onReceiptUpload(receiptData); // Pass the scanned data to the callback
      }

      toast({
        title: "Receipt Scanned Successfully",
        description: `Amount: ${receiptData.amount}, Merchant: ${receiptData.payee}`,
      });
    } catch (error) {
      console.error("Error scanning receipt:", error); // Log the error
      toast({
        title: "Error Scanning Receipt",
        description: "Failed to scan the receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

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

      <Button size="sm" className="w-full lg:w-auto" asChild>
        <label htmlFor="receipt-upload">
          <Upload className="size-4 mr-2" />
          Scan Receipt
          <input
            id="receipt-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
      </Button>
    </div>
  );
};