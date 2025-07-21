import { AgentProduct } from '@/types';

export const AGENT_PRODUCTS: AgentProduct[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    domain: 'chat.openai.com',
    category: 'chatbot',
    description: 'AI-powered conversational assistant by OpenAI'
  },
  {
    id: 'claude',
    name: 'Claude',
    domain: 'claude.ai',
    category: 'chatbot',
    description: 'AI assistant by Anthropic'
  },
  {
    id: 'bard',
    name: 'Bard',
    domain: 'bard.google.com',
    category: 'chatbot',
    description: 'Google\'s AI chatbot'
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    domain: 'github.com',
    category: 'coding',
    description: 'AI-powered code completion tool'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    domain: 'cursor.sh',
    category: 'coding',
    description: 'AI-first code editor'
  },
  {
    id: 'jasper',
    name: 'Jasper',
    domain: 'jasper.ai',
    category: 'writing',
    description: 'AI content creation platform'
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    domain: 'copy.ai',
    category: 'writing',
    description: 'AI-powered copywriting tool'
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    domain: 'notion.so',
    category: 'productivity',
    description: 'AI features integrated into Notion workspace'
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    domain: 'grammarly.com',
    category: 'writing',
    description: 'AI-powered writing assistant'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    domain: 'midjourney.com',
    category: 'other',
    description: 'AI image generation platform'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    domain: 'perplexity.ai',
    category: 'chatbot',
    description: 'AI-powered search and research assistant'
  },
  {
    id: 'character-ai',
    name: 'Character.AI',
    domain: 'character.ai',
    category: 'chatbot',
    description: 'AI platform for conversational character creation'
  },
  {
    id: 'replit-ghostwriter',
    name: 'Replit Ghostwriter',
    domain: 'replit.com',
    category: 'coding',
    description: 'AI pair programmer for coding assistance'
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    domain: 'tabnine.com',
    category: 'coding',
    description: 'AI code completion and generation'
  },
  {
    id: 'codeium',
    name: 'Codeium',
    domain: 'codeium.com',
    category: 'coding',
    description: 'Free AI-powered code acceleration toolkit'
  },
  {
    id: 'writesonic',
    name: 'Writesonic',
    domain: 'writesonic.com',
    category: 'writing',
    description: 'AI writing assistant and content generator'
  },
  {
    id: 'rytr',
    name: 'Rytr',
    domain: 'rytr.me',
    category: 'writing',
    description: 'AI writing assistant for multiple content types'
  },
  {
    id: 'dall-e',
    name: 'DALL-E 2',
    domain: 'openai.com',
    category: 'other',
    description: 'AI system that creates realistic images from text'
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    domain: 'stability.ai',
    category: 'other',
    description: 'Open-source AI image generation model'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    domain: 'elevenlabs.io',
    category: 'other',
    description: 'AI voice generation and cloning platform'
  },
  {
    id: 'runway',
    name: 'Runway',
    domain: 'runwayml.com',
    category: 'other',
    description: 'AI-powered creative tools for video and image editing'
  },
  {
    id: 'monday-ai',
    name: 'Monday.com AI',
    domain: 'monday.com',
    category: 'productivity',
    description: 'AI-enhanced project management and workflow automation'
  },
  {
    id: 'clickup-ai',
    name: 'ClickUp AI',
    domain: 'clickup.com',
    category: 'productivity',
    description: 'AI assistant for task management and productivity'
  },
  {
    id: 'gamma',
    name: 'Gamma',
    domain: 'gamma.app',
    category: 'productivity',
    description: 'AI-powered presentation and document creation'
  },
  {
    id: 'tome',
    name: 'Tome',
    domain: 'tome.app',
    category: 'productivity',
    description: 'AI storytelling and presentation platform'
  },
  {
    id: 'codex',
    name: 'OpenAI Codex',
    domain: 'openai.com',
    category: 'coding',
    description: 'AI system that translates natural language to code'
  },
  {
    id: 'fireflies',
    name: 'Fireflies.ai',
    domain: 'fireflies.ai',
    category: 'productivity',
    description: 'AI meeting assistant for note-taking and transcription'
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    domain: 'otter.ai',
    category: 'productivity',
    description: 'AI-powered meeting transcription and collaboration'
  },
  {
    id: 'chatpdf',
    name: 'ChatPDF',
    domain: 'chatpdf.com',
    category: 'productivity',
    description: 'AI tool for chatting with PDF documents'
  },
  {
    id: 'leonardo',
    name: 'Leonardo.AI',
    domain: 'leonardo.ai',
    category: 'other',
    description: 'AI art generator with focus on creative content'
  }
];

export const CATEGORY_COLORS = {
  chatbot: '#3B82F6',
  coding: '#10B981',
  writing: '#8B5CF6',
  productivity: '#F59E0B',
  other: '#6B7280'
} as const;