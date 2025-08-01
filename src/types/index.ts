export interface AgentProduct {
  id: string;
  name: string;
  domain: string;
  category: 'chatbot' | 'writing' | 'coding' | 'productivity' | 'other';
  description?: string;
}

export interface TrafficData {
  domain: string;
  month: string; // YYYY-MM format
  visits: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  source: 'similarweb' | 'manual' | 'other';
  lastUpdated: Date;
}

export interface MonthlyTrafficSummary {
  month: string;
  totalVisits: number;
  agentProducts: Array<{
    product: AgentProduct;
    traffic: TrafficData;
    growthRate?: number; // month-over-month growth
  }>;
}

export interface DashboardFilters {
  dateRange: {
    startMonth: string;
    endMonth: string;
  };
  selectedProducts: string[];
  categories: string[];
  sortBy: 'visits' | 'growth' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface SimilarWebApiResponse {
  meta: {
    request: {
      domain: string;
      start_date: string;
      end_date: string;
      main_domain_only: boolean;
      granularity: string;
    };
  };
  visits: Array<{
    date: string;
    visits: number;
  }>;
}

export interface XMentionData {
  brand: string;
  date: string; // YYYY-MM-DD format
  mentions: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  engagement?: number;
  exposure?: number; // Total potential reach/impressions
  avgFollowers?: number; // Average followers per mentioning user
  source: 'x-api' | 'mock';
  lastUpdated: Date;
}

export interface BrandMentionSummary {
  brand: string;
  totalMentions: number;
  dailyMentions: XMentionData[];
  averageDaily: number;
  growthRate?: number; // 7-day growth
  topHashtags?: string[];
  sentimentBreakdown?: {
    positive: number;
    negative: number;
    neutral: number;
  };
  exposureMetrics?: {
    totalExposure: number;
    averageDailyExposure: number;
    exposureGrowthRate: number;
    avgFollowersPerMention: number;
    reachMultiplier: number; // exposure/mentions ratio
  };
}

export interface GenAIPrompt {
  id: string;
  category: string;
  prompt: string;
  targetBrand: string;
  context: string;
}

export interface GenAIResponse {
  promptId: string;
  aiTool: 'chatgpt' | 'gemini' | 'claude' | 'web-search';
  response: string;
  responseTime: number;
  error?: string;
  timestamp: Date;
}

export interface BrandMentionAnalysis {
  brand: string;
  mentioned: boolean;
  mentionCount: number;
  mentionPercentage: number;
  context: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface GenAIExposureResult {
  targetBrand: string;
  category: string;
  totalPrompts: number;
  aiToolResults: {
    chatgpt: BrandMentionAnalysis;
    gemini: BrandMentionAnalysis;
    claude: BrandMentionAnalysis;
    webSearch: BrandMentionAnalysis;
  };
  overallExposure: {
    averageMentionRate: number;
    totalMentions: number;
    favorabilityScore: number;
    competitiveRanking: number;
  };
  timestamp: Date;
}

export interface GenAIExposureSearch {
  searchTerm: string;
  categories: string[];
  results: GenAIExposureResult[];
  comparisonMetrics: {
    topPerformingTool: string;
    mostMentionedBrand: string;
    averageExposureRate: number;
  };
}