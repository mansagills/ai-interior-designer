import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface ResultPanelProps {
  designSuggestions: string;
  generatedImageUrls: string[];
}

const ResultPanel: React.FC<ResultPanelProps> = ({
  designSuggestions,
  generatedImageUrls,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  return (
    <div className="mt-8 space-y-6">
      <div className="prose max-w-none">
        <ReactMarkdown>{designSuggestions}</ReactMarkdown>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {generatedImageUrls.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer"
            onClick={() => setSelectedImage(url)}
          >
            <Image
              src={url}
              alt={`Generated design ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-full p-4">
            <Image
              src={selectedImage}
              alt="Enlarged design"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPanel; 