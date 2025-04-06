import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DesignRequest, DesignResponse } from '@/types/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body: DesignRequest = await request.json();
    const { imageBase64, style, additionalPreferences, imageDescription, designPrompt } = body;

    if (!imageBase64 || !style) {
      return NextResponse.json(
        { error: 'Image and style are required' },
        { status: 400 }
      );
    }

    // Generate design suggestions using GPT-4
    const completion = await openai.chat.completions.create({
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

    const designSuggestions = completion.choices[0].message.content || '';

    // Generate image using DALL-E
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a photorealistic interior design visualization of a ${imageDescription} in ${style} style. ${designPrompt ? `Incorporate these elements: ${designPrompt}` : ''} Make it look like a professional interior design photograph.`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural',
    });

    const generatedImageUrls = imageResponse.data.map(img => img.url || '');

    const response: DesignResponse = {
      designSuggestions,
      generatedImageUrls,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error:', error);
    // Ensure we return a valid JSON response even in case of errors
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 