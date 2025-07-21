'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrafficData, AgentProduct } from '@/types';
import { CATEGORY_COLORS } from '@/config/agent-products';
import { formatNumber, formatMonthLabel } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrafficChartProps {
  data: Map<string, TrafficData[]>;
  products: AgentProduct[];
  selectedProducts: string[];
}

export function TrafficChart({ data, products, selectedProducts }: TrafficChartProps) {
  const chartData = React.useMemo(() => {
    if (data.size === 0) return [];

    const months = new Set<string>();
    data.forEach(trafficArray => {
      trafficArray.forEach(traffic => months.add(traffic.month));
    });

    const sortedMonths = Array.from(months).sort();

    return sortedMonths.map(month => {
      const monthData: Record<string, string | number> = {
        month: formatMonthLabel(month),
        rawMonth: month
      };

      selectedProducts.forEach(productId => {
        const product = products.find(p => p.id === productId);
        const productTraffic = data.get(productId) || [];
        const monthTraffic = productTraffic.find(t => t.month === month);
        
        if (product && monthTraffic) {
          monthData[product.name] = monthTraffic.visits;
        }
      });

      return monthData;
    });
  }, [data, products, selectedProducts]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Traffic Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickFormatter={formatNumber}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatNumber(value), 'Visits']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              {selectedProducts.map(productId => {
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                
                return (
                  <Line
                    key={productId}
                    type="monotone"
                    dataKey={product.name}
                    stroke={CATEGORY_COLORS[product.category]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}