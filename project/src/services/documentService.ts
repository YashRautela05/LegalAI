import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Mock storage for development mode
let mockDocuments: Document[] = [];

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  summary?: string;
  risks?: Risk[];
}

export interface Risk {
  id: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  excerpt: string;
  page: number;
}

const uploadDocument = async (file: File, onProgress?: (percentage: number) => void): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock document upload in development mode');
      
      // Simulate upload progress
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 300);
      }
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockDocument: Document = {
        id: crypto.randomUUID(),
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        status: 'completed',
        summary: 'This is a mock summary for development. The document appears to be a standard legal agreement with some potential concerns around liability clauses and indemnification terms. Overall risk assessment shows moderate concerns.',
        risks: [
          {
            id: '1',
            severity: 'high',
            category: 'Liability',
            description: 'Unlimited liability clause potentially exposes the client to significant financial risk',
            excerpt: 'Party shall be liable for any and all damages without limitation',
            page: 3
          },
          {
            id: '2',
            severity: 'medium',
            category: 'Termination',
            description: 'Asymmetrical termination terms favor the opposing party',
            excerpt: 'Company may terminate with 30 days notice, while Client must provide 90 days notice',
            page: 5
          },
          {
            id: '3',
            severity: 'low',
            category: 'Confidentiality',
            description: 'Confidentiality terms expire after 1 year, which may be insufficient',
            excerpt: 'Confidentiality obligations shall continue for a period of 1 year following termination',
            page: 8
          }
        ]
      };

      // Add to mock storage
      mockDocuments.unshift(mockDocument);
      console.log('Mock document added to storage:', mockDocument);
      return mockDocument;
    }

    // Production API call
    const response = await axios.post<Document>(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

const getDocument = async (id: string): Promise<Document> => {
  try {
    const response = await axios.get<Document>(`${API_URL}/summary/${id}`);
    return response.data;
  } catch (error) {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock document data in development mode');
      return {
        id,
        fileName: 'Sample Agreement.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date().toISOString(),
        status: 'completed',
        summary: 'This contract is a service agreement between ABC Corp and XYZ Inc. The agreement outlines terms for software development services, payment schedules, and intellectual property rights. Several high and medium risk areas were identified, including an unbalanced liability clause and potential issues with the termination provisions.',
        risks: [
          {
            id: '1',
            severity: 'high',
            category: 'Liability',
            description: 'Unlimited liability clause potentially exposes the client to significant financial risk',
            excerpt: 'Party shall be liable for any and all damages without limitation',
            page: 3
          },
          {
            id: '2',
            severity: 'medium',
            category: 'Termination',
            description: 'Asymmetrical termination terms favor the opposing party',
            excerpt: 'Company may terminate with 30 days notice, while Client must provide 90 days notice',
            page: 5
          },
          {
            id: '3',
            severity: 'low',
            category: 'Confidentiality',
            description: 'Confidentiality terms expire after 1 year, which may be insufficient',
            excerpt: 'Confidentiality obligations shall continue for a period of 1 year following termination',
            page: 8
          }
        ]
      };
    }
    throw error;
  }
};

const getUserDocuments = async (): Promise<Document[]> => {
  try {
    const response = await axios.get<Document[]>(`${API_URL}/documents`);
    return response.data;
  } catch (error) {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock document list in development mode');
      if (mockDocuments.length === 0) {
        // Initialize with some mock data if empty
        mockDocuments = [
          {
            id: '1',
            fileName: 'Services Agreement.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            status: 'completed',
          },
          {
            id: '2',
            fileName: 'Lease Agreement.docx',
            fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            status: 'completed',
          },
          {
            id: '3',
            fileName: 'Employment Contract.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
            status: 'completed',
          }
        ];
      }
      return mockDocuments;
    }
    throw error;
  }
};

const downloadReport = async (id: string): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    // For development, we'll return a mock PDF generated on the fly
    if (process.env.NODE_ENV === 'development') {
      console.warn('Generating mock PDF in development mode');
      throw new Error('PDF generation is mocked in development mode. This would download a real PDF in production.');
    }
    throw error;
  }
};

export const documentService = {
  uploadDocument,
  getDocument,
  getUserDocuments,
  downloadReport,
};