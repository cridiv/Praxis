'use client';

import React, { useState } from 'react';
import { Upload, FolderOpen, ChevronLeft, ChevronRight, Calendar, TrendingUp, Search, Bell, User, Menu } from 'lucide-react';
import Sidebar from '../components/SideBar';
import UploadModal from '../components/UploadModal';

type StatusType = 'Low' | 'Medium' | 'High';

interface Dataset {
  id: number;
  name: string;
  score: number;
  status: StatusType;
  date: string;
}

export default function UploadPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNav, setActiveNav] = useState('Uploads');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const itemsPerPage = 10;

  const [datasets] = useState<Dataset[]>([
    { id: 1, name: 'echo_list_extracted.zip', score: 0.75, status: 'Medium', date: 'Oct 7, 2025 14:32' },
    { id: 2, name: 'TAVARI – The Intelligent Agent Hub.zip', score: 0.75, status: 'Medium', date: 'Oct 7, 2025 14:28' },
    { id: 3, name: 'firefox229363password.zip', score: 0.40, status: 'Low', date: 'Oct 7, 2025 14:15' },
    { id: 4, name: 'customer_feedback_dataset.zip', score: 0.88, status: 'High', date: 'Oct 7, 2025 13:45' },
    { id: 5, name: 'social_media_comments.zip', score: 0.62, status: 'Medium', date: 'Oct 7, 2025 12:20' },
    { id: 6, name: 'product_reviews_cleaned.zip', score: 0.91, status: 'High', date: 'Oct 7, 2025 11:58' },
    { id: 7, name: 'user_generated_content.zip', score: 0.35, status: 'Low', date: 'Oct 7, 2025 11:22' },
    { id: 8, name: 'support_tickets_archive.zip', score: 0.78, status: 'Medium', date: 'Oct 7, 2025 10:45' },
    { id: 9, name: 'forum_posts_batch_01.zip', score: 0.82, status: 'High', date: 'Oct 7, 2025 09:30' },
    { id: 10, name: 'chat_logs_anonymized.zip', score: 0.58, status: 'Medium', date: 'Oct 7, 2025 09:12' },
    { id: 11, name: 'email_dataset_filtered.zip', score: 0.93, status: 'High', date: 'Oct 6, 2025 18:45' },
    { id: 12, name: 'survey_responses_2025.zip', score: 0.67, status: 'Medium', date: 'Oct 6, 2025 17:20' },
    { id: 13, name: 'moderation_queue_export.zip', score: 0.28, status: 'Low', date: 'Oct 6, 2025 16:55' },
    { id: 14, name: 'wiki_comments_sample.zip', score: 0.85, status: 'High', date: 'Oct 6, 2025 15:30' },
    { id: 15, name: 'blog_posts_collection.zip', score: 0.72, status: 'Medium', date: 'Oct 6, 2025 14:18' },
  ]);

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'High':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status: StatusType) => {
    switch (status) {
      case 'High':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const totalPages = Math.ceil(datasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDatasets = datasets.slice(startIndex, endIndex);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FolderOpen className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No uploads yet</h3>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Start by uploading your first dataset to begin analyzing quality, structure, and toxicity.
      </p>
      <button
        onClick={() => setUploadModalOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Upload className="w-4 h-4" />
        Upload Your First Dataset
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-white font-sans">
      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} activeNav={activeNav} setActiveNav={setActiveNav} />

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
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-600">Uploaded Datasets</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{datasets.length} total datasets</p>
                  </div>
                </div>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {datasets.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Dataset Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentDatasets.map((dataset) => (
                          <tr key={dataset.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FolderOpen className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-800 truncate max-w-md">
                                  {dataset.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-800">
                                  {dataset.score.toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${getStatusDot(dataset.status)}`}></span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(dataset.status)}`}>
                                  {dataset.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {dataset.date}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(endIndex, datasets.length)}</span> of{' '}
                      <span className="font-medium">{datasets.length}</span> datasets
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-white border border-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}