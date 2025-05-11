import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, PencilRuler, BarChart3, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check login status
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };
    
    // Check on initial load
    checkLoginStatus();
    
    // Listen for storage events (login state changes)
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Practice', path: '/practice', icon: PencilRuler },
    { name: 'Resources', path: '/about', icon: BookOpen },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignOutClick = () => {
    localStorage.clear();
    
    // Dispatch storage event to notify components
    window.dispatchEvent(new Event('storage'));
    
    setIsLoggedIn(false);
    navigate('/');
  };

  // Logo click handler - always navigate to papers if logged in, otherwise to landing
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/papers');
    } else {
      navigate('/');
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300',
        isScrolled ? 'py-3' : 'py-5',
        'bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800/20'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-primary flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold tracking-tight text-[#5BB98C] dark:text-green-400" onClick={handleLogoClick}>
              JEE Quest
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.name === 'Resources' && location.pathname === '/about');
              const isGreenActive =
                (link.name === 'Practice' && location.pathname === link.path) ||
                (link.name === 'Resources' && (location.pathname === link.path || location.pathname === '/about')) ||
                (link.name === 'Analytics' && location.pathname === link.path);
              return (
                <Link key={link.name} to={link.path}>
                  <Button
                    className={
                      `flex items-center gap-2 px-6 rounded-2xl font-normal transition-colors duration-150` +
                      (isGreenActive
                        ? ' bg-[#1D9A6C] text-white shadow-none dark:bg-green-600 dark:text-white'
                        : ' bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800')
                    }
                    style={{ fontWeight: 400, boxShadow: 'none' }}
                    variant="ghost"
                  >
                    <Icon size={20} color={isGreenActive ? 'white' : (theme === 'dark' ? 'white' : 'black')} />
                    <span>{link.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Dark Mode Toggle & Sign In Button */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {/* Hide Sign Out on /practice routes */}
            {isLoggedIn && !location.pathname.startsWith('/practice') ? (
              <Button variant="ghost" size="sm" onClick={handleSignOutClick} className="dark:text-white">
                Sign Out
              </Button>
            ) : !isLoggedIn ? (
              <Button variant="default" size="sm" onClick={handleSignInClick} className="gap-2 bg-[#5BB98C] text-white dark:bg-green-600 dark:text-white">
                <LogIn size={16} />
                Sign In
              </Button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="dark:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="pt-4 pb-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={location.pathname === link.path ? "default" : "ghost"}
                      className="w-full justify-start text-left flex items-center gap-2 dark:text-white"
                    >
                      <Icon size={18} />
                      <span>{link.name}</span>
                    </Button>
                  </Link>
                );
              })}

              {/* Hide Sign Out on /practice routes in mobile menu */}
              {isLoggedIn && !location.pathname.startsWith('/practice') ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left flex items-center gap-2 dark:text-white"
                  onClick={() => {
                    handleSignOutClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              ) : !isLoggedIn ? (
                <Button
                  variant="default"
                  className="w-full justify-start text-left flex items-center gap-2 bg-[#5BB98C] text-white dark:bg-green-600 dark:text-white"
                  onClick={() => {
                    navigate('/signin');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
