import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

// Pages
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import PortfolioDetail from "@/pages/portfolio/[id]";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[slug]";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminContent from "@/pages/admin/content";
import AdminProjects from "@/pages/admin/projects";
import AdminBlog from "@/pages/admin/blog";
import AdminUsers from "@/pages/admin/users";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Track page views when routes change
  useAnalytics();

  return (
    <Switch>
      {isLoading ? (
        <Route>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        </Route>
      ) : !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/portfolio/:id" component={PortfolioDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/portfolio/:id" component={PortfolioDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          
          {/* Admin routes (require admin role) */}
          {user?.role === 'admin' && (
            <>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/content" component={AdminContent} />
              <Route path="/admin/projects" component={AdminProjects} />
              <Route path="/admin/blog" component={AdminBlog} />
              <Route path="/admin/users" component={AdminUsers} />
            </>
          )}
          
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Only initialize GA if key is present (no warnings in production)
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    } else if (import.meta.env.DEV) {
      // Only warn in development
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
