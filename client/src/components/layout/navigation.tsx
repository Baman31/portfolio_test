import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-serif font-bold text-xl text-foreground">TechForge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={cn(
                      "nav-link text-foreground hover:text-primary font-medium transition-colors",
                      location === link.href && "text-primary"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-1 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="text-sm text-foreground">{user?.firstName}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/logout">Logout</a>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/login">Login</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={cn(
                      "block px-3 py-2 text-foreground hover:text-primary font-medium transition-colors",
                      location === link.href && "text-primary"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <span 
                        className="block px-3 py-2 text-foreground hover:text-primary font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin
                      </span>
                    </Link>
                  )}
                  <a 
                    href="/api/logout" 
                    className="block px-3 py-2 text-foreground hover:text-primary font-medium"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <>
                  <Link href="/contact">
                    <span 
                      className="block mx-3 mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </span>
                  </Link>
                  <a 
                    href="/api/login" 
                    className="block px-3 py-2 text-foreground hover:text-primary font-medium"
                  >
                    Login
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
