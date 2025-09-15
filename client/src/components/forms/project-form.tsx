import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  clientName: z.string().optional(),
  clientIndustry: z.string().optional(),
  clientSize: z.enum(["startup", "sme", "enterprise"]).optional(),
  technologies: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  duration: z.string().optional(),
  teamSize: z.number().int().positive().optional(),
  featuredImage: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["active", "archived"]).default("active"),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: any;
  onSuccess: () => void;
}

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const [newTechnology, setNewTechnology] = useState("");
  const [newService, setNewService] = useState("");

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      shortDescription: project?.shortDescription || "",
      fullDescription: project?.fullDescription || "",
      clientName: project?.clientName || "",
      clientIndustry: project?.clientIndustry || "",
      clientSize: project?.clientSize || undefined,
      technologies: project?.technologies || [],
      services: project?.services || [],
      duration: project?.duration || "",
      teamSize: project?.teamSize || undefined,
      featuredImage: project?.featuredImage || "",
      demoUrl: project?.demoUrl || "",
      featured: project?.featured || false,
      status: project?.status || "active",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const url = project 
        ? `/api/admin/projects/${project.id}` 
        : "/api/admin/projects";
      const method = project ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: project ? "Project updated successfully" : "Project created successfully",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
      console.error("Project form error:", error);
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    mutation.mutate(data);
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      const current = form.getValues("technologies");
      if (!current.includes(newTechnology.trim())) {
        form.setValue("technologies", [...current, newTechnology.trim()]);
      }
      setNewTechnology("");
    }
  };

  const removeTechnology = (tech: string) => {
    const current = form.getValues("technologies");
    form.setValue("technologies", current.filter(t => t !== tech));
  };

  const addService = () => {
    if (newService.trim()) {
      const current = form.getValues("services");
      if (!current.includes(newService.trim())) {
        form.setValue("services", [...current, newService.trim()]);
      }
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    const current = form.getValues("services");
    form.setValue("services", current.filter(s => s !== service));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="E-commerce Platform" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!project) {
                        form.setValue("slug", generateSlug(e.target.value));
                      }
                    }}
                    data-testid="input-title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="e-commerce-platform" {...field} data-testid="input-slug" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief project overview..."
                  rows={3}
                  {...field}
                  data-testid="textarea-short-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed project description..."
                  rows={6}
                  {...field}
                  data-testid="textarea-full-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Client Company" {...field} data-testid="input-client-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientIndustry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Technology" {...field} data-testid="input-client-industry" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-client-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="sme">SME</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Duration</FormLabel>
                <FormControl>
                  <Input placeholder="6 months" {...field} data-testid="input-duration" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="5" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    data-testid="input-team-size"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="featuredImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} data-testid="input-featured-image" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="demoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} data-testid="input-demo-url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Technologies */}
        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add technology"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    data-testid="input-new-technology"
                  />
                  <Button 
                    type="button" 
                    onClick={addTechnology}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Services */}
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services Provided</FormLabel>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add service"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    data-testid="input-new-service"
                  />
                  <Button 
                    type="button" 
                    onClick={addService}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value.map((service, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {service}
                      <button
                        type="button"
                        onClick={() => removeService(service)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-featured"
                  />
                </FormControl>
                <FormLabel>Featured Project</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-32" data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            data-testid="button-save-project"
          >
            {mutation.isPending ? "Saving..." : (project ? "Update Project" : "Create Project")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
