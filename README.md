# Menu Parser

A modern web application that uses AI to extract menu items from images. Built with Next.js and Google's Gemini AI, this tool helps digitize menu items quickly and efficiently.

## Features

- 🖼️ Image Upload: Drag & drop or click to upload menu images
- 🤖 AI Processing: Uses Gemini AI to extract menu items
- 📋 Structured Data: Converts menu images into structured JSON
- 🎨 Dark Mode UI: Modern, accessible interface
- 📱 Responsive Design: Works on all device sizes

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini AI
- React Dropzone

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/menu-parser.git
   cd menu-parser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a menu image using the drag & drop interface or file selector
2. Wait for the AI to process the image
3. View the extracted menu items in the table
4. Click "Copy JSON" to copy the structured data

## JSON Structure

The application outputs menu items in the following structure:

```json
[
  {
    "categoryName": "string",
    "itemImage": "string",
    "item_description": "string",
    "item_foodType": "Veg" | "Non-Veg",
    "item_name": "string",
    "item_original_price": number,
    "item_discounted_price": number,
    "outofStock": boolean,
    "resId": "string"
  }
]
```

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for image processing
- Next.js team for the amazing framework
- Tailwind CSS for the styling utilities
