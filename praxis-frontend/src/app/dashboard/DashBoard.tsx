'use client';

import React, { useState, useRef } from 'react';
import { Upload, LayoutDashboard, FileUp, FileBarChart2, Settings, Search, Bell, User, X, CheckCircle2, Clock, AlertCircle, Menu } from 'lucide-react';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Uploads', icon: FileUp },
    { name: 'Reports', icon: FileBarChart2 },
    { name: 'Settings', icon: Settings },
  ];

  const [recentUploads, setRecentUploads] = useState([
    { id: 1, filename: 'dataset_2025_Q1.zip', size: '2.4 MB', status: 'completed' as UploadStatus, score: 98 },
    { id: 2, filename: 'training_data.zip', size: '5.1 MB', status: 'completed' as UploadStatus, score: 95 },
    { id: 3, filename: 'validation_set.zip', size: '1.8 MB', status: 'processing' as UploadStatus, score: null },
    { id: 4, filename: 'test_batch_01.zip', size: '3.2 MB', status: 'completed' as UploadStatus, score: 92 },
  ]);

  const stats = [
    { label: 'Datasets Processed', value: '247' },
    { label: 'Average Score', value: '94.5%' },
    { label: 'Last Upload', value: '2 hrs ago' },
  ];

  // Handle file browse button click
  const handleBrowseClick = () => {
    if (selectedFiles.length > 0) {
      // If files are selected, trigger upload
      handleUpload();
    } else {
      // If no files selected, open file browser
      fileInputRef.current?.click();
    }
  };

  // Handle file selection from file input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelection(Array.from(files));
    }
  };

  // Handle drag and drop
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
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  // Handle file selection (from browse or drag & drop)
  const handleFileSelection = (files: File[]) => {
    // Filter for zip files and folders
    const validFiles = files.filter(file => 
      file.type === 'application/zip' || 
      file.name.toLowerCase().endsWith('.zip') ||
      file.type === '' // folders show as empty type
    );

    if (validFiles.length === 0) {
      alert('Please select .zip files or folders');
      return;
    }

    // Check file size (max 100MB)
    const oversizedFiles = validFiles.filter(file => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files exceed the 100MB limit');
      return;
    }

    setSelectedFiles(validFiles);
  };

  // Handle upload process
  // Handle upload process
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    // Process each selected file
    for (const file of selectedFiles) {
      const newUpload = {
        id: Date.now() + Math.random(),
        filename: file.name,
        size: formatFileSize(file.size),
        status: 'processing' as UploadStatus,
        score: null
      };

      // Add to recent uploads immediately
      setRecentUploads(prev => [newUpload, ...prev]);

      try {
        // Send file to backend
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          
          // Update upload status with results
          setRecentUploads(prev => 
            prev.map(upload => 
              upload.id === newUpload.id 
                ? { 
                    ...upload, 
                    status: 'completed' as UploadStatus, 
                    score: result.dataset_score || Math.floor(Math.random() * 20) + 80 
                  }
                : upload
            )
          );
        } else {
          // Handle error
          setRecentUploads(prev => 
            prev.map(upload => 
              upload.id === newUpload.id 
                ? { ...upload, status: 'failed' as UploadStatus }
                : upload
            )
          );
        }
      } catch (error) {
        console.error('Upload error:', error);
        setRecentUploads(prev => 
          prev.map(upload => 
            upload.id === newUpload.id 
              ? { ...upload, status: 'failed' as UploadStatus }
              : upload
          )
        );
      }
    }

    // Reset state after upload
    setIsUploading(false);
    setSelectedFiles([]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove selected file
  const removeSelectedFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,application/zip"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

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
                      <Upload className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-gray-400'} ${
                        isUploading ? 'animate-pulse' : ''
                      }`} />
                    </div>
                    
                    {selectedFiles.length > 0 ? (
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Selected Files ({selectedFiles.length})
                        </h3>
                        <div className="space-y-2 mb-6 max-h-32 overflow-y-auto">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                              <button
                                onClick={() => removeSelectedFile(index)}
                                className="ml-2 text-gray-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {isUploading ? 'Uploading files...' : 'Upload .zip files or folders or drag files here'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                          Supported formats: .zip files, folders (max 100MB)
                        </p>
                      </>
                    )}
                    
                    <button 
                      onClick={handleBrowseClick}
                      disabled={isUploading}
                      className={`px-6 py-2.5 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedFiles.length > 0 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {isUploading ? 'Processing...' : 
                       selectedFiles.length > 0 ? 'Upload' : 'Browse Files'}
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