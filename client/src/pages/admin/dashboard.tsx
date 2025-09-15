import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/sidebar";
import DashboardStats from "@/components/admin/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare,
  TrendingUp,
  Calendar,
  Clock,
  Plus
} from "lucide-react";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Check admin role
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: leads } = useQuery({
    queryKey: ["/api/admin/leads"],
    retry: false,
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["/api/admin/blog"],
    retry: false,
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/admin/projects"],
    retry: false,
  });

  const { data: team } = useQuery({
    queryKey: ["/api/admin/team"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // Recent activity data
  const recentLeads = leads?.slice(0, 5) || [];
  const recentPosts = blogPosts?.slice(0, 3) || [];
  const recentProjects = projects?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" data-testid="button-new-content">
                <Plus className="h-4 w-4 mr-2" />
                New Content
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Stats Overview */}
          <DashboardStats 
            leads={leads}
            blogPosts={blogPosts}
            projects={projects}
            team={team}
          />

          {/* Recent Activity Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {/* Recent Leads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Recent Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentLeads.length > 0 ? (
                  <div className="space-y-4">
                    {recentLeads.map((lead: any) => (
                      <div key={lead.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-foreground">
                              {lead.contact?.firstName} {lead.contact?.lastName}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {lead.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lead.contact?.company || 'No company'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent leads
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post: any) => (
                    <div key={`post-${post.id}`} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-chart-1/10 text-chart-1 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          New blog post published
                        </p>
                        <p className="text-xs text-muted-foreground">
                          "{post.title}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {recentProjects.map((project: any) => (
                    <div key={`project-${project.id}`} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-chart-2/10 text-chart-2 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          New project added
                        </p>
                        <p className="text-xs text-muted-foreground">
                          "{project.title}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {recentPosts.length === 0 && recentProjects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-foreground">
                      {leads?.filter((lead: any) => {
                        const leadDate = new Date(lead.createdAt);
                        const now = new Date();
                        return leadDate.getMonth() === now.getMonth() && 
                               leadDate.getFullYear() === now.getFullYear();
                      }).length || 0}
                    </p>
                    <p className="text-xs text-chart-2">New leads</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-foreground">
                      {blogPosts?.filter((post: any) => post.status === 'published').length || 0}
                    </p>
                    <p className="text-xs text-chart-1">Blog posts</p>
                  </div>
                  <FileText className="h-8 w-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-foreground">
                      {projects?.filter((project: any) => project.status === 'active').length || 0}
                    </p>
                    <p className="text-xs text-chart-3">Projects</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Team</p>
                    <p className="text-2xl font-bold text-foreground">
                      {team?.filter((member: any) => member.active).length || 0}
                    </p>
                    <p className="text-xs text-chart-4">Members</p>
                  </div>
                  <Users className="h-8 w-8 text-chart-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
