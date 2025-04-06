import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DesignRequest, DesignResponse, OpenAIError } from '@/types/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as DesignRequest;
    const { imageBase64, style, additionalPreferences, imageDescription, designPrompt } = body;

    // Validate required fields
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    if (!style) {
      return NextResponse.json(
        { error: 'No style selected' },
        { status: 400 }
      );
    }
    if (!imageDescription) {
      return NextResponse.json(
        { error: 'No room description provided' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('Starting design generation process...');

    // Generate design suggestions using GPT-4o-mini
    console.log('Generating design suggestions...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert interior designer. Analyze the provided space and suggest improvements based on the requested style and preferences. Format your response in markdown with clear sections and bullet points."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this ${imageDescription} and provide design suggestions for a ${style} style${
                additionalPreferences ? ` with the following preferences: ${additionalPreferences}` : ''
              }. Format your response in markdown with the following sections:

## Color Palette
- List 3-5 main colors
- Include accent colors
- Explain the color scheme rationale

## Furniture Recommendations
- List key furniture pieces
- Include specific style suggestions
- Mention any space-saving solutions

## Lighting Design
- Ambient lighting suggestions
- Task lighting recommendations
- Decorative lighting ideas

## Textiles & Materials
- Fabric suggestions
- Material recommendations
- Pattern ideas

## Decorative Elements
- Artwork suggestions
- Accessory recommendations
- Plant and greenery ideas

## Space Optimization
- Layout improvements
- Storage solutions
- Flow and functionality tips`
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const designSuggestions = completion.choices[0].message.content || '';
    console.log('Design suggestions generated successfully');

    // Generate design visualization using OpenAI
    console.log('Generating design visualization...');
    const imagePrompt = `Create a photorealistic interior design visualization of this ${imageDescription}, redesigned in a ${style} style${
      additionalPreferences ? ` with the following elements: ${additionalPreferences}` : ''
    }${designPrompt ? `. Specifically: ${designPrompt}` : ''}. The image should be an ultra-realistic photograph with perfect lighting, shadows, and materials. Use professional architectural photography techniques with high dynamic range, perfect focus, and natural color balance.`;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
      response_format: "url"
    });

    const generatedImageUrls = imageResponse.data.map(img => img.url || '');
    console.log('Generated image URLs:', generatedImageUrls);

    const response: DesignResponse = {
      designSuggestions,
      generatedImageUrls
    };

    console.log('Final response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing design request:', error);
    const openaiError = error as OpenAIError;
    return NextResponse.json(
      { 
        error: openaiError.error?.message || 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 