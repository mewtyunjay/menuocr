'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';

interface MenuItem {
  categoryName: string;
  itemImage: string;
  item_description: string;
  item_foodType: 'Veg' | 'Non-Veg';
  item_name: string;
  item_original_price: number;
  item_discounted_price: number;
  outofStock: boolean;
  resId: string;
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError('Error processing file. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyJson = () => {
    const jsonString = JSON.stringify(menuItems, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Menu Parser</h1>
          <p className="text-gray-400">
            Upload your menu image and let AI extract the items
          </p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />

        {error && (
          <div className="text-red-400 text-center p-4 bg-red-900/50 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        {menuItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyJson}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy JSON
              </button>
              <span className="text-gray-300 text-sm">
                ({menuItems.length} items extracted from menu)
              </span>
              {copied && (
                <span className="text-green-400 text-sm animate-fade-in">
                  JSON copied!
                </span>
              )}
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Original Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Discounted Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                  {menuItems.map((item, index) => (
                    <tr key={item.resId} className={index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{item.item_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.categoryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.item_foodType === 'Veg' 
                            ? 'bg-green-900/50 text-green-300 border border-green-600' 
                            : 'bg-red-900/50 text-red-300 border border-red-600'
                        }`}>
                          {item.item_foodType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.item_original_price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.item_discounted_price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.outofStock 
                            ? 'bg-red-900/50 text-red-300 border border-red-600' 
                            : 'bg-green-900/50 text-green-300 border border-green-600'
                        }`}>
                          {item.outofStock ? 'Out of Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 