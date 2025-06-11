import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-serif font-bold text-primary-300">404</h1>
        <h2 className="text-3xl font-serif font-bold mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <MoveLeft className="h-4 w-4 mr-2" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;