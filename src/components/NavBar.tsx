
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, PencilRuler, BarChart3, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

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
            <Link to="/" className="text-2xl font-bold tracking-tight">
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

          {/* Search Button */}
          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon">
              <Search size={20} />
            </Button>
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
              <Button
                variant="ghost"
                className="w-full justify-start text-left flex items-center gap-2"
              >
                <Search size={18} />
                <span>Search</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
