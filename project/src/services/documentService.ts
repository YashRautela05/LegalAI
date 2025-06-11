import axios from 'axios';


const API_URL = 'http://localhost:3000/document'; 
axios.defaults.withCredentials = true;

export interface Document {
  _id: string;
  title: string;
  uploadDate: string;
  summary?: string;
  analysis?: Risk[];
}

export interface Risk {
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
}

const uploadDocument = async (file: File, onProgress?: (percentage: number) => void): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {

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
    const response = await axios.get<Document>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

const getUserDocuments = async (): Promise<Document[]> => {
  try {
    const response = await axios.get<Document[]>(`${API_URL}/user/all`);
    return response.data;
  } catch (error) {
    
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

    throw error;
  }
};

export const documentService = {
  uploadDocument,
  getDocument,
  getUserDocuments,
  downloadReport,
};