# AI Features Setup

This application includes AI-powered features for enhancing your note-taking experience.

## Features

- **Auto Title Generation**: Automatically generate descriptive titles for your notes based on content
- **Text Expansion**: Expand shorthand notes into full, well-structured content
- **Note Summarization**: Summarize long notes into concise, key points

## Setup

### 1. OpenAI API Key

You need an OpenAI API key to use the AI features. Add it to your `.env.local` file:

```env
OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Get an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

## Usage

### In Note Editor

When creating or editing a note, you'll find AI actions below the content field:

- **Auto Title**: Generates a title based on your note content (requires at least 20 characters)
- **Expand Text**: Converts shorthand notes into full content (requires at least 10 characters)
- **Summarize**: Creates a concise summary of long notes (requires at least 100 characters)

### Error Handling

- If an action fails, an error message will appear
- Check that your content meets minimum length requirements
- Verify your OpenAI API key is correctly configured
- Ensure you have sufficient API credits

## API Endpoints

The following endpoints are available for AI features:

- `POST /api/ai/title` - Generate title from content
- `POST /api/ai/expand` - Expand shorthand text
- `POST /api/ai/summarize` - Summarize long content

## Model Used

The application uses `gpt-4o-mini` for optimal performance and cost efficiency.

## Cost Considerations

- All AI features use OpenAI's API which incurs costs
- The app uses `gpt-4o-mini` which is cost-effective
- Monitor your OpenAI usage dashboard for cost tracking
