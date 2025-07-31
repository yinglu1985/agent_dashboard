'use client';

import React, { useState } from 'react';
import { BrandMentionSummary } from '@/types';
import { getXMentionsAPI } from '@/lib/x-mentions-api';
import { Search, TrendingUp, TrendingDown, Hash, MessageCircle, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function BrandMentions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mentionData, setMentionData] = useState<BrandMentionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (brand: string) => {
    if (!brand.trim()) return;

    setLoading(true);
    try {
      const api = getXMentionsAPI();
      const data = await api.searchBrandMentions(brand.trim(), 7);
      setMentionData(data);
      setLastUpdated(new Date());
      
      // Add to search history
      setSearchHistory(prev => {
        const updated = [brand.trim(), ...prev.filter(item => item !== brand.trim())];
        return updated.slice(0, 5); // Keep only last 5 searches
      });
    } catch (error) {
      console.error('Error searching brand mentions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const popularBrands = ['ChatGPT', 'Claude', 'Google', 'OpenAI', 'Tesla', 'Apple', 'Microsoft', 'Netflix'];

  const sentimentColors = {
    positive: '#10B981',
    neutral: '#6B7280',
    negative: '#EF4444'
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">X Brand Mentions</h2>
        <p className="text-gray-600 mb-6">Search for any brand to see mention statistics from X (Twitter) over the past 7 days</p>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter brand name (e.g., ChatGPT, Tesla, Apple)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Popular Brands */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularBrands.map(brand => (
              <button
                key={brand}
                onClick={() => {
                  setSearchTerm(brand);
                  handleSearch(brand);
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map(brand => (
                <button
                  key={brand}
                  onClick={() => {
                    setSearchTerm(brand);
                    handleSearch(brand);
                  }}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Analyzing mentions for &quot;{searchTerm}&quot;...</p>
        </div>
      )}

      {mentionData && !loading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Mentions</p>
                  <p className="text-2xl font-bold text-gray-900">{mentionData.totalMentions.toLocaleString()}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Daily Average</p>
                  <p className="text-2xl font-bold text-gray-900">{mentionData.averageDaily.toLocaleString()}</p>
                </div>
                <Database className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">7-Day Growth</p>
                  <p className={`text-2xl font-bold ${mentionData.growthRate && mentionData.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mentionData.growthRate}%
                  </p>
                </div>
                {mentionData.growthRate && mentionData.growthRate >= 0 ? 
                  <TrendingUp className="w-8 h-8 text-green-600" /> : 
                  <TrendingDown className="w-8 h-8 text-red-600" />
                }
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Data Source</p>
                  <p className="text-sm font-medium text-gray-900">
                    {mentionData.dailyMentions[0]?.source === 'x-api' ? 'X API' : 'Mock Data'}
                  </p>
                </div>
                <Hash className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Mentions Trend */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Mentions Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mentionData.dailyMentions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [value.toLocaleString(), 'Mentions']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mentions" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
              {mentionData.sentimentBreakdown && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Positive', value: mentionData.sentimentBreakdown.positive, color: sentimentColors.positive },
                        { name: 'Neutral', value: mentionData.sentimentBreakdown.neutral, color: sentimentColors.neutral },
                        { name: 'Negative', value: mentionData.sentimentBreakdown.negative, color: sentimentColors.negative }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Positive', value: mentionData.sentimentBreakdown.positive, color: sentimentColors.positive },
                        { name: 'Neutral', value: mentionData.sentimentBreakdown.neutral, color: sentimentColors.neutral },
                        { name: 'Negative', value: mentionData.sentimentBreakdown.negative, color: sentimentColors.negative }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Positive ({mentionData.sentimentBreakdown?.positive}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Neutral ({mentionData.sentimentBreakdown?.neutral}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Negative ({mentionData.sentimentBreakdown?.negative}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Hashtags */}
          {mentionData.topHashtags && mentionData.topHashtags.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {mentionData.topHashtags.map(hashtag => (
                  <span 
                    key={hashtag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lastUpdated && (
            <p className="text-sm text-gray-500 text-center">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}