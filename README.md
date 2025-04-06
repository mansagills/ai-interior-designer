# AI Interior Designer

A web application that uses AI to generate interior design suggestions and visualizations based on uploaded room images.

## Features

- Upload room images for analysis
- Select from various design styles
- Provide custom design preferences
- Generate detailed design suggestions
- Create photorealistic design visualizations
- Interactive image viewing with zoom functionality

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4 and DALL-E 3)
- React Markdown

## Security Considerations

### Environment Variables
- Never commit API keys or sensitive information to the repository
- Use `.env.local` for local development (this file is gitignored)
- For production, add environment variables in the Vercel dashboard
- See `.env.example` for required variables

### API Key Security
- Keep your OpenAI API key secure and never expose it in client-side code
- All API calls are made server-side through Next.js API routes
- Regularly rotate your API keys
- Monitor your API usage for any suspicious activity

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-interior-designer.git
   cd ai-interior-designer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your actual API key
   # Never commit this file!
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add `OPENAI_API_KEY` with your production API key
4. Deploy!

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - Reusable React components
- `src/app/globals.css` - Global styles and Tailwind imports

## API Integration

The application uses OpenAI's API for generating design suggestions and visualizations. All API calls are made server-side through Next.js API routes to ensure API key security.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 