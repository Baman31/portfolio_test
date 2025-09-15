import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { 
  User, 
  Settings, 
  BarChart3, 
  FileText, 
  Users, 
  MessageSquare,
  ArrowRight,
  LogOut
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "View Analytics",
      description: "Check website performance and user engagement",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/admin/dashboard",
      color: "chart-1",
    },
    {
      title: "Manage Content",
      description: "Update pages, blog posts, and portfolio items",
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/content",
      color: "chart-2",
    },
    {
      title: "Team Management", 
      description: "Add or update team member information",
      icon: <Users className="h-6 w-6" />,
      href: "/admin/users",
      color: "chart-3",
    },
    {
      title: "Contact Leads",
      description: "Manage and respond to customer inquiries",
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/admin/dashboard",
      color: "chart-4",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                Welcome back, {user?.firstName || 'User'}! 👋
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your TechForge portfolio and content from your dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/api/logout" className="inline-flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-chart-1 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground mb-2">{user?.email}</p>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <User className="h-3 w-3 mr-1" />
                    {user?.role || 'User'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                  </span>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {user?.role === 'admin' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Quick Actions</h2>
              <p className="text-muted-foreground">Access your most used admin features</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover-lift group cursor-pointer" asChild>
                  <Link href={action.href}>
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-${action.color}/10 text-${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {action.description}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        Access
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Public Site Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Explore Public Site</h2>
          <p className="text-muted-foreground">Navigate to different sections of the TechForge website</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "About Us", href: "/about", description: "Learn about our company and team" },
            { title: "Services", href: "/services", description: "Explore our software development services" },
            { title: "Portfolio", href: "/portfolio", description: "View our featured projects and case studies" },
            { title: "Blog", href: "/blog", description: "Read our latest insights and articles" },
            { title: "Contact", href: "/contact", description: "Get in touch with our team" },
          ].map((link, index) => (
            <Card key={index} className="hover-lift group cursor-pointer" asChild>
              <Link href={link.href}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {link.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Visit
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
