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

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
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
3. Add your OpenAI API key in the Vercel environment variables
4. Deploy!

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - Reusable React components
- `src/app/globals.css` - Global styles and Tailwind imports

## API Integration

The application includes a mock API endpoint at `/api/design` that simulates the AI design generation process. To integrate with a real AI service:

1. Update the API endpoint in `src/app/api/design/route.ts`
2. Modify the request/response format to match your AI service's requirements
3. Add any necessary authentication or API keys

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 