import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ResultPanelProps {
  designSuggestions: string;
  generatedImageUrls?: string[];
}

export default function ResultPanel({ designSuggestions, generatedImageUrls = [] }: ResultPanelProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    setSelectedImage(url);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Design Suggestions</h3>
        <div className="prose max-w-none">
          <ReactMarkdown>{designSuggestions}</ReactMarkdown>
        </div>
      </div>

      {generatedImageUrls.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Generated Designs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImageUrls.map((url, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer"
                onClick={(e) => handleImageClick(e, url)}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={url}
                    alt={`Generated design ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Error loading image:', url);
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm font-medium">Click to enlarge</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged design"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-white bg-opacity-75 hover:bg-opacity-100 text-gray-800 rounded-full p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 