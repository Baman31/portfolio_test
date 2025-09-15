import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminSidebar from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { isUnauthorizedError } from "@/lib/authUtils";
import { api } from "@/lib/api";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MessageSquare,
  UserCheck,
  Star,
  Calendar
} from "lucide-react";

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.string().optional(),
  education: z.string().optional(),
  profileImage: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
  }).optional(),
  featured: z.boolean(),
  active: z.boolean(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

export default function AdminUsers() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab] = useState("team");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
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
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ["/api/admin/team"],
    retry: false,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/admin/leads"],
    retry: false,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      featured: false,
      active: true,
      skills: [],
      socialLinks: {},
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: (data: TeamMemberFormData) => api.admin.team.create(data),
    onSuccess: () => {
      toast({
        title: "Team member added successfully",
        description: "The team member has been created and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setIsDialogOpen(false);
      reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
        title: "Error creating team member",
        description: "Failed to create the team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TeamMemberFormData> }) => 
      api.admin.team.update(id, data),
    onSuccess: () => {
      toast({
        title: "Team member updated successfully",
        description: "The team member has been updated and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setSelectedMember(null);
      setIsDialogOpen(false);
      reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
        title: "Error updating team member",
        description: "Failed to update the team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: number) => api.admin.team.delete(id),
    onSuccess: () => {
      toast({
        title: "Team member deleted successfully",
        description: "The team member has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
        title: "Error deleting team member",
        description: "Failed to delete the team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      api.admin.leads.update(id, data),
    onSuccess: () => {
      toast({
        title: "Lead updated successfully",
        description: "The lead status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
        title: "Error updating lead",
        description: "Failed to update the lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TeamMemberFormData) => {
    if (selectedMember) {
      updateMemberMutation.mutate({ id: selectedMember.id, data });
    } else {
      createMemberMutation.mutate(data);
    }
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    reset({
      name: member.name,
      position: member.position,
      department: member.department || "",
      bio: member.bio || "",
      skills: member.skills || [],
      experience: member.experience || "",
      education: member.education || "",
      profileImage: member.profileImage || "",
      socialLinks: member.socialLinks || {},
      featured: member.featured,
      active: member.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (memberId: number) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      deleteMemberMutation.mutate(memberId);
    }
  };

  const handleNewMember = () => {
    setSelectedMember(null);
    reset({
      name: "",
      position: "",
      department: "",
      bio: "",
      skills: [],
      experience: "",
      education: "",
      profileImage: "",
      socialLinks: {},
      featured: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = watch("skills") || [];
      if (!currentSkills.includes(skillInput.trim())) {
        setValue("skills", [...currentSkills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = watch("skills") || [];
    setValue("skills", currentSkills.filter((_, i) => i !== index));
  };

  const updateLeadStatus = (leadId: number, status: string) => {
    updateLeadMutation.mutate({ id: leadId, data: { status } });
  };

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

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Users & Leads</h1>
              <p className="text-muted-foreground">Manage team members and customer leads</p>
            </div>
            <Button onClick={handleNewMember} data-testid="button-new-member">
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="team" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Team Members
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Customer Leads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teamLoading ? (
                    <div className="text-center py-8">Loading team members...</div>
                  ) : teamMembers?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.map((member: any) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {member.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-sm text-muted-foreground">{member.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{member.position}</TableCell>
                            <TableCell>{member.department || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={member.active ? 'default' : 'secondary'}>
                                {member.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {member.featured && (
                                <Star className="h-4 w-4 text-chart-3 fill-current" />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit(member)}
                                  data-testid={`edit-member-${member.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDelete(member.id)}
                                  data-testid={`delete-member-${member.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No team members yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first team member to showcase your team.
                      </p>
                      <Button onClick={handleNewMember}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Team Member
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Customer Leads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="text-center py-8">Loading leads...</div>
                  ) : leads?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contact</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead: any) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {lead.contact?.firstName} {lead.contact?.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lead.contact?.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{lead.contact?.company || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {lead.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className="text-sm border border-border rounded px-2 py-1"
                                data-testid={`lead-status-${lead.id}`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`view-lead-${lead.id}`}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No leads yet</h3>
                      <p className="text-muted-foreground">
                        Customer inquiries will appear here when submitted.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Team Member Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? 'Edit Team Member' : 'Add New Team Member'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Full name"
                  data-testid="input-name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  {...register("position")}
                  placeholder="Job title"
                  data-testid="input-position"
                />
                {errors.position && (
                  <p className="text-sm text-destructive mt-1">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register("department")}
                placeholder="Department or team"
                data-testid="input-department"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Brief biography"
                data-testid="textarea-bio"
              />
            </div>

            <div>
              <Label>Skills</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  data-testid="input-skill"
                />
                <Button type="button" onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch("skills")?.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  {...register("experience")}
                  placeholder="Years of experience"
                  data-testid="input-experience"
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  {...register("education")}
                  placeholder="Educational background"
                  data-testid="input-education"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={watch("featured")}
                  onCheckedChange={(checked) => setValue("featured", !!checked)}
                  data-testid="checkbox-featured"
                />
                <Label htmlFor="featured">Featured Member</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={watch("active")}
                  onCheckedChange={(checked) => setValue("active", !!checked)}
                  data-testid="checkbox-active"
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMemberMutation.isPending || updateMemberMutation.isPending}
                data-testid="button-save"
              >
                {createMemberMutation.isPending || updateMemberMutation.isPending 
                  ? "Saving..." 
                  : selectedMember ? "Update Member" : "Add Member"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
