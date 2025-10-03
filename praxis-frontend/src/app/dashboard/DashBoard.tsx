'use client';

import React, { useState } from 'react';
import { Upload, LayoutDashboard, FileUp, FileBarChart2, Settings, Search, Bell, User, X, CheckCircle2, Clock, AlertCircle, Menu } from 'lucide-react';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Uploads', icon: FileUp },
    { name: 'Reports', icon: FileBarChart2 },
    { name: 'Settings', icon: Settings },
  ];

  const recentUploads = [
    { id: 1, filename: 'dataset_2025_Q1.zip', size: '2.4 MB', status: 'completed' as UploadStatus, score: 98 },
    { id: 2, filename: 'training_data.zip', size: '5.1 MB', status: 'completed' as UploadStatus, score: 95 },
    { id: 3, filename: 'validation_set.zip', size: '1.8 MB', status: 'processing' as UploadStatus, score: null },
    { id: 4, filename: 'test_batch_01.zip', size: '3.2 MB', status: 'completed' as UploadStatus, score: 92 },
  ];

  const stats = [
    { label: 'Datasets Processed', value: '247' },
    { label: 'Average Score', value: '94.5%' },
    { label: 'Last Upload', value: '2 hrs ago' },
  ];

const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
};

  const handleDragLeave = () => {
    setIsDragging(false);
  };

const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
};

type UploadStatus = 'completed' | 'processing' | 'failed';

const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
        case 'completed':
            return <CheckCircle2 className="w-4 h-4 text-gray-900" />;
        case 'processing':
            return <Clock className="w-4 h-4 text-orange-500" />;
        case 'failed':
            return <AlertCircle className="w-4 h-4 text-red-500" />;
        default:
            return null;
    }
};

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Praxis</h1>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search datasets, reports..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                <User className="w-5 h-5" />
              </div>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6">
              {/* Left Content */}
              <div className="flex-1">
                {/* Upload Section */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`bg-white rounded-2xl shadow-sm border-2 border-dashed transition-all mb-6 ${
                    isDragging
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      isDragging ? 'bg-gray-900' : 'bg-gray-100'
                    }`}>
                      <Upload className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Upload .zip dataset or drag files here
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Supported formats: .zip (max 100MB)
                    </p>
                    <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Recent Uploads */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Uploads</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Filename
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentUploads.map((upload) => (
                          <tr key={upload.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                              {upload.filename}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {upload.size}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(upload.status)}
                                <span className={`text-sm capitalize ${
                                  upload.status === 'completed' ? 'text-gray-900' :
                                  upload.status === 'processing' ? 'text-orange-500' :
                                  'text-red-500'
                                }`}>
                                  {upload.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                              {upload.score ? (
                                <span className="text-gray-900">{upload.score}%</span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Summary Panel */}
              <div className="w-80">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-0">
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Stats</h2>
                  <div className="space-y-6">
                    {stats.map((stat, index) => (
                      <div key={index}>
                        <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}