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
}