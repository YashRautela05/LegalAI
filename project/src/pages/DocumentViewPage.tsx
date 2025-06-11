import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Download, ArrowLeft, AlertCircle, 
  CheckCircle, XCircle, ArrowUpRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, Risk, documentService } from '../services/documentService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const DocumentViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const docData = await documentService.getDocument(id);
        setDocument(docData);
        setError(null);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      setDownloadLoading(true);
      
      try {
        // Try to use the API first
        const pdfBlob = await documentService.downloadReport(document.id);
        const url = URL.createObjectURL(pdfBlob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document.fileName.split('.')[0]}-analysis.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        // Fall back to client-side PDF generation
        console.log('Falling back to client-side PDF generation');
        generatePDF();
      }
      
      toast.success('Report downloaded successfully');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download report');
    } finally {
      setDownloadLoading(false);
    }
  };

  const generatePDF = () => {
    if (!document) return;
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20;
    
    // Add title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Legal Document Analysis Report', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    // Add filename and date
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(`Document: ${document.fileName}`, 20, y);
    y += 7;
    pdf.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, y);
    y += 15;
    
    // Add summary section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Document Summary', 20, y);
    y += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    
    // Handle text wrapping for summary
    const splitSummary = pdf.splitTextToSize(document.summary || 'No summary available', pageWidth - 40);
    pdf.text(splitSummary, 20, y);
    y += splitSummary.length * 6 + 15;
    
    // Add risks section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Risk Analysis', 20, y);
    y += 10;
    
    // Create risk table
    if (document.risks && document.risks.length > 0) {
      document.risks.forEach((risk) => {
        // Risk severity label
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        let severityColor;
        switch (risk.severity) {
          case 'high':
            severityColor = [220/255, 38/255, 38/255]; // Red
            break;
          case 'medium':
            severityColor = [245/255, 158/255, 11/255]; // Amber
            break;
          default:
            severityColor = [16/255, 185/255, 129/255]; // Green
        }
        pdf.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
        pdf.text(`${risk.severity.toUpperCase()} RISK: ${risk.category}`, 20, y);
        y += 6;
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
        
        // Risk description
        pdf.setFont('helvetica', 'normal');
        const splitDesc = pdf.splitTextToSize(risk.description, pageWidth - 40);
        pdf.text(splitDesc, 20, y);
        y += splitDesc.length * 6 + 2;
        
        // Risk excerpt
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        const splitExcerpt = pdf.splitTextToSize(`"${risk.excerpt}"`, pageWidth - 60);
        pdf.text(splitExcerpt, 30, y);
        y += splitExcerpt.length * 5 + 2;
        
        // Page reference
        pdf.text(`Page ${risk.page}`, 30, y);
        y += 8;
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
      });
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text('No risks identified.', 20, y);
      y += 10;
    }
    
    // Add footer
    const footerText = 'Generated by LegalDocAI - Intelligent Document Risk & Summary Platform';
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(footerText, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
    
    // Save PDF
    pdf.save(`${document.fileName.split('.')[0]}-analysis.pdf`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low':
        return 'bg-success-100 text-success-700 border-success-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="h-5 w-5 text-error-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-warning-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700"></div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card">
          <div className="p-4 bg-error-50 text-error-700 rounded-md">
            <p>{error || 'Document not found'}</p>
            <button 
              className="mt-4 btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-primary-700 hover:text-primary-800 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{document.fileName}</h1>
              <p className="text-neutral-500">
                Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 md:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <button 
            onClick={handleDownload}
            className="btn-primary flex items-center"
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              <>
                <span className="mr-2">Downloading</span>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </>
            )}
          </button>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="card">
            <h2 className="text-xl font-serif font-bold mb-4">Document Summary</h2>
            <p className="text-neutral-700 leading-relaxed">
              {document.summary || 'No summary available for this document.'}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold">Risk Analysis</h2>
              {document.risks && document.risks.length > 0 && (
                <span className="text-sm text-neutral-500">
                  {document.risks.length} {document.risks.length === 1 ? 'issue' : 'issues'} found
                </span>
              )}
            </div>
            
            {document.risks && document.risks.length > 0 ? (
              <div className="space-y-4">
                {document.risks.map((risk: Risk, index) => (
                  <motion.div 
                    key={risk.id}
                    className={`p-3 border rounded-md ${getSeverityColor(risk.severity)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                  >
                    <div className="flex items-start">
                      <div className="mt-0.5 mr-2">
                        {getSeverityIcon(risk.severity)}
                      </div>
                      <div>
                        <h3 className="font-medium">{risk.category}</h3>
                        <p className="text-sm mt-1">{risk.description}</p>
                        <div className="mt-2 px-3 py-2 bg-white bg-opacity-50 rounded text-xs font-mono">
                          "{risk.excerpt}"
                        </div>
                        <div className="mt-2 text-xs flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Page {risk.page}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-3" />
                <p className="text-neutral-700">No risks detected in this document</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentViewPage;