// components/receipt-storage.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Receipt, Upload, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

type ReceiptType = {
  id: string;
  imageData: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  transactionId?: string;
};

export const ReceiptStorage = ({ transactionId }: { transactionId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: receipts, isLoading } = useQuery<ReceiptType[], Error, ReceiptType[]>({
    queryKey: ["receipts", userId, transactionId],
    queryFn: async () => {
      const response = await client.api.receipts.$get({
        query: { userId: userId!, transactionId }
      });
      if (!response.ok) throw new Error("Failed to fetch receipts");
      const { data } = await response.json();
      return data.map((receipt: any) => ({
        ...receipt,
        createdAt: receipt.createdAt ? new Date(receipt.createdAt) : new Date(),
      }));
    },
    enabled: !!userId && isOpen // Fetch only when dialog is open
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!userId) throw new Error("User not authenticated");
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      if (transactionId) {
        formData.append("transactionId", transactionId);
      }

      const response = await fetch("/api/receipts", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload receipt");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts", userId, transactionId] });
      toast({ title: "Receipt uploaded successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error uploading receipt",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/receipts/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Failed to delete receipt");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts", userId, transactionId] });
      setSelectedReceipt(null);
      toast({ title: "Receipt deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting receipt",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !userId) return;

    Array.from(files).forEach((file) => {
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }

      uploadMutation.mutate(file);
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="w-full lg:w-auto"
        onClick={() => setIsOpen(true)}
      >
        <Receipt className="size-4 mr-2"/>
        Receipt Storage
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Receipt Storage</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-1 overflow-hidden gap-4">
            {/* Receipt list sidebar */}
            <div className="w-1/4 border-r overflow-y-auto">
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={handleUploadClick}
                disabled={uploadMutation.isPending}
              >
                <Upload className="size-4 mr-2"/>
                {uploadMutation.isPending ? "Uploading..." : "Upload Receipts"}
              </Button>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {receipts?.map((receipt) => (
                    <div 
                      key={receipt.id}
                      className={`p-2 border rounded cursor-pointer hover:bg-accent ${
                        selectedReceipt?.id === receipt.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedReceipt(receipt)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">
                          {receipt.fileName || "Receipt"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(receipt.id);
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <X className="size-3"/>
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(receipt.createdAt).toLocaleDateString()} • 
                        {(receipt.fileSize / 1024).toFixed(1)}KB
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Receipt preview area */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              {selectedReceipt ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedReceipt.imageData}
                    alt="Receipt"
                    fill
                    className="object-contain p-4"
                    unoptimized // Necessary for data URLs
                  />
                </div>
              ) : (
                <div className="text-muted-foreground">
                  {receipts?.length ? "Select a receipt to preview" : "No receipts found"}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};