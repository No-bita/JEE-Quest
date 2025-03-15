
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, PencilRuler, BarChart3, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check login status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Papers', path: '/papers', icon: BookOpen },
    { name: 'Practice', path: '/practice', icon: PencilRuler },
    { name: 'Analysis', path: '/analysis', icon: BarChart3 },
  ];

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      navigate('/papers');
    }
    // If not logged in, normal link behavior takes them to '/'
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300',
        isScrolled ? 'py-3' : 'py-5'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-primary flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold tracking-tight" onClick={handleLogoClick}>
              JEE Quest
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.name} to={link.path}>
                  <Button
                    variant={location.pathname === link.path ? "default" : "ghost"}
                    className="flex items-center gap-2 px-4"
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Sign In Button */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('isAdmin');
                setIsLoggedIn(false);
                navigate('/');
              }}>
                Sign Out
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={handleSignInClick} className="gap-2">
                <LogIn size={16} />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
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
                      className="w-full justify-start text-left flex items-center gap-2"
                    >
                      <Icon size={18} />
                      <span>{link.name}</span>
                    </Button>
                  </Link>
                );
              })}
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left flex items-center gap-2"
                  onClick={() => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('isAdmin');
                    setIsLoggedIn(false);
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="w-full justify-start text-left flex items-center gap-2"
                  onClick={() => {
                    navigate('/signin');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
