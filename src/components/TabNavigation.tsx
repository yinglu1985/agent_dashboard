'use client';

import React from 'react';
import { BarChart3, MessageSquare } from 'lucide-react';

type TabType = 'dashboard' | 'mentions';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: 'Traffic Analytics',
      icon: BarChart3,
      description: 'AI agent website traffic data'
    },
    {
      id: 'mentions' as TabType,
      name: 'X Mentions',
      icon: MessageSquare,
      description: 'Brand mentions on X (Twitter)'
    }
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon 
                className={`
                  -ml-0.5 mr-2 h-5 w-5 transition-colors
                  ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              <div className="text-left">
                <div className="font-medium">{tab.name}</div>
                <div className="text-xs text-gray-400">{tab.description}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}