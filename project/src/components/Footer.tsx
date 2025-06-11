import { Scale, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-6 w-6" />
              <span className="text-xl font-serif font-bold">LegalDocAI</span>
            </div>
            <p className="text-neutral-200 mb-4">
              Intelligent legal document analysis powered by AI.
              Identify risks and get summaries in seconds.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-neutral-200 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="text-neutral-200 hover:text-white transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Data Processing</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-neutral-300">
          <p>&copy; {new Date().getFullYear()} LegalDocAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;