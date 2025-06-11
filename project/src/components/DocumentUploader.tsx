import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { documentService } from '../services/documentService';
import { motion } from 'framer-motion';

interface DocumentUploaderProps {
  onUploadComplete: () => void;
}

const DocumentUploader = ({ onUploadComplete }: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const selectedFile = acceptedFiles[0];
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }
    
    // Check file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setError(null);
      
      console.log('Starting upload for file:', file.name);
      const result = await documentService.uploadDocument(file, (progress) => {
        console.log('Upload progress:', progress);
        setUploadProgress(progress);
      });
      
      console.log('Upload completed:', result);
      toast.success('Document uploaded successfully');
      setFile(null);
      setUploadProgress(0);
      
      // Notify parent component that upload is complete
      onUploadComplete();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Error uploading document. Please try again.');
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-serif font-bold mb-4">Upload Document</h2>
      
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-500 hover:bg-primary-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-primary-500 mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop your document here' : 'Drag & drop your document here'}
            </p>
            <p className="text-neutral-500 mb-4">or click to browse files</p>
            <p className="text-sm text-neutral-400">Supported formats: PDF, DOCX, TXT (max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <FileText className="h-10 w-10 text-primary-500 mr-3" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-neutral-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={cancelUpload}
              className="text-neutral-500 hover:text-error-500"
              disabled={uploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {uploading ? (
            <div className="mb-4">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
              <p className="text-sm text-neutral-500 mt-2 text-center">
                Uploading: {uploadProgress}%
              </p>
            </div>
          ) : (
            <button 
              onClick={handleUpload}
              className="btn-primary w-full"
            >
              Upload & Analyze Document
            </button>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-error-50 text-error-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;