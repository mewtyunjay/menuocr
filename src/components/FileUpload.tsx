'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-3xl mx-auto p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} disabled={isUploading} />
      <div className="space-y-4">
        <div className="text-4xl">📄</div>
        <div className="text-lg font-medium text-gray-200">
          {isUploading ? (
            'Uploading...'
          ) : (
            <>
              Drag and drop your menu image here, or <span className="text-blue-400">click to select</span>
            </>
          )}
        </div>
        <div className="text-sm text-gray-400">Supports JPEG, PNG and WebP</div>
      </div>
    </div>
  );
} 