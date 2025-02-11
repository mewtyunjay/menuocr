import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Define interfaces for type safety
interface BaseMenuItem {
  categoryName: string;
  item_name: string;
  item_foodType: "Veg" | "Non-Veg";
  item_original_price: number;
}

interface CompleteMenuItem extends BaseMenuItem {
  itemImage: string;
  item_description: string;
  item_discounted_price: number;
  outofStock: boolean;
  resId: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define simplified schema for only the dynamic values
const schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      categoryName: {
        type: SchemaType.STRING,
        description: "Category of the menu item",
      },
      item_name: {
        type: SchemaType.STRING,
        description: "Name of the menu item",
      },
      item_foodType: {
        type: SchemaType.STRING,
        description: "Type of food (Veg/Non-Veg)",
        enum: ["Veg", "Non-Veg"],
      },
      item_original_price: {
        type: SchemaType.NUMBER,
        description: "Price of the item",
      },
    },
    required: ["categoryName", "item_name", "item_original_price", "item_foodType"],
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
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // Create the prompt for menu parsing
    const prompt = `
      Analyze this menu image and extract menu items.
      For each item, provide only:
      - categoryName (e.g., "Indian", "Chinese", "Italian" etc.)
      - item_name
      - item_foodType (must be either "Veg" or "Non-Veg")
      - item_original_price (as a number)
      For items with multiple variants, create a new item for each variant.
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

    // Parse the base response
    const baseResponse = JSON.parse(result.response.text()) as BaseMenuItem[];
    
    // Add preset values to each item
    const completeResponse = baseResponse.map((item: BaseMenuItem, index: number): CompleteMenuItem => ({
      ...item,
      itemImage: "",
      item_description: "",
      item_discounted_price: item.item_original_price,
      outofStock: false,
      resId: `res${String(index + 100).padStart(3, '0')}`,
    }));

    return NextResponse.json(completeResponse);
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 }
    );
  }
} 