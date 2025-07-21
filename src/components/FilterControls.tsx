'use client';

import { DashboardFilters, AgentProduct } from '@/types';
import { CATEGORY_COLORS } from '@/config/agent-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface FilterControlsProps {
  filters: DashboardFilters;
  products: AgentProduct[];
  onFiltersChange: (filters: DashboardFilters) => void;
}

export function FilterControls({ filters, products, onFiltersChange }: FilterControlsProps) {
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleSortChange = (sortBy: DashboardFilters['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc'
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      categories: [],
      selectedProducts: []
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.selectedProducts.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.categories.includes(category)
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: filters.categories.includes(category) 
                    ? CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
                    : undefined
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
          <div className="space-y-2">
            {[
              { key: 'visits' as const, label: 'Monthly Visits' },
              { key: 'growth' as const, label: 'Growth Rate' },
              { key: 'name' as const, label: 'Name' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.sortBy === key
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {filters.sortBy === key && (
                    <span className="text-xs text-blue-600">
                      {filters.sortOrder === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Selected Products ({filters.selectedProducts.length})
          </h4>
          {filters.selectedProducts.length > 0 ? (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filters.selectedProducts.map(productId => {
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                
                return (
                  <div
                    key={productId}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: CATEGORY_COLORS[product.category] }}
                      />
                      <span>{product.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        onFiltersChange({
                          ...filters,
                          selectedProducts: filters.selectedProducts.filter(id => id !== productId)
                        });
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Click on product cards to select them for comparison
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}