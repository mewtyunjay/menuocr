import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the schema for menu items
const schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      categoryName: {
        type: SchemaType.STRING,
        description: "Category of the menu item",
      },
      itemImage: {
        type: SchemaType.STRING,
        description: "URL of the item image",
      },
      item_description: {
        type: SchemaType.STRING,
        description: "Description of the menu item",
      },
      item_foodType: {
        type: SchemaType.STRING,
        description: "Type of food (Veg/Non-Veg)",
        enum: ["Veg", "Non-Veg"],
      },
      item_name: {
        type: SchemaType.STRING,
        description: "Name of the menu item",
      },
      item_original_price: {
        type: SchemaType.NUMBER,
        description: "Original price of the item",
      },
      item_discounted_price: {
        type: SchemaType.NUMBER,
        description: "Discounted price of the item",
      },
      outofStock: {
        type: SchemaType.BOOLEAN,
        description: "Whether the item is out of stock",
      },
      resId: {
        type: SchemaType.STRING,
        description: "Restaurant ID",
      },
    },
    required: ["categoryName", "item_name", "item_original_price", "item_discounted_price", "item_foodType", "outofStock", "resId"],
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Initialize the model with the schema
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // Create the prompt for menu parsing
    const prompt = `
      Analyze this menu image and extract menu items.
      For each item, provide:
      - categoryName (e.g., "Indian", "Chinese", "Italian" etc.)
      - item_name
      - item_foodType (must be either "Veg" or "Non-Veg")
      - item_original_price (as a number)
      - item_discounted_price
      - outofStock (randomly set as set true for now)
      - resId (generate a random string with "res" prefix)
      Leave itemImage, item_description and item_discounted_price as empty strings. For items with multiple variants, create a new item for each variant.
    `;

    // Generate content with the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64
        }
      }
    ]);

    const response = JSON.parse(result.response.text());
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 }
    );
  }
} 