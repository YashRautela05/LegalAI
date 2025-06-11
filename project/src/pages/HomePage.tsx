import { useNavigate } from 'react-router-dom';
import { FileText, Shield, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-800 to-primary-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
                  Transform Legal Document Analysis with AI
                </h1>
                <p className="text-xl text-neutral-100 mb-8">
                  Upload legal documents to get instant summaries and risk analysis. Save hours of manual review with our intelligent legal AI.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="btn-secondary"
                  >
                    Get Started Free
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
                    className="btn bg-white text-primary-800 hover:bg-neutral-100"
                  >
                    Login
                  </button>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-lg shadow-2xl p-4 md:p-6 transform -rotate-2">
                  <div className="bg-neutral-100 rounded p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 rounded-full bg-error-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-warning-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-success-500"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-200 rounded w-full"></div>
                      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                      <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-neutral-800">Risk Analysis</div>
                    <div className="mt-2 space-y-2">
                      <div className="bg-error-100 text-error-800 text-xs rounded p-2">High Risk: Liability Clause (Section 8.2)</div>
                      <div className="bg-warning-100 text-warning-800 text-xs rounded p-2">Medium Risk: Termination Terms (Section 12)</div>
                      <div className="bg-success-100 text-success-800 text-xs rounded p-2">Low Risk: Confidentiality Period (Section 6.3)</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 absolute top-8 right-8 transform rotate-3">
                  <div className="text-sm font-medium text-neutral-800 mb-2">Document Summary</div>
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 rounded w-full"></div>
                    <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
                    <div className="h-3 bg-neutral-200 rounded w-4/5"></div>
                    <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
                    <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How LegalDocAI Works</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our platform uses advanced AI to extract insights from your legal documents in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-full bg-primary-100 p-4 inline-flex mb-4 mx-auto">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Upload Documents</h3>
              <p className="text-neutral-600">
                Simply drag and drop your legal documents. We support PDF, DOCX, and TXT formats.
              </p>
            </motion.div>

            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-full bg-secondary-100 p-4 inline-flex mb-4 mx-auto">
                <Shield className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Identify Risks</h3>
              <p className="text-neutral-600">
                Our AI identifies potential legal risks and flags them by severity level for your review.
              </p>
            </motion.div>

            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="rounded-full bg-success-100 p-4 inline-flex mb-4 mx-auto">
                <BarChart className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Generate Reports</h3>
              <p className="text-neutral-600">
                Download comprehensive reports with document summaries and risk assessments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Transform Your Legal Document Workflow?</h2>
            <p className="text-xl text-neutral-600 mb-8">
              Join thousands of legal professionals using LegalDocAI to streamline document review and risk assessment.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;