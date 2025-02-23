import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios'; // For making API requests

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Function to convert any amount to EUR
const convertToEUR = async (amount: number, fromCurrency: string): Promise<number> => {
  try {
    // Use a currency conversion API to get conversion rates
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const rate = response.data.rates['EUR'];

    if (!rate) {
      throw new Error("Conversion rate for EUR not found.");
    }

    // Convert the amount to EUR
    return amount * rate;
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    throw new Error("Currency conversion failed");
  }
};

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
    - Currency code (e.g. USD, GBP, EUR, etc.)
    - Date (in ISO format)
    - Note or description (brief summary)
    - Payee or merchant name
    - Suggested category (one of: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense)
    
    Only respond with valid JSON in this exact format:
    {
      "amount": number,
      "currency": "USD",  // Include currency code in the response (e.g. USD, GBP)
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
    const text = await response.text();
    console.log("AI response:", text); // Debugging: Log the AI response

    // Clean and parse the response
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      const amountInOriginalCurrency = parseFloat(data.amount);
      const currency = data.currency || "USD"; // Fallback to USD if no currency is found

      // Convert amount to EUR
      const amountInEUR = await convertToEUR(amountInOriginalCurrency, currency);

      return {
        amount: amountInEUR,
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