import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DesignRequest, DesignResponse } from '@/types/openai';

// Initialize OpenAI client with error handling
let openai: OpenAI | undefined;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export async function POST(request: Request) {
  // Ensure we always return a valid JSON response
  const errorResponse = (message: string, status: number = 500) => {
    return NextResponse.json(
      { error: message },
      { status }
    );
  };

  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      return errorResponse('OpenAI client not initialized', 500);
    }

    // Check if API key is set
    if (!process.env.OPENAI_API_KEY) {
      return errorResponse('OpenAI API key not configured', 500);
    }

    // Parse request body
    let body: DesignRequest;
    try {
      body = await request.json();
    } catch (error) {
      return errorResponse('Invalid request body', 400);
    }

    const { imageBase64, style, additionalPreferences, imageDescription, designPrompt } = body;

    // Validate required fields
    if (!imageBase64) {
      return errorResponse('Image is required', 400);
    }
    if (!style) {
      return errorResponse('Style is required', 400);
    }
    if (!imageDescription) {
      return errorResponse('Room description is required', 400);
    }

    // Generate design suggestions
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interior designer. Provide detailed design suggestions based on the uploaded image and selected style.'
          },
          {
            role: 'user',
            content: `Image description: ${imageDescription}\nStyle: ${style}\nAdditional preferences: ${additionalPreferences || 'None'}\nDesign prompt: ${designPrompt || 'None'}\n\nPlease provide detailed design suggestions in markdown format.`
          }
        ],
      });
    } catch (error) {
      console.error('OpenAI API error:', error);
      return errorResponse('Failed to generate design suggestions', 500);
    }

    const designSuggestions = completion.choices[0].message.content || '';

    // Generate image
    let imageResponse;
    try {
      imageResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Create a photorealistic interior design visualization of a ${imageDescription} in ${style} style. ${designPrompt ? `Incorporate these elements: ${designPrompt}` : ''} Make it look like a professional interior design photograph.`,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural',
      });
    } catch (error) {
      console.error('DALL-E API error:', error);
      return errorResponse('Failed to generate image', 500);
    }

    const generatedImageUrls = imageResponse.data.map((img: { url?: string }) => img.url || '');

    // Return success response
    return NextResponse.json({
      designSuggestions,
      generatedImageUrls,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return errorResponse('An unexpected error occurred');
  }
} 