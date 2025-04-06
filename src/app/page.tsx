'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import StyleSelector from '@/components/StyleSelector';
import Spinner from '@/components/Spinner';
import ResultPanel from '@/components/ResultPanel';

interface DesignResponse {
  designSuggestions: string;
  generatedImageUrls: string[];
  skyboxUrl: string;
}

export default function Home() {
  const [imageBase64, setImageBase64] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [additionalPreferences, setAdditionalPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DesignResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [designPrompt, setDesignPrompt] = useState('');

  const handleGenerateDesign = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          style: selectedStyle,
          additionalPreferences,
          imageDescription,
          designPrompt
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate design');
      }

      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Interior Designer
          </h1>
          <p className="text-gray-600">
            Upload a photo of your space and get AI-powered design suggestions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="imageDescription" className="block text-sm font-medium text-gray-700">
              What type of room is this?
            </label>
            <input
              type="text"
              id="imageDescription"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="e.g., I'm uploading an image of my Kitchen"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <FileUpload onImageUpload={setImageBase64} />
          
          <StyleSelector onStyleSelect={setSelectedStyle} />
          
          <div>
            <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Preferences
            </label>
            <textarea
              id="preferences"
              rows={3}
              value={additionalPreferences}
              onChange={(e) => setAdditionalPreferences(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any specific preferences (e.g., color scheme, functional requirements)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="designPrompt" className="block text-sm font-medium text-gray-700">
              How would you like your space to look?
            </label>
            <textarea
              id="designPrompt"
              value={designPrompt}
              onChange={(e) => setDesignPrompt(e.target.value)}
              placeholder="Describe specific elements you'd like to see in the redesign (e.g., 'Add a large window with natural light, modern furniture, and warm wood accents')"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateDesign}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? <Spinner /> : 'Generate Design'}
          </button>
        </div>

        {results && (
          <div className="mt-8">
            <ResultPanel
              designSuggestions={results.designSuggestions}
              generatedImageUrls={results.generatedImageUrls}
            />
            <button
              onClick={() => {
                setResults(null);
                setImageBase64('');
                setSelectedStyle('');
                setAdditionalPreferences('');
                setError(null);
              }}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 