import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DocumentUploader from "../components/DocumentUploader";
import DocumentList from "../components/DocumentList";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    // Increment refresh trigger to cause DocumentList to reload
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <h1 className='text-3xl font-serif font-bold mb-2'>
          Welcome, {user?.name}
        </h1>
        <p className='text-neutral-600 mb-8'>
          Upload legal documents to get instant analysis and risk assessment
        </p>
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <motion.div
          className='lg:col-span-1'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <DocumentUploader onUploadComplete={handleUploadComplete} />
        </motion.div>

        <motion.div
          className='lg:col-span-2'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <DocumentList
            refreshTrigger={refreshTrigger}
            setRefreshTrigger={setRefreshTrigger}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
