'use client';

import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { BrandMentions } from './BrandMentions';
import { GenAIExposure } from './GenAIExposure';
import { TabNavigation } from './TabNavigation';

type TabType = 'dashboard' | 'mentions' | 'genai-exposure';

export function MainDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Analytics Hub
          </h1>
          <p className="text-gray-600">
            Comprehensive analytics for AI products and brand mentions
          </p>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="tab-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'mentions' && <BrandMentions />}
          {activeTab === 'genai-exposure' && <GenAIExposure />}
        </div>
      </div>
    </div>
  );
}