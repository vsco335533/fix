import { BookOpen } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-4">
              <BookOpen className="w-6 h-6" />
              <span className="text-xl font-bold">Pi Labs</span>
            </div>
            <p className="text-gray-400 max-w-md">
              A professional platform for publishing and sharing research, field studies, and knowledge with the world.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/research" className="hover:text-white transition-colors">Research</a></li>
              <li><a href="/videos" className="hover:text-white transition-colors">Videos</a></li>
              <li><a href="/gallery" className="hover:text-white transition-colors">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              For inquiries and collaborations, please reach out through our contact form.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Pi Labs - Commons Reasearch Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
