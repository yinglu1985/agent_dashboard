'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TrafficData, DashboardFilters } from '@/types';
import { AGENT_PRODUCTS } from '@/config/agent-products';
import { generateMockTrafficData, getSimilarWebAPI } from '@/lib/similarweb-api';
import { generateMonthRange, calculateGrowthRate } from '@/lib/utils';
import { TrafficChart } from './TrafficChart';
import { ProductCard } from './ProductCard';
import { FilterControls } from './FilterControls';
import { RefreshCw, Database } from 'lucide-react';

export function Dashboard() {
  const [trafficData, setTrafficData] = useState<Map<string, TrafficData[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<'similarweb' | 'mock'>('mock');
  
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      startMonth: generateMonthRange(12)[0],
      endMonth: generateMonthRange(12)[11]
    },
    selectedProducts: ['chatgpt', 'claude', 'bard'],
    categories: [],
    sortBy: 'visits',
    sortOrder: 'desc'
  });

  const currentMonth = generateMonthRange(1)[0];
  const previousMonth = generateMonthRange(2)[0];

  const loadTrafficData = useCallback(async () => {
    setLoading(true);
    try {
      const api = getSimilarWebAPI();
      const months = generateMonthRange(12);
      
      if (api) {
        setDataSource('similarweb');
        const data = await api.getBatchTrafficData(
          AGENT_PRODUCTS,
          filters.dateRange.startMonth,
          filters.dateRange.endMonth
        );
        setTrafficData(data);
      } else {
        setDataSource('mock');
        const mockData = generateMockTrafficData(AGENT_PRODUCTS, months);
        setTrafficData(mockData);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load traffic data:', error);
      const mockData = generateMockTrafficData(AGENT_PRODUCTS, generateMonthRange(12));
      setTrafficData(mockData);
      setDataSource('mock');
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [filters.dateRange.startMonth, filters.dateRange.endMonth]);

  useEffect(() => {
    loadTrafficData();
  }, [loadTrafficData]);

  const filteredProducts = useMemo(() => {
    let filtered = AGENT_PRODUCTS;

    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    filtered.sort((a, b) => {
      const aData = trafficData.get(a.id)?.find(d => d.month === currentMonth);
      const bData = trafficData.get(b.id)?.find(d => d.month === currentMonth);
      const aPrevData = trafficData.get(a.id)?.find(d => d.month === previousMonth);
      const bPrevData = trafficData.get(b.id)?.find(d => d.month === previousMonth);

      let comparison = 0;

      switch (filters.sortBy) {
        case 'visits':
          comparison = (aData?.visits || 0) - (bData?.visits || 0);
          break;
        case 'growth':
          const aGrowth = aData && aPrevData ? calculateGrowthRate(aData.visits, aPrevData.visits) : 0;
          const bGrowth = bData && bPrevData ? calculateGrowthRate(bData.visits, bPrevData.visits) : 0;
          comparison = aGrowth - bGrowth;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [trafficData, filters, currentMonth, previousMonth]);

  const handleProductToggle = (productId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading traffic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Agent Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Monthly traffic analytics for AI agent products
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Database className="w-4 h-4" />
                <span>{dataSource === 'similarweb' ? 'SimilarWeb API' : 'Mock Data'}</span>
              </div>
              
              <button
                onClick={loadTrafficData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterControls
              filters={filters}
              products={AGENT_PRODUCTS}
              onFiltersChange={setFilters}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {filters.selectedProducts.length > 0 && (
              <TrafficChart
                data={trafficData}
                products={AGENT_PRODUCTS}
                selectedProducts={filters.selectedProducts}
              />
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Agent Products ({filteredProducts.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                  const currentData = trafficData.get(product.id)?.find(d => d.month === currentMonth);
                  const previousData = trafficData.get(product.id)?.find(d => d.month === previousMonth);
                  
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currentMonthData={currentData}
                      previousMonthData={previousData}
                      isSelected={filters.selectedProducts.includes(product.id)}
                      onToggleSelect={handleProductToggle}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}