import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";
import AdminLayout from "@/components/layout/admin-layout";
import TeamForm from "@/components/forms/team-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Star,
  Mail,
  Linkedin
} from "lucide-react";

export default function AdminTeam() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['/api/admin/team'],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  useEffect(() => {
    document.title = "Team Management - Admin - TechForge Solutions";
  }, []);

  const departments = [...new Set(teamMembers?.map((member: any) => member.department).filter(Boolean))] || [];

  const filteredMembers = teamMembers?.filter((member: any) =>
    (member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
     member.department?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!departmentFilter || member.department === departmentFilter)
  ) || [];

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setSelectedMember(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: any) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
    queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
  };

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage team members and their profiles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} data-testid="button-add-member">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedMember ? 'Edit Team Member' : 'Add New Team Member'}
                </DialogTitle>
              </DialogHeader>
              <TeamForm 
                member={selectedMember} 
                onSuccess={handleFormSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-members"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={departmentFilter === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDepartmentFilter("")}
                >
                  All
                </Button>
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={departmentFilter === dept ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDepartmentFilter(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member: any) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="relative mb-4">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={`${member.name} avatar`}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                          data-testid={`member-avatar-${member.id}`}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white font-bold text-lg">
                          {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`member-name-${member.id}`}>
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-2">
                      {member.position}
                    </p>
                    
                    {member.department && (
                      <Badge variant="outline" className="mb-3">
                        {member.department}
                      </Badge>
                    )}

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Experience */}
                    {member.experience && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {member.experience} experience
                      </p>
                    )}

                    {/* Expertise */}
                    {member.expertise && member.expertise.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {member.expertise.slice(0, 3).map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.expertise.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.expertise.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Badge variant={member.isPublic ? 'default' : 'secondary'}>
                        {member.isPublic ? 'Public' : 'Private'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Social Links */}
                    {member.socialLinks && (
                      <div className="flex justify-center space-x-2 mb-4">
                        {member.socialLinks.email && (
                          <a 
                            href={`mailto:${member.socialLinks.email}`}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                        {member.socialLinks.linkedin && (
                          <a 
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                        data-testid={`button-edit-${member.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id, member.name)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${member.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Team Members Found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || departmentFilter 
                        ? 'No team members match your search criteria.' 
                        : 'Get started by adding your first team member.'
                      }
                    </p>
                    <Button onClick={openCreateDialog} data-testid="button-add-first-member">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
