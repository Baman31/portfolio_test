import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface DashboardStatsProps {
  leads?: any[];
  blogPosts?: any[];
  projects?: any[];
  team?: any[];
}

export default function DashboardStats({ 
  leads = [], 
  blogPosts = [], 
  projects = [], 
  team = [] 
}: DashboardStatsProps) {
  
  const stats = [
    {
      title: "Total Leads",
      value: leads.length,
      change: "+12%",
      trend: "up",
      icon: MessageSquare,
      color: "chart-1",
      description: "Contact inquiries",
    },
    {
      title: "Blog Posts",
      value: blogPosts.filter(post => post.status === 'published').length,
      change: "+8%", 
      trend: "up",
      icon: FileText,
      color: "chart-2",
      description: "Published articles",
    },
    {
      title: "Active Projects",
      value: projects.filter(project => project.status === 'active').length,
      change: "+15%",
      trend: "up", 
      icon: Briefcase,
      color: "chart-3",
      description: "Current portfolio",
    },
    {
      title: "Team Members",
      value: team.filter(member => member.active).length,
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "chart-4", 
      description: "Active employees",
    },
  ];

  const newLeadsThisMonth = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    const now = new Date();
    return leadDate.getMonth() === now.getMonth() && 
           leadDate.getFullYear() === now.getFullYear();
  }).length;

  const pendingLeads = leads.filter(lead => lead.status === 'new').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}/10 rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-chart-2' : 'text-destructive'
                  }`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm font-medium text-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Lead Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-chart-1 rounded-full mr-2"></div>
                  <span className="text-sm text-foreground">New</span>
                </div>
                <span className="text-sm font-medium">{pendingLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-chart-3 rounded-full mr-2"></div>
                  <span className="text-sm text-foreground">Qualified</span>
                </div>
                <span className="text-sm font-medium">{qualifiedLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-chart-2 rounded-full mr-2"></div>
                  <span className="text-sm text-foreground">Converted</span>
                </div>
                <span className="text-sm font-medium">{convertedLeads}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">New Leads</span>
                <span className="text-sm font-medium">{newLeadsThisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Blog Posts</span>
                <span className="text-sm font-medium">
                  {blogPosts.filter(post => {
                    const postDate = new Date(post.createdAt);
                    const now = new Date();
                    return postDate.getMonth() === now.getMonth() && 
                           postDate.getFullYear() === now.getFullYear();
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">New Projects</span>
                <span className="text-sm font-medium">
                  {projects.filter(project => {
                    const projectDate = new Date(project.createdAt);
                    const now = new Date();
                    return projectDate.getMonth() === now.getMonth() && 
                           projectDate.getFullYear() === now.getFullYear();
                  }).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Draft Posts</span>
                <span className="text-sm font-medium">
                  {blogPosts.filter(post => post.status === 'draft').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Featured Projects</span>
                <span className="text-sm font-medium">
                  {projects.filter(project => project.featured).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Featured Team</span>
                <span className="text-sm font-medium">
                  {team.filter(member => member.featured).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
