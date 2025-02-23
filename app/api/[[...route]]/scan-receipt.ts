import { NextResponse } from "next/server";
import { scanReceipt } from "@/features/transactions/api/use-scan-receipt"; // Import scanReceipt directly

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const receiptData = await scanReceipt(file);
    return NextResponse.json({ success: true, data: receiptData });
  } catch (error) {
    console.error("Error in scan receipt API:", error);
    return NextResponse.json(
      { error: "Failed to scan receipt" },
      { status: 500 }
    );
  }
}