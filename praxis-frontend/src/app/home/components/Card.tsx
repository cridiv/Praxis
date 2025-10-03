'use client';

import React from 'react';
import { Database, GitBranch, Zap } from 'lucide-react';

export default function DataVisualizationCard() {
  return (
    <div className="relative">
      <div className="relative z-10">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 transform hover:scale-105 transition-transform duration-500">
          <div className="space-y-6">
            {/* Dataset Stack */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="w-7 h-7 text-white" />
              </div>
              <div className="w-full text-center">
                <div className="h-3 bg-gray-200 rounded mx-auto w-3/4 mb-2" />
                <div className="h-2 bg-gray-100 rounded mx-auto w-1/2" />
              </div>
            </div>

            {/* Data Rows */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  <div className="flex-1 h-2 bg-gray-200 rounded max-w-xs" />
                  <div className="w-16 h-2 bg-green-200 rounded" />
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-xs text-gray-500">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2.3s</div>
                <div className="text-xs text-gray-500">Speed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">AI</div>
                <div className="text-xs text-gray-500">Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-xl flex items-center justify-center animate-float">
          <GitBranch className="w-12 h-12 text-white" />
        </div>

        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-xl flex items-center justify-center animate-float-delayed">
          <Zap className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-orange-200/30 blur-3xl rounded-full transform scale-150 -z-10" />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        
        * {
          font-family: 'Roboto', sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}