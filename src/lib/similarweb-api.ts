import { TrafficData, SimilarWebApiResponse, AgentProduct } from '@/types';

const SIMILARWEB_API_BASE = 'https://api.similarweb.com/v1';

export class SimilarWebAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTrafficData(
    domain: string, 
    startDate: string, 
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<TrafficData[]> {
    try {
      const url = `${SIMILARWEB_API_BASE}/website/${domain}/total-traffic-and-engagement/visits`;
      const params = new URLSearchParams({
        api_key: this.apiKey,
        start_date: startDate,
        end_date: endDate,
        main_domain_only: 'false',
        granularity,
        format: 'json'
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`SimilarWeb API error: ${response.status} ${response.statusText}`);
      }

      const data: SimilarWebApiResponse = await response.json();
      
      return data.visits.map(visit => ({
        domain,
        month: visit.date,
        visits: visit.visits,
        pageViews: visit.visits * 2.5, // Estimated
        bounceRate: 0.65, // Default estimate
        avgSessionDuration: 180, // Default estimate in seconds
        source: 'similarweb' as const,
        lastUpdated: new Date()
      }));
    } catch (error) {
      console.error(`Failed to fetch traffic data for ${domain}:`, error);
      throw error;
    }
  }

  async getBatchTrafficData(
    products: AgentProduct[],
    startDate: string,
    endDate: string
  ): Promise<Map<string, TrafficData[]>> {
    const results = new Map<string, TrafficData[]>();
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const product of products) {
      try {
        const trafficData = await this.getTrafficData(
          product.domain,
          startDate,
          endDate
        );
        results.set(product.id, trafficData);
        
        // Rate limiting: 10 requests per second max
        await delay(100);
      } catch (error) {
        console.error(`Failed to get traffic data for ${product.name}:`, error);
        results.set(product.id, []);
      }
    }

    return results;
  }
}

// Mock data generator for development/testing
export function generateMockTrafficData(
  products: AgentProduct[],
  months: string[]
): Map<string, TrafficData[]> {
  const mockData = new Map<string, TrafficData[]>();

  products.forEach(product => {
    const baseVisits = Math.floor(Math.random() * 50000000) + 10000000; // 10M-60M visits
    
    const trafficData = months.map((month, index) => {
      const variation = 0.8 + (Math.random() * 0.4); // ±20% variation
      const growthFactor = 1 + (index * 0.05) + (Math.random() * 0.1 - 0.05); // Growing trend with noise
      
      return {
        domain: product.domain,
        month,
        visits: Math.floor(baseVisits * variation * growthFactor),
        pageViews: Math.floor(baseVisits * variation * growthFactor * (2 + Math.random())),
        bounceRate: 0.4 + Math.random() * 0.4, // 40-80%
        avgSessionDuration: 120 + Math.random() * 240, // 2-6 minutes
        source: 'manual' as const,
        lastUpdated: new Date()
      };
    });

    mockData.set(product.id, trafficData);
  });

  return mockData;
}

// Environment configuration
export const getSimilarWebAPI = (): SimilarWebAPI | null => {
  const apiKey = process.env.NEXT_PUBLIC_SIMILARWEB_API_KEY || process.env.SIMILARWEB_API_KEY;
  
  if (!apiKey) {
    console.warn('SimilarWeb API key not found. Using mock data.');
    return null;
  }

  return new SimilarWebAPI(apiKey);
};