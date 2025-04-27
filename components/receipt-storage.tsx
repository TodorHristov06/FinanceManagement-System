// components/receipt-storage.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Receipt, Upload, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export const ReceiptStorage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [receipts, setReceipts] = useState<string[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newReceipts: string[] = [];
    
    Array.from(files).forEach((file) => {
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newReceipts.push(event.target.result as string);
          setReceipts(prev => [...prev, ...newReceipts]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteReceipt = (index: number) => {
    setReceipts(prev => prev.filter((_, i) => i !== index));
    if (selectedReceipt === receipts[index]) {
      setSelectedReceipt(null);
    }
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
              >
                <Upload className="size-4 mr-2"/>
                Upload Receipts
              </Button>
              
              <div className="space-y-2">
                {receipts.map((receipt, index) => (
                  <div 
                    key={index}
                    className={`p-2 border rounded cursor-pointer hover:bg-accent ${selectedReceipt === receipt ? 'bg-accent' : ''}`}
                    onClick={() => setSelectedReceipt(receipt)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">Receipt {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReceipt(index);
                        }}
                      >
                        <X className="size-3"/>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Receipt preview area */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              {selectedReceipt ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedReceipt}
                    alt="Receipt"
                    fill
                    className="object-contain p-4"
                    unoptimized // For local data URLs
                  />
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Select a receipt to preview
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};