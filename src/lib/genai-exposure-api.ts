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

  // Step 1: Generate dynamic prompts based on search query
  generatePrompts(targetBrand: string, categories: string[]): GenAIPrompt[] {
    const prompts: GenAIPrompt[] = [];
    
    // Detect brand type and industry
    const brandContext = this.analyzeBrandContext(targetBrand);
    
    categories.forEach(category => {
      const dynamicPrompts = this.generateDynamicPrompts(targetBrand, category, brandContext);
      dynamicPrompts.forEach((prompt, index) => {
        prompts.push({
          id: `${category}-${index}`,
          category,
          prompt,
          targetBrand,
          context: `Dynamic prompt for ${targetBrand} in ${category} context`
        });
      });
    });

    return prompts;
  }

  private analyzeBrandContext(brand: string): {
    type: string;
    industry: string;
    competitors: string[];
    useCase: string;
  } {
    const lowerBrand = brand.toLowerCase();
    
    // AI/Tech brands
    if (['chatgpt', 'claude', 'gemini', 'bard', 'copilot', 'jasper', 'perplexity'].includes(lowerBrand)) {
      return {
        type: 'ai-tool',
        industry: 'artificial-intelligence',
        competitors: ['ChatGPT', 'Claude', 'Gemini', 'Copilot'],
        useCase: 'conversational AI and productivity'
      };
    }
    
    // Tech companies
    if (['google', 'microsoft', 'openai', 'anthropic', 'meta', 'apple'].includes(lowerBrand)) {
      return {
        type: 'tech-company',
        industry: 'technology',
        competitors: ['Google', 'Microsoft', 'Apple', 'Meta'],
        useCase: 'technology solutions and platforms'
      };
    }
    
    // Other major brands
    if (['tesla', 'netflix', 'amazon', 'spotify'].includes(lowerBrand)) {
      return {
        type: 'consumer-brand',
        industry: 'consumer-technology',
        competitors: ['Tesla', 'Netflix', 'Amazon', 'Spotify'],
        useCase: 'consumer products and services'
      };
    }
    
    // Default context
    return {
      type: 'general-brand',
      industry: 'technology',
      competitors: [brand],
      useCase: 'general business solutions'
    };
  }

  private generateDynamicPrompts(brand: string, category: string, context: { competitors: string[] }): string[] {
    const brandName = brand;
    const competitors = context.competitors.filter((c: string) => c.toLowerCase() !== brand.toLowerCase()).slice(0, 3);
    
    const promptGenerators = {
      'general-ai': () => [
        `What do you think about ${brandName} compared to other AI tools available today?`,
        `If someone asked you to recommend an AI assistant, would you suggest ${brandName}? Why or why not?`,
        `How does ${brandName} compare to ${competitors.join(', ')} in terms of overall performance?`,
        `What are the strengths and weaknesses of ${brandName} as an AI tool?`,
        `For general users, is ${brandName} a good choice for everyday AI assistance?`
      ],
      
      'coding': () => [
        `How effective is ${brandName} for programming and software development tasks?`,
        `Would you recommend ${brandName} to developers over ${competitors.join(' or ')}?`,
        `What coding capabilities does ${brandName} offer compared to other AI coding tools?`,
        `For learning programming, how does ${brandName} compare to alternatives like ${competitors.join(', ')}?`,
        `What are the advantages of using ${brandName} for code generation and debugging?`
      ],
      
      'writing': () => [
        `How good is ${brandName} for content creation and writing assistance?`,
        `Compared to ${competitors.join(', ')}, how does ${brandName} perform for writing tasks?`,
        `Would you choose ${brandName} for professional writing and content creation?`,
        `What makes ${brandName} unique for writing compared to other AI writing tools?`,
        `For copywriting and marketing content, is ${brandName} effective?`
      ],
      
      'research': () => [
        `How reliable is ${brandName} for research and information gathering?`,
        `For academic research, would you trust ${brandName} over ${competitors.join(' or ')}?`,
        `What research capabilities does ${brandName} offer that set it apart?`,
        `How does ${brandName} handle fact-checking compared to ${competitors.join(', ')}?`,
        `Is ${brandName} suitable for professional research and analysis work?`
      ],
      
      'business': () => [
        `How valuable is ${brandName} for business operations and decision-making?`,
        `Would you implement ${brandName} in a business environment over ${competitors.join(' or ')}?`,
        `What business advantages does ${brandName} provide compared to alternatives?`,
        `For enterprise use, how does ${brandName} compare to ${competitors.join(', ')}?`,
        `What ROI can businesses expect from implementing ${brandName}?`
      ]
    };

    const generator = promptGenerators[category as keyof typeof promptGenerators] || promptGenerators['general-ai'];
    return generator();
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
    // Extract brand name from prompt
    const brandMatch = prompt.match(/\b(ChatGPT|Claude|Gemini|Bard|Copilot|Tesla|Netflix|Google|Apple|Microsoft|OpenAI|Anthropic|Meta|Amazon|Spotify|Jasper|Perplexity|[A-Z][a-zA-Z]+)\b/g);
    const targetBrand = brandMatch ? brandMatch[0] : 'Unknown';
    
    // Generate contextual response based on AI tool and target brand
    return this.generateContextualResponse(aiTool, targetBrand, prompt);
  }

  private generateContextualResponse(aiTool: string, targetBrand: string, prompt: string): string {
    const responses = this.getBrandSpecificResponses(targetBrand, prompt);
    
    // Add AI tool specific perspective
    const toolPerspectives = {
      'chatgpt': (response: string) => {
        if (targetBrand.toLowerCase() === 'chatgpt') {
          return response.replace('this tool', 'ChatGPT').replace('it', 'ChatGPT') + ' As ChatGPT, I aim to be helpful and accurate in my responses.';
        }
        return response;
      },
      'gemini': (response: string) => {
        if (targetBrand.toLowerCase() === 'gemini') {
          return response.replace('this tool', 'Gemini').replace('it', 'Gemini') + ' As Gemini, I provide access to real-time information and multimodal capabilities.';
        }
        return response;
      },
      'claude': (response: string) => {
        if (targetBrand.toLowerCase() === 'claude') {
          return response.replace('this tool', 'Claude').replace('it', 'Claude') + ' As Claude, I focus on being helpful, harmless, and honest.';
        }
        return response;
      },
      'web-search': (response: string) => {
        return `According to recent search results and online discussions, ${response}`;
      }
    };

    const basedResponse = responses.base;
    const toolProcessor = toolPerspectives[aiTool as keyof typeof toolPerspectives];
    return toolProcessor ? toolProcessor(basedResponse) : basedResponse;
  }

  private getBrandSpecificResponses(brand: string, prompt: string): { base: string; sentiment: string } {
    const lowerBrand = brand.toLowerCase();
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine prompt intent
    const isComparison = lowerPrompt.includes('compare') || lowerPrompt.includes('versus') || lowerPrompt.includes('vs');
    const isRecommendation = lowerPrompt.includes('recommend') || lowerPrompt.includes('suggest') || lowerPrompt.includes('choose');
    const isEvaluation = lowerPrompt.includes('good') || lowerPrompt.includes('effective') || lowerPrompt.includes('best');

    // Brand-specific response templates
    const brandResponses: { [key: string]: { positive: string; neutral: string; comparison: string } } = {
      'chatgpt': {
        positive: `${brand} is widely regarded as one of the leading AI assistants with strong conversational abilities and broad knowledge. It excels at creative tasks, problem-solving, and maintaining engaging dialogue. Many users appreciate its versatility and natural language understanding.`,
        neutral: `${brand} is a popular AI assistant with various capabilities. It has both strengths and limitations, like any AI tool. Users report mixed experiences depending on their specific use cases and expectations.`,
        comparison: `${brand} stands out for its conversational depth and creative capabilities. Compared to alternatives like Claude and Gemini, it offers strong general-purpose assistance with particular strengths in creative writing and brainstorming.`
      },
      'claude': {
        positive: `${brand} is known for its thoughtful, well-reasoned responses and strong focus on safety and helpfulness. It excels at nuanced analysis, maintaining consistent quality, and providing balanced perspectives on complex topics.`,
        neutral: `${brand} is an AI assistant that emphasizes safety and thoughtful responses. It has particular strengths in certain areas while being more conservative in others.`,
        comparison: `${brand} differentiates itself through its focus on helpful, harmless, and honest responses. Compared to ChatGPT and Gemini, it often provides more nuanced analysis and maintains consistent quality across interactions.`
      },
      'gemini': {
        positive: `${brand} offers strong multimodal capabilities and real-time web access, making it valuable for current information and diverse content types. It integrates well with Google's ecosystem and provides up-to-date responses.`,
        neutral: `${brand} is Google's AI assistant with web connectivity and multimodal features. It has specific strengths particularly around current information access.`,
        comparison: `${brand} stands out for its real-time web access and integration with Google services. Compared to ChatGPT and Claude, it excels at providing current information and handling diverse media types.`
      },
      'tesla': {
        positive: `${brand} is widely recognized as a pioneer in electric vehicles and autonomous driving technology. The company has revolutionized the automotive industry and maintains strong brand loyalty among customers.`,
        neutral: `${brand} is a major player in the electric vehicle market with both notable achievements and ongoing challenges in various areas.`,
        comparison: `${brand} leads in EV innovation and autonomous driving technology. Compared to traditional automakers, it has successfully positioned itself as a technology-forward brand.`
      }
    };

    // Default response for unknown brands
    const defaultResponse = {
      positive: `${brand} is a notable player in its field with various strengths and capabilities that serve different user needs and use cases.`,
      neutral: `${brand} is a brand/tool that has both strengths and limitations, with user experiences varying based on specific needs and expectations.`,
      comparison: `${brand} has its unique position in the market with specific strengths that differentiate it from competitors in various ways.`
    };

    const brandData = brandResponses[lowerBrand] || defaultResponse;

    // Choose response type based on prompt characteristics
    let responseType = 'neutral';
    if (isRecommendation || isEvaluation) {
      // Simulate realistic mention rates - some brands get more positive coverage
      const positiveBrands = ['chatgpt', 'claude', 'tesla', 'apple'];
      responseType = positiveBrands.includes(lowerBrand) ? 'positive' : 'neutral';
    } else if (isComparison) {
      responseType = 'comparison';
    }

    const responseText = responseType === 'positive' ? brandData.positive :
                         responseType === 'comparison' ? brandData.comparison :
                         brandData.neutral;

    return {
      base: responseText,
      sentiment: responseType === 'positive' ? 'positive' : responseType === 'comparison' ? 'neutral' : 'neutral'
    };
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