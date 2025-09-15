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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { isUnauthorizedError } from "@/lib/authUtils";
import { api } from "@/lib/api";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Briefcase, 
  Star,
  Calendar,
  Building
} from "lucide-react";

const projectSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().optional(),
  client: z.object({
    name: z.string().min(1, "Client name is required"),
    industry: z.string().min(1, "Industry is required"),
    size: z.string().optional(),
    logo: z.string().optional(),
  }),
  technologies: z.array(z.string()),
  services: z.array(z.string()),
  timeline: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    duration: z.string().optional(),
  }).optional(),
  team: z.object({
    size: z.number().optional(),
    roles: z.array(z.string()).optional(),
    members: z.array(z.string()).optional(),
  }).optional(),
  media: z.object({
    featured: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    video: z.string().optional(),
    demo: z.string().optional(),
  }).optional(),
  featured: z.boolean(),
  status: z.enum(["active", "archived"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function AdminProjects() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

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

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
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
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      featured: false,
      status: "active",
      technologies: [],
      services: [],
      client: {
        name: "",
        industry: "",
        size: "",
        logo: "",
      },
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectFormData) => api.admin.projects.create(data),
    onSuccess: () => {
      toast({
        title: "Project created successfully",
        description: "The project has been created and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
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
        title: "Error creating project",
        description: "Failed to create the project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProjectFormData> }) => 
      api.admin.projects.update(id, data),
    onSuccess: () => {
      toast({
        title: "Project updated successfully",
        description: "The project has been updated and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setSelectedProject(null);
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
        title: "Error updating project",
        description: "Failed to update the project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => api.admin.projects.delete(id),
    onSuccess: () => {
      toast({
        title: "Project deleted successfully",
        description: "The project has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
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
        title: "Error deleting project",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    if (selectedProject) {
      updateProjectMutation.mutate({ id: selectedProject.id, data });
    } else {
      createProjectMutation.mutate(data);
    }
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    reset({
      slug: project.slug,
      title: project.title,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription || "",
      client: project.client || { name: "", industry: "", size: "", logo: "" },
      technologies: project.technologies || [],
      services: project.services || [],
      timeline: project.timeline || {},
      team: project.team || {},
      media: project.media || {},
      featured: project.featured,
      status: project.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (projectId: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    reset({
      slug: "",
      title: "",
      shortDescription: "",
      fullDescription: "",
      client: { name: "", industry: "", size: "", logo: "" },
      technologies: [],
      services: [],
      featured: false,
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      const currentTech = watch("technologies") || [];
      setValue("technologies", [...currentTech, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechnology = (index: number) => {
    const currentTech = watch("technologies") || [];
    setValue("technologies", currentTech.filter((_, i) => i !== index));
  };

  const addService = () => {
    if (serviceInput.trim()) {
      const currentServices = watch("services") || [];
      setValue("services", [...currentServices, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const removeService = (index: number) => {
    const currentServices = watch("services") || [];
    setValue("services", currentServices.filter((_, i) => i !== index));
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
              <h1 className="text-2xl font-serif font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground">Manage portfolio projects and case studies</p>
            </div>
            <Button onClick={handleNewProject} data-testid="button-new-project">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                All Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="text-center py-8">Loading projects...</div>
              ) : projects?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project: any) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-muted-foreground">
                              /{project.slug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{project.client?.name || 'Unknown'}</div>
                              <div className="text-xs text-muted-foreground">{project.client?.industry}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={project.status === 'active' ? 'default' : 'secondary'}
                            data-testid={`status-${project.id}`}
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {project.featured && (
                            <Star className="h-4 w-4 text-chart-3 fill-current" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(project)}
                              data-testid={`edit-${project.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(project.id)}
                              data-testid={`delete-${project.id}`}
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
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first project to showcase your work.
                  </p>
                  <Button onClick={handleNewProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Project title"
                  data-testid="input-title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="project-url-slug"
                  data-testid="input-slug"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                {...register("shortDescription")}
                placeholder="Brief project description"
                data-testid="textarea-short-description"
              />
              {errors.shortDescription && (
                <p className="text-sm text-destructive mt-1">{errors.shortDescription.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                {...register("fullDescription")}
                placeholder="Detailed project description"
                rows={4}
                data-testid="textarea-full-description"
              />
            </div>

            {/* Client Information */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Client Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    {...register("client.name")}
                    placeholder="Client company name"
                    data-testid="input-client-name"
                  />
                  {errors.client?.name && (
                    <p className="text-sm text-destructive mt-1">{errors.client.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="clientIndustry">Industry *</Label>
                  <Input
                    id="clientIndustry"
                    {...register("client.industry")}
                    placeholder="Client industry"
                    data-testid="input-client-industry"
                  />
                  {errors.client?.industry && (
                    <p className="text-sm text-destructive mt-1">{errors.client.industry.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <Label>Technologies</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add technology"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  data-testid="input-technology"
                />
                <Button type="button" onClick={addTechnology}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch("technologies")?.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <Label>Services</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  placeholder="Add service"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  data-testid="input-service"
                />
                <Button type="button" onClick={addService}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch("services")?.map((service, index) => (
                  <Badge key={index} variant="outline">
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(index)}
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
                <Label htmlFor="status">Status</Label>
                <Select 
                  onValueChange={(value) => setValue("status", value as any)}
                  defaultValue={watch("status")}
                >
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="featured"
                  checked={watch("featured")}
                  onCheckedChange={(checked) => setValue("featured", !!checked)}
                  data-testid="checkbox-featured"
                />
                <Label htmlFor="featured">Featured Project</Label>
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
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                data-testid="button-save"
              >
                {createProjectMutation.isPending || updateProjectMutation.isPending 
                  ? "Saving..." 
                  : selectedProject ? "Update Project" : "Create Project"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
