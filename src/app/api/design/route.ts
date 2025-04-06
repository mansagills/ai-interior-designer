import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DesignRequest, DesignResponse } from '@/types/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Log the start of the request
    console.log('Starting design generation request...');

    // Parse the request body
    let body: DesignRequest;
    try {
      body = await request.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', details: 'Could not parse JSON' },
        { status: 400 }
      );
    }

    const { imageBase64, style, additionalPreferences, imageDescription, designPrompt } = body;

    // Validate required fields
    if (!imageBase64 || !style) {
      console.error('Missing required fields:', { imageBase64: !!imageBase64, style: !!style });
      return NextResponse.json(
        { error: 'Image and style are required' },
        { status: 400 }
      );
    }

    // Generate design suggestions using GPT-4
    console.log('Generating design suggestions...');
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
      console.log('Design suggestions generated successfully');
    } catch (gptError) {
      console.error('Error generating design suggestions:', gptError);
      return NextResponse.json(
        { 
          error: 'Failed to generate design suggestions',
          details: gptError instanceof Error ? gptError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    const designSuggestions = completion.choices[0].message.content || '';

    // Generate image using DALL-E
    console.log('Generating image...');
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
      console.log('Image generated successfully');
    } catch (dalleError) {
      console.error('Error generating image:', dalleError);
      return NextResponse.json(
        { 
          error: 'Failed to generate image',
          details: dalleError instanceof Error ? dalleError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    const generatedImageUrls = imageResponse.data.map(img => img.url || '');

    const response: DesignResponse = {
      designSuggestions,
      generatedImageUrls,
    };

    console.log('Request completed successfully');
    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 