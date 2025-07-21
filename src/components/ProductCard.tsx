'use client';

import { AgentProduct, TrafficData } from '@/types';
import { CATEGORY_COLORS } from '@/config/agent-products';
import { formatNumber, formatPercentage, calculateGrowthRate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: AgentProduct;
  currentMonthData: TrafficData | undefined;
  previousMonthData: TrafficData | undefined;
  isSelected: boolean;
  onToggleSelect: (productId: string) => void;
}

export function ProductCard({ 
  product, 
  currentMonthData, 
  previousMonthData, 
  isSelected, 
  onToggleSelect 
}: ProductCardProps) {
  const growthRate = currentMonthData && previousMonthData 
    ? calculateGrowthRate(currentMonthData.visits, previousMonthData.visits)
    : 0;

  const getTrendIcon = () => {
    if (Math.abs(growthRate) < 0.01) return <Minus className="w-4 h-4" />;
    return growthRate > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (Math.abs(growthRate) < 0.01) return 'text-gray-500';
    return growthRate > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      onClick={() => onToggleSelect(product.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: CATEGORY_COLORS[product.category] }}
            />
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </div>
          <a
            href={`https://${product.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="text-sm text-gray-600 capitalize">
          {product.category}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Monthly Visits</div>
            <div className="text-2xl font-bold">
              {currentMonthData ? formatNumber(currentMonthData.visits) : 'N/A'}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">Growth Rate</div>
            <div className={`text-lg font-semibold flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{formatPercentage(Math.abs(growthRate))}</span>
            </div>
          </div>
        </div>

        {currentMonthData && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Bounce Rate</div>
              <div className="font-medium">
                {formatPercentage(currentMonthData.bounceRate)}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">Avg Session</div>
              <div className="font-medium">
                {Math.round(currentMonthData.avgSessionDuration / 60)}m
              </div>
            </div>
          </div>
        )}

        {product.description && (
          <div className="text-sm text-gray-600 border-t pt-3">
            {product.description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}