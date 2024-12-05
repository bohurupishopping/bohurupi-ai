'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { LoadingSpinner } from '@/app/global/ui/LoadingSpinner';

interface PredictiveInsight {
  type: 'trend' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
}

export default function AITools() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<'analysis' | 'insights' | 'automation'>('analysis');

  const handleGenerateInsights = async () => {
    if (!user || user.role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual API call to AI service
      const mockInsights: PredictiveInsight[] = [
        {
          type: 'trend',
          title: 'Order Volume Trend',
          description: 'Order volume is expected to increase by 25% next week based on historical patterns.',
          confidence: 0.85,
          timestamp: new Date().toISOString(),
        },
        {
          type: 'anomaly',
          title: 'Unusual Activity Detected',
          description: 'Significant increase in order cancellations in the past 24 hours.',
          confidence: 0.92,
          timestamp: new Date().toISOString(),
        },
        {
          type: 'recommendation',
          title: 'Resource Optimization',
          description: 'Consider increasing staff during peak hours (2 PM - 5 PM) to handle higher order volume.',
          confidence: 0.78,
          timestamp: new Date().toISOString(),
        },
      ];

      setInsights(mockInsights);
    } catch (err) {
      console.error('Error generating insights:', err);
      setError('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Tools</h1>
      </div>

      {/* Feature Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedFeature('analysis')}
            className={`px-4 py-2 rounded-md ${
              selectedFeature === 'analysis'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Predictive Analysis
          </button>
          <button
            onClick={() => setSelectedFeature('insights')}
            className={`px-4 py-2 rounded-md ${
              selectedFeature === 'insights'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Business Insights
          </button>
          <button
            onClick={() => setSelectedFeature('automation')}
            className={`px-4 py-2 rounded-md ${
              selectedFeature === 'automation'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Task Automation
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {selectedFeature === 'analysis' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Predictive Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Generate AI-powered predictions and insights about your business operations.
            </p>
            <button
              onClick={handleGenerateInsights}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Insights'}
            </button>

            {loading && <LoadingSpinner />}

            {insights.length > 0 && (
              <div className="mt-8 space-y-6">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {insight.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Confidence: {(insight.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{insight.description}</p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Generated at: {new Date(insight.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedFeature === 'insights' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Business Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Coming soon: Advanced business analytics and insights powered by AI.
            </p>
          </div>
        )}

        {selectedFeature === 'automation' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Task Automation
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Coming soon: Automate repetitive tasks and workflows using AI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 