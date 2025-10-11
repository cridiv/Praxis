import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingDescription, setIsProcessingDescription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');

  const handleBrowseClick = () => {
    if (selectedFiles.length > 0) {
      handleUpload();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelection(Array.from(files));
    }
  };

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

  const handleFileSelection = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === 'application/zip' || 
      file.name.toLowerCase().endsWith('.zip') ||
      file.type === ''
    );

    if (validFiles.length === 0) {
      alert('Please select .zip files or folders');
      return;
    }

    const oversizedFiles = validFiles.filter(file => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files exceed the 100MB limit');
      return;
    }

    setSelectedFiles(validFiles);
  };

  const handleDescriptionFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const text = await file.text();
      setDescription(text);
    }
  };

    const handleDescription = async () => {
    if (!description.trim()) {
      return; // Don't send empty descriptions
    }

    setIsProcessingDescription(true);
    
    try {
      const response = await fetch('http://localhost:5000/upload/description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Description processed successfully:', result);
      } else {
        const error = await response.text();
        console.error('Description processing failed:', error);
      }
    } catch (error) {
      console.error('Error sending description:', error);
    } finally {
      setIsProcessingDescription(false);
    }
  };

const handleUpload = async () => {
  if (selectedFiles.length === 0) {
    alert('Please select at least one dataset file.');
    return;
  }

  if (!description.trim()) {
    alert('Please add a dataset description.');
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('file', selectedFiles[0]); 
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful:', result);
      alert('Upload successful!');
    } else {
      const error = await response.text();
      console.error('❌ Upload failed:', error);
      alert('Upload failed.');
    }
  } catch (error) {
    console.error('⚠️ Upload error:', error);
  } finally {
    setIsUploading(false);
    setSelectedFiles([]);
    setDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }
};

  const removeSelectedFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Upload Dataset</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-4">
          {/* Left Section - File Upload */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Dataset Files</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,application/zip"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl transition-all ${
                isDragging
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300'
              }`}
            >
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  isDragging ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <Upload className={`w-6 h-6 ${isDragging ? 'text-white' : 'text-gray-400'} ${
                    isUploading ? 'animate-pulse' : ''
                  }`} />
                </div>
                
                {selectedFiles.length > 0 ? (
                  <div className="w-full">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">
                      Selected ({selectedFiles.length})
                    </h4>
                    <div className="space-y-2 mb-4 max-h-24 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg">
                          <span className="text-xs text-gray-700 truncate">{file.name}</span>
                          <button
                            onClick={() => removeSelectedFile(index)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                      {isUploading ? 'Uploading...' : 'Drop files here'}
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">
                      .zip files (max 100MB)
                    </p>
                  </>
                )}
                
                <button 
                  onClick={handleBrowseClick}
                  disabled={isUploading}
                  className={`px-4 py-2 text-sm text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
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
          </div>

          {/* Right Section - Description */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Description</h3>
              <input
                type="file"
                accept=".txt,text/plain"
                onChange={handleDescriptionFileSelect}
                className="hidden"
                id="description-file-input"
              />
              <label
                htmlFor="description-file-input"
                className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Upload .txt
              </label>
            <button
              onClick={handleDescription}
              disabled={!description.trim() || isProcessingDescription}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-50"
            >
              {isProcessingDescription ? 'Processing...' : 'Analyze Description'}
            </button>
            </div>
            
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter dataset description or upload a .txt file..."
              className="w-full h-[calc(100%-2rem)] min-h-[200px] p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900 transition-colors text-sm text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}