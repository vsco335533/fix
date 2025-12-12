import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Home, FileText, Video, Image, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/image (1).png'; // New SVG

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 pt-1">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-5" aria-label="Pi Labs Home">
            <img
              src={logo}
              alt="Pi LABS — Commons Research Foundation"
              className="h-20 w-50 object-contain "
              draggable="false"
            />
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-600 pb-6">
              <Home className="w-6 h-16 " />
              Home
            </Link>
            <Link to="/research" className="flex items-center gap-2 text-gray-700 hover:text-gray-600 pb-6">
              <FileText className="w-6 h-16 " />
              Research
            </Link>
            <Link to="/videos" className="flex items-center gap-2 text-gray-700 hover:text-gray-600 pb-6">
              <Video className="w-6 h-16 " />
              Videos
            </Link>
            <Link to="/gallery" className="flex items-center gap-2 text-gray-700 hover:text-gray-600 pb-6">
              <Image className="w-6 h-16 " />
              Gallery
            </Link>
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={profile?.role === 'super_admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-600 "
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                 className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-[-19px]"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
