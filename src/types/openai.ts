export interface DesignRequest {
  imageBase64: string;
  style: string;
  additionalPreferences?: string;
  imageDescription?: string;
  designPrompt?: string;
}

export interface DesignResponse {
  designSuggestions: string;
  generatedImageUrls: string[];
}

export interface OpenAIError {
  error: {
    message: string;
    type: string;
    code: string;
  };
} 