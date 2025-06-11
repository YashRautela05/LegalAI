import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Document, documentService } from '../services/documentService';
import { motion } from 'framer-motion';

type DocumentListProps = {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
};

const DocumentList = ({ refreshTrigger, setRefreshTrigger }: DocumentListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await documentService.getUserDocuments();
        // Ensure docs is an array before setting state
        setDocuments(Array.isArray(docs) ? docs : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load your documents. Please try again.');
        setDocuments([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-2xl font-serif font-bold mb-6">Your Documents</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-2xl font-serif font-bold mb-6">Your Documents</h2>
        <div className="p-4 bg-error-50 text-error-700 rounded-md">
          <p>{error}</p>
          <button 
            className="mt-2 text-primary-700 font-medium hover:underline"
            onClick={() => setRefreshTrigger(prev => prev + 1)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(documents) || documents.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-serif font-bold mb-6">Your Documents</h2>
        <div className="py-8 text-center">
          <FileText className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">No documents found. Upload your first document to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-serif font-bold mb-6">Your Documents</h2>
      <div className="divide-y divide-neutral-200">
        {Array.isArray(documents) && documents.map((doc, index) => (
          <motion.div 
            key={doc.id}
            className="py-4 first:pt-0 last:pb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/documents/${doc.id}`} className="flex items-center justify-between group">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 group-hover:text-primary-700 transition-colors">
                    {doc.fileName}
                  </h3>
                  <div className="flex items-center text-sm text-neutral-500 mt-1 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(doc.uploadDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{new Date(doc.uploadDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;