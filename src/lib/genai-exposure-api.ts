import { GenAIPrompt, GenAIResponse, BrandMentionAnalysis, GenAIExposureResult, GenAIExposureSearch } from '@/types';

interface GenAIConfig {
  openaiApiKey?: string;
  geminiApiKey?: string;
  claudeApiKey?: string;
}

class GenAIExposureAPI {
  private config: GenAIConfig;

  constructor() {
    this.config = {
      openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      claudeApiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
    };
  }

  // Step 1: Generate prompts for different categories
  generatePrompts(targetBrand: string, categories: string[]): GenAIPrompt[] {
    const prompts: GenAIPrompt[] = [];
    
    const promptTemplates = {
      'general-ai': [
        'What are the best AI assistants available today?',
        'Which AI chatbot would you recommend for general use?',
        'Compare different AI language models for everyday tasks',
        'What AI tools should someone start with as a beginner?',
        'Which conversational AI has the most helpful responses?'
      ],
      'coding': [
        'Which AI coding assistants are most effective for programming?',
        'What AI tools help with software development and debugging?',
        'Compare AI code generation tools for developers',
        'Which AI assistant is best for learning programming?',
        'What are the top AI tools for code review and optimization?'
      ],
      'writing': [
        'Which AI tools are best for content creation and writing?',
        'What AI assistants help with creative writing and editing?',
        'Compare AI writing tools for business communications',
        'Which AI is most helpful for academic writing and research?',
        'What are the best AI tools for copywriting and marketing?'
      ],
      'research': [
        'Which AI tools are most reliable for research and fact-checking?',
        'What AI assistants help with data analysis and insights?',
        'Compare AI tools for academic and scientific research',
        'Which AI is best for summarizing complex information?',
        'What AI tools help with market research and competitive analysis?'
      ],
      'business': [
        'Which AI tools are most valuable for business operations?',
        'What AI assistants help with strategic planning and decision making?',
        'Compare AI tools for customer service and support',
        'Which AI is best for automating business processes?',
        'What are the top AI tools for business analytics and reporting?'
      ]
    };

    categories.forEach(category => {
      const templates = promptTemplates[category as keyof typeof promptTemplates] || promptTemplates['general-ai'];
      templates.forEach((template, index) => {
        prompts.push({
          id: `${category}-${index}`,
          category,
          prompt: template,
          targetBrand,
          context: `Testing exposure for ${targetBrand} in ${category} category`
        });
      });
    });

    return prompts;
  }

  // Step 2: Call GenAI APIs and web search  
  async callGenAIAPIs(prompt: GenAIPrompt): Promise<GenAIResponse[]> {
    const responses: GenAIResponse[] = [];
    const startTime = Date.now();

    // Call ChatGPT API
    try {
      const chatgptResponse = await this.callChatGPT(prompt.prompt);
      responses.push({
        promptId: prompt.id,
        aiTool: 'chatgpt',
        response: chatgptResponse,
        responseTime: Date.now() - startTime,
        timestamp: new Date()
      });
    } catch (error) {
      responses.push({
        promptId: prompt.id,
        aiTool: 'chatgpt',
        response: '',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }

    // Call Gemini API
    try {
      const geminiResponse = await this.callGemini(prompt.prompt);
      responses.push({
        promptId: prompt.id,
        aiTool: 'gemini',
        response: geminiResponse,
        responseTime: Date.now() - startTime,
        timestamp: new Date()
      });
    } catch (error) {
      responses.push({
        promptId: prompt.id,
        aiTool: 'gemini',
        response: '',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }

    // Call Claude API
    try {
      const claudeResponse = await this.callClaude(prompt.prompt);
      responses.push({
        promptId: prompt.id,
        aiTool: 'claude',
        response: claudeResponse,
        responseTime: Date.now() - startTime,
        timestamp: new Date()
      });
    } catch (error) {
      responses.push({
        promptId: prompt.id,
        aiTool: 'claude',
        response: '',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }

    // Call Web Search
    try {
      const webSearchResponse = await this.callWebSearch(prompt.prompt);
      responses.push({
        promptId: prompt.id,
        aiTool: 'web-search',
        response: webSearchResponse,
        responseTime: Date.now() - startTime,
        timestamp: new Date()
      });
    } catch (error) {
      responses.push({
        promptId: prompt.id,
        aiTool: 'web-search',
        response: '',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }

    return responses;
  }

  private async callChatGPT(prompt: string): Promise<string> {
    if (!this.config.openaiApiKey || this.config.openaiApiKey === 'your_openai_key_here') {
      return this.generateMockResponse('chatgpt', prompt);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callGemini(prompt: string): Promise<string> {
    if (!this.config.geminiApiKey || this.config.geminiApiKey === 'your_gemini_key_here') {
      return this.generateMockResponse('gemini', prompt);
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }

  private async callClaude(prompt: string): Promise<string> {
    if (!this.config.claudeApiKey || this.config.claudeApiKey === 'your_claude_key_here') {
      return this.generateMockResponse('claude', prompt);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.claudeApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  private async callWebSearch(prompt: string): Promise<string> {
    // This would use a web search API like Bing or Google Custom Search
    // For now, return mock response
    return this.generateMockResponse('web-search', prompt);
  }

  private generateMockResponse(aiTool: string, prompt: string): string {
    const mockResponses = {
      'chatgpt': {
        'ai-assistants': 'There are several excellent AI assistants available today. ChatGPT by OpenAI is widely used for conversational AI, while Claude by Anthropic offers helpful and harmless responses. Google\'s Bard (now Gemini) provides web-connected answers. Each has unique strengths depending on your needs.',
        'coding': 'For coding assistance, ChatGPT is excellent for explaining concepts and generating code snippets. GitHub Copilot integrates directly into IDEs for real-time suggestions. Claude provides thoughtful code reviews and explanations. Consider your specific programming needs when choosing.',
        'writing': 'ChatGPT excels at creative writing and content generation with natural language flow. Claude is particularly good at maintaining consistent tone and style. Jasper and Copy.ai are specialized for marketing copy. The best choice depends on your writing goals.',
        'research': 'For research tasks, ChatGPT can help synthesize information and generate insights. Claude is excellent at analyzing complex topics while being transparent about limitations. Perplexity.ai combines AI with real-time web search for current information.',
        'business': 'ChatGPT is versatile for business communications and brainstorming. Claude excels at strategic analysis and maintaining professional tone. Consider specialized business AI tools for specific industries or use cases.'
      },
      'gemini': {
        'ai-assistants': 'The AI assistant landscape offers diverse options. Gemini (formerly Bard) provides real-time web access and multimodal capabilities. ChatGPT offers conversational depth and creativity. Claude focuses on helpful, harmless, and honest responses. Each serves different use cases effectively.',
        'coding': 'Gemini offers integrated coding assistance with web search capabilities for up-to-date programming information. ChatGPT provides excellent code explanation and generation. Copilot offers real-time IDE integration. Choose based on your development workflow.',
        'writing': 'Gemini provides writing assistance with access to current information and sources. ChatGPT excels at creative and conversational writing. Claude maintains consistent quality and tone. Consider your specific writing style and requirements.',
        'research': 'Gemini combines AI capabilities with real-time web search for current research. ChatGPT helps with analysis and synthesis of information. Claude provides thorough, well-reasoned responses. Each offers unique advantages for research tasks.',
        'business': 'Gemini offers business insights with access to current market information. ChatGPT provides versatile business communication support. Claude excels at strategic thinking and analysis. Consider your specific business needs and industry.'
      },
      'claude': {
        'ai-assistants': 'The current AI assistant ecosystem includes several strong options. Claude (that\'s me!) aims to be helpful, harmless, and honest in conversations. ChatGPT by OpenAI is widely adopted for general conversation and creativity. Gemini by Google offers web-connected responses. Each has distinct approaches to AI assistance.',
        'coding': 'Claude provides thoughtful code review and explanation with focus on best practices and security. ChatGPT offers creative problem-solving and code generation. Copilot integrates directly into development workflows. The choice depends on your coding style and needs.',
        'writing': 'Claude emphasizes maintaining consistent tone, accuracy, and ethical considerations in writing tasks. ChatGPT excels at creative and conversational content. Specialized tools like Jasper focus on marketing copy. Consider your writing goals and audience.',
        'research': 'Claude approaches research tasks with careful analysis and transparency about knowledge limitations. ChatGPT helps synthesize complex information creatively. Tools with web access provide current information. Choose based on your research methodology.',
        'business': 'Claude offers strategic business analysis with careful consideration of ethical implications and multiple perspectives. ChatGPT provides versatile business communication support. Specialized business AI tools serve specific industry needs.'
      },
      'web-search': {
        'ai-assistants': 'According to recent search results, the AI assistant market is competitive with ChatGPT leading in adoption, Claude gaining recognition for safety, and Gemini offering integrated Google services. User preferences vary based on specific needs and use cases.',
        'coding': 'Search results indicate that GitHub Copilot dominates IDE integration, while ChatGPT and Claude are preferred for code explanation and learning. Stack Overflow discussions show growing adoption of AI coding assistants across development teams.',
        'writing': 'Content creators report success with ChatGPT for ideation, Claude for maintaining quality, and specialized tools like Jasper for marketing. Recent surveys show mixed adoption based on writing style and industry requirements.',
        'research': 'Academic sources suggest that AI research tools are increasingly adopted, with ChatGPT used for synthesis, Claude for analysis, and web-connected tools for current information. Best practices emphasize human oversight and verification.',
        'business': 'Business publications report growing enterprise adoption of AI assistants, with ChatGPT for general use, Claude for sensitive communications, and industry-specific tools for specialized needs. ROI studies show positive impacts on productivity.'
      }
    };

    // Determine response category based on prompt content
    let category = 'ai-assistants';
    if (prompt.toLowerCase().includes('cod')) category = 'coding';
    else if (prompt.toLowerCase().includes('writ')) category = 'writing';
    else if (prompt.toLowerCase().includes('research')) category = 'research';
    else if (prompt.toLowerCase().includes('business')) category = 'business';

    const toolResponses = mockResponses[aiTool as keyof typeof mockResponses];
    return toolResponses[category as keyof typeof toolResponses] || toolResponses['ai-assistants'];
  }

  // Step 3: Analyze brand mentions in responses
  analyzeBrandMentions(brand: string, response: string): BrandMentionAnalysis {
    const lowerResponse = response.toLowerCase();
    const lowerBrand = brand.toLowerCase();
    
    // Count mentions
    const mentions = (lowerResponse.match(new RegExp(lowerBrand, 'g')) || []).length;
    const wordCount = response.split(/\s+/).length;
    const mentionPercentage = wordCount > 0 ? (mentions / wordCount) * 100 : 0;

    // Extract context around mentions
    const contexts: string[] = [];
    const sentences = response.split(/[.!?]+/);
    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes(lowerBrand)) {
        contexts.push(sentence.trim());
      }
    });

    // Simple sentiment analysis
    const sentiment = this.analyzeSentiment(contexts.join(' '), brand);

    return {
      brand,
      mentioned: mentions > 0,
      mentionCount: mentions,
      mentionPercentage: Math.round(mentionPercentage * 100) / 100,
      context: contexts,
      sentiment
    };
  }

  private analyzeSentiment(text: string, brand: string): 'positive' | 'negative' | 'neutral' {
    const lowerText = text.toLowerCase();
    const positiveWords = ['excellent', 'best', 'great', 'good', 'effective', 'helpful', 'strong', 'leading', 'popular', 'recommended'];
    const negativeWords = ['poor', 'bad', 'weak', 'limited', 'issues', 'problems', 'concerns', 'inferior', 'lacking'];

    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  // Main analysis function
  async analyzeGenAIExposure(targetBrand: string, categories: string[] = ['general-ai']): Promise<GenAIExposureResult> {
    const prompts = this.generatePrompts(targetBrand, categories);
    const allResponses: GenAIResponse[] = [];

    // Collect responses from all prompts
    for (const prompt of prompts.slice(0, 3)) { // Limit to 3 prompts for demo
      const responses = await this.callGenAIAPIs(prompt);
      allResponses.push(...responses);
    }

    // Analyze responses by AI tool
    const aiToolResults = {
      chatgpt: this.aggregateBrandAnalysis(targetBrand, allResponses.filter(r => r.aiTool === 'chatgpt')),
      gemini: this.aggregateBrandAnalysis(targetBrand, allResponses.filter(r => r.aiTool === 'gemini')),
      claude: this.aggregateBrandAnalysis(targetBrand, allResponses.filter(r => r.aiTool === 'claude')),
      webSearch: this.aggregateBrandAnalysis(targetBrand, allResponses.filter(r => r.aiTool === 'web-search'))
    };

    // Calculate overall metrics
    const totalMentions = Object.values(aiToolResults).reduce((sum, result) => sum + result.mentionCount, 0);
    const averageMentionRate = Object.values(aiToolResults).reduce((sum, result) => sum + result.mentionPercentage, 0) / 4;
    
    // Calculate favorability (positive sentiment percentage)
    const positiveCount = Object.values(aiToolResults).filter(result => result.sentiment === 'positive').length;
    const favorabilityScore = (positiveCount / 4) * 100;

    return {
      targetBrand,
      category: categories[0],
      totalPrompts: prompts.slice(0, 3).length,
      aiToolResults,
      overallExposure: {
        averageMentionRate: Math.round(averageMentionRate * 100) / 100,
        totalMentions,
        favorabilityScore: Math.round(favorabilityScore),
        competitiveRanking: this.calculateCompetitiveRanking(targetBrand, averageMentionRate)
      },
      timestamp: new Date()
    };
  }

  private aggregateBrandAnalysis(brand: string, responses: GenAIResponse[]): BrandMentionAnalysis {
    if (responses.length === 0) {
      return {
        brand,
        mentioned: false,
        mentionCount: 0,
        mentionPercentage: 0,
        context: [],
        sentiment: 'neutral'
      };
    }

    const analyses = responses.map(response => this.analyzeBrandMentions(brand, response.response));
    
    return {
      brand,
      mentioned: analyses.some(a => a.mentioned),
      mentionCount: analyses.reduce((sum, a) => sum + a.mentionCount, 0),
      mentionPercentage: analyses.reduce((sum, a) => sum + a.mentionPercentage, 0) / analyses.length,
      context: analyses.flatMap(a => a.context),
      sentiment: this.aggregateSentiment(analyses.map(a => a.sentiment))
    };
  }

  private aggregateSentiment(sentiments: ('positive' | 'negative' | 'neutral')[]): 'positive' | 'negative' | 'neutral' {
    const counts = { positive: 0, negative: 0, neutral: 0 };
    sentiments.forEach(s => counts[s]++);
    
    const max = Math.max(counts.positive, counts.negative, counts.neutral);
    if (counts.positive === max) return 'positive';
    if (counts.negative === max) return 'negative';
    return 'neutral';
  }

  private calculateCompetitiveRanking(brand: string, mentionRate: number): number {
    // Mock competitive ranking based on mention rate
    const benchmarks = {
      'chatgpt': 45,
      'claude': 25,
      'gemini': 35,
      'bard': 30,
      'copilot': 20,
      'jasper': 15
    };

    const benchmark = benchmarks[brand.toLowerCase() as keyof typeof benchmarks] || 20;
    return Math.min(100, Math.max(0, Math.round((mentionRate / benchmark) * 100)));
  }

  // Search function for multiple brands
  async searchGenAIExposure(searchTerms: string[], categories: string[] = ['general-ai']): Promise<GenAIExposureSearch> {
    const results: GenAIExposureResult[] = [];

    for (const term of searchTerms) {
      const result = await this.analyzeGenAIExposure(term, categories);
      results.push(result);
    }

    // Calculate comparison metrics
    const averageExposureRate = results.reduce((sum, r) => sum + r.overallExposure.averageMentionRate, 0) / results.length;
    const mostMentionedBrand = results.reduce((max, r) => 
      r.overallExposure.totalMentions > max.overallExposure.totalMentions ? r : max
    ).targetBrand;

    // Find top performing AI tool
    const toolMentions = { chatgpt: 0, gemini: 0, claude: 0, webSearch: 0 };
    results.forEach(result => {
      Object.entries(result.aiToolResults).forEach(([tool, analysis]) => {
        toolMentions[tool as keyof typeof toolMentions] += analysis.mentionCount;
      });
    });
    const topPerformingTool = Object.entries(toolMentions).reduce((max, [tool, count]) => 
      count > max[1] ? [tool, count] : max
    )[0];

    return {
      searchTerm: searchTerms.join(', '),
      categories,
      results,
      comparisonMetrics: {
        topPerformingTool,
        mostMentionedBrand,
        averageExposureRate: Math.round(averageExposureRate * 100) / 100
      }
    };
  }
}

export const getGenAIExposureAPI = () => {
  return new GenAIExposureAPI();
};

export { GenAIExposureAPI };