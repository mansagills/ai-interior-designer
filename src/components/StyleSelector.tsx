import { ChangeEvent } from 'react';

const designStyles = [
  'modern',
  'farmhouse',
  'vintage',
  'scandinavian',
  'bohemian',
  'industrial',
  'minimalist',
  'coastal',
  'mid-century',
  'contemporary'
];

interface StyleSelectorProps {
  onStyleSelect: (style: string) => void;
}

export default function StyleSelector({ onStyleSelect }: StyleSelectorProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onStyleSelect(e.target.value);
  };

  return (
    <div className="w-full">
      <label htmlFor="style-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Design Style
      </label>
      <select
        id="style-select"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Choose a style</option>
        {designStyles.map((style) => (
          <option key={style} value={style}>
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
} 