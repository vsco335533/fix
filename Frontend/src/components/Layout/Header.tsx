import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Home,
  FileText,
  Video,
  Image,
  LayoutDashboard,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import logo from "../../assets/image (1-).png";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 pt-1">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-5" aria-label="Pi Labs Home">
            <img
              src={logo}
              alt="Pi LABS — Commons Research Foundation"
              className="h-16 w-auto object-contain"
              draggable="false"
            />
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-600">
              <Home className="w-5 h-5" />
              Home
            </Link>

            <Link to="/research" className="flex items-center gap-2 text-gray-700 hover:text-gray-600">
              <FileText className="w-5 h-5" />
              Research
            </Link>

            <Link to="/videos" className="flex items-center gap-2 text-gray-700 hover:text-gray-600">
              <Video className="w-5 h-5" />
              Videos
            </Link>

            <Link to="/gallery" className="flex items-center gap-2 text-gray-700 hover:text-gray-600">
              <Image className="w-5 h-5" />
              Gallery
            </Link>
          </div>

          {/* AUTH SECTION */}
          <div className="flex items-center gap-4 relative">
            {user ? (
              <>
                {/* ROLE BADGE */}
                {profile?.role && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${profile.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {profile.role === 'super_admin' ? 'Admin' : 'Researcher'}
                  </span>
                )}
                {/* KEBAB MENU BUTTON */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="w-5 h-5 text-gray-700" />
                </button>

                {/* DROPDOWN MENU */}
                {menuOpen && (
                  <div className="absolute right-0 top-14 w-44 bg-white border rounded-lg shadow-lg z-50">
                    
                    <Link
                      to={profile?.role === "super_admin" ? "/admin" : "/dashboard"}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
