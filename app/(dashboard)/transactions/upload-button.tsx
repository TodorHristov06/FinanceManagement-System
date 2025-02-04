import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";
import { useScanReceipt } from "@/features/transactions/api/use-scan-receipt"; // Import the receipt scanning hook
import { useToast } from "@/hooks/use-toast"; // For toast notifications

type Props = {
  onUpload: (results: any) => void; // Callback for handling uploaded CSV data
  onReceiptUpload?: (receiptData: any) => void; // Optional callback for handling receipt data
};

export const UploadButton = ({ onUpload, onReceiptUpload }: Props) => {
  const { CSVReader } = useCSVReader(); // Hook for CSV file reading
  const { scan } = useScanReceipt(); // Hook for receipt scanning
  const { toast } = useToast(); // Toast notifications

  // Handle receipt file upload
  const handleReceiptUpload = async (file: File) => {
    try {
      const receiptData = await scan(file); // Scan the receipt
      if (onReceiptUpload) {
        onReceiptUpload(receiptData); // Pass the scanned data to the callback
      }
      toast({
        title: "Receipt Scanned Successfully",
        description: `Amount: ${receiptData.amount}, Merchant: ${receiptData.merchantName}`,
      });
    } catch (error) {
      toast({
        title: "Error Scanning Receipt",
        description: "Failed to scan the receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleReceiptUpload(file); // Handle receipt image upload
    }
  };

  return (
    <div className="flex gap-2">
      {/* CSV Upload Button */}
      <CSVReader onUploadAccepted={onUpload}>
        {({ getRootProps }: any) => (
          <Button
            size="sm"
            className="w-full lg:w-auto"
            {...getRootProps()} // Spread root props for file upload
          >
            <Upload className="size-4 mr-2" />
            Import CSV
          </Button>
        )}
      </CSVReader>

      {/* Receipt Upload Button */}
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