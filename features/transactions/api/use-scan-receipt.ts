import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const scanReceipt = async (file: File) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    console.log("Base64 string:", base64String); // Debugging: Log the base64 string

    const prompt = `
    Analyze this receipt image and extract the following information in JSON format:
    - Total amount (just the number)
    - Date (in ISO format)
    - Note or description (brief summary)
    - Payee or merchant name
    - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
    
    Only respond with valid JSON in this exact format:
    {
      "amount": number,
      "date": "ISO date string",
      "note": "string",
      "payee": "string",
      "category": "string"
    }

    If it's not a receipt, return an empty object.
  `;

  console.log("Prompt:", prompt); // Debugging: Log the prompt

  // Call the AI API
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64String,
        mimeType: file.type,
      },
    },
  ]);

  const response = await result.response;
  const text = response.text();
  console.log("AI response:", text); // Debugging: Log the AI response

  // Clean and parse the response
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  try {
    const data = JSON.parse(cleanedText);
    return {
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      note: data.note,
      payee: data.payee,
      category: data.category,
    };
  } catch (parseError) {
    console.error("Error parsing JSON response:", parseError);
    throw new Error("Invalid response format from Gemini");
  }
} catch (error) {
  console.error("Error scanning receipt:", error);
  throw new Error("Failed to scan receipt");
}
};

// // Hook to use the scanReceipt function
// export const useScanReceipt = () => {
//   const scan = async (file: File) => {
//     try {
//       const receiptData = await scanReceipt(file);
//       return receiptData;
//     } catch (error) {
//       console.error("Error scanning receipt:", error);
//       throw error;
//     }
//   };

//   return { scan };
// };