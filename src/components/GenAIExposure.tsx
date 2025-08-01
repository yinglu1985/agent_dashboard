'use client';

import React, { useState } from 'react';
import { GenAIExposureSearch, GenAIExposureResult } from '@/types';
import { getGenAIExposureAPI } from '@/lib/genai-exposure-api';
import { Search, Zap, TrendingUp, TrendingDown, Brain, Target, BarChart3, Award, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';

export function GenAIExposure() {
  const [searchTerms, setSearchTerms] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['general-ai']);
  const [exposureResults, setExposureResults] = useState<GenAIExposureSearch | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const categories = [
    { id: 'general-ai', name: 'General AI', description: 'General AI assistant queries' },
    { id: 'coding', name: 'Coding', description: 'Programming and development' },
    { id: 'writing', name: 'Writing', description: 'Content creation and editing' },
    { id: 'research', name: 'Research', description: 'Information gathering and analysis' },
    { id: 'business', name: 'Business', description: 'Business operations and strategy' }
  ];

  const popularBrands = ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Jasper', 'Perplexity'];
  
  const aiToolColors = {
    chatgpt: '#10B981',
    gemini: '#3B82F6', 
    claude: '#8B5CF6',
    webSearch: '#F59E0B'
  };

  const handleSearch = async () => {
    if (!searchTerms.trim()) return;

    setLoading(true);
    try {
      const api = getGenAIExposureAPI();
      const brands = searchTerms.split(',').map(term => term.trim()).filter(term => term);
      const results = await api.searchGenAIExposure(brands, selectedCategories);
      setExposureResults(results);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error analyzing GenAI exposure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">GenAI Brand Exposure Analysis</h2>
        <p className="text-gray-600 mb-6">
          Analyze how often brands are mentioned by different AI tools (ChatGPT, Gemini, Claude) and web search results
        </p>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
                placeholder="Enter brand names separated by commas (e.g., ChatGPT, Claude, Gemini)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchTerms.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {/* Category Selection */}
          <div>
            <p className="text-sm text-gray-700 mb-2">Test Categories:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={category.description}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Brands */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Popular brands:</p>
            <div className="flex flex-wrap gap-2">
              {popularBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSearchTerms(prev => prev ? `${prev}, ${brand}` : brand)}
                  className="px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Analyzing brand exposure across GenAI tools...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds per brand</p>
        </div>
      )}

      {/* Results Section */}
      {exposureResults && !loading && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Brands Analyzed</p>
                  <p className="text-2xl font-bold text-gray-900">{exposureResults.results.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Exposure Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{exposureResults.comparisonMetrics.averageExposureRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Top AI Tool</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{exposureResults.comparisonMetrics.topPerformingTool}</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Brand Results */}
          {exposureResults.results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{result.targetBrand}</h3>
                  <p className="text-gray-600">Category: {result.category} • {result.totalPrompts} prompts tested</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{result.overallExposure.averageMentionRate}%</p>
                  <p className="text-sm text-gray-500">Avg Mention Rate</p>
                </div>
              </div>

              {/* AI Tool Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">AI Tool Performance</h4>
                  <div className="space-y-3">
                    {Object.entries(result.aiToolResults).map(([tool, analysis]) => (
                      <div key={tool} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: aiToolColors[tool as keyof typeof aiToolColors] }}
                          ></div>
                          <span className="font-medium capitalize">
                            {tool === 'webSearch' ? 'Web Search' : tool}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {analysis.sentiment}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{analysis.mentionPercentage}%</div>
                          <div className="text-sm text-gray-500">{analysis.mentionCount} mentions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Mention Rate Comparison</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={Object.entries(result.aiToolResults).map(([tool, analysis]) => ({
                      name: tool === 'webSearch' ? 'Web Search' : tool.charAt(0).toUpperCase() + tool.slice(1),
                      percentage: analysis.mentionPercentage,
                      mentions: analysis.mentionCount
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Mention Rate']} />
                      <Bar dataKey="percentage" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Overall Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.overallExposure.totalMentions}</div>
                  <div className="text-sm text-gray-500">Total Mentions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.overallExposure.favorabilityScore}%</div>
                  <div className="text-sm text-gray-500">Favorability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.overallExposure.competitiveRanking}</div>
                  <div className="text-sm text-gray-500">Competitive Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.totalPrompts}</div>
                  <div className="text-sm text-gray-500">Prompts Tested</div>
                </div>
              </div>

              {/* Context Examples */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Mention Examples</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.aiToolResults).map(([tool, analysis]) => (
                    analysis.context.length > 0 && (
                      <div key={tool} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: aiToolColors[tool as keyof typeof aiToolColors] }}
                          ></div>
                          <span className="text-sm font-medium capitalize">
                            {tool === 'webSearch' ? 'Web Search' : tool}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          &quot;{analysis.context[0]}&quot;
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Comparison Chart */}
          {exposureResults.results.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Brand Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={exposureResults.results.map(result => ({
                  brand: result.targetBrand,
                  chatgpt: result.aiToolResults.chatgpt.mentionPercentage,
                  gemini: result.aiToolResults.gemini.mentionPercentage,
                  claude: result.aiToolResults.claude.mentionPercentage,
                  webSearch: result.aiToolResults.webSearch.mentionPercentage
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Mention Rate']} />
                  <Bar dataKey="chatgpt" fill="#10B981" name="ChatGPT" />
                  <Bar dataKey="gemini" fill="#3B82F6" name="Gemini" />
                  <Bar dataKey="claude" fill="#8B5CF6" name="Claude" />
                  <Bar dataKey="webSearch" fill="#F59E0B" name="Web Search" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {lastUpdated && (
            <p className="text-sm text-gray-500 text-center">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How GenAI Exposure Analysis Works:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li><strong>Step 1:</strong> Generate category-specific prompts for each brand</li>
              <li><strong>Step 2:</strong> Query ChatGPT, Gemini, Claude APIs and web search</li>
              <li><strong>Step 3:</strong> Analyze responses for brand mentions and sentiment</li>
              <li><strong>Step 4:</strong> Calculate exposure rates and competitive rankings</li>
            </ul>
            <p className="mt-2 text-xs">
              * API keys required for real data. Currently using mock responses for demonstration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}