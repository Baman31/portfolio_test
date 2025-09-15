import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminSidebar from "@/components/admin/sidebar";
import ContentEditor from "@/components/admin/content-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isUnauthorizedError } from "@/lib/authUtils";
import { api } from "@/lib/api";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Eye,
  Calendar,
  User
} from "lucide-react";

const pageSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  content: z.any().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

type PageFormData = z.infer<typeof pageSchema>;

export default function AdminContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ["/api/admin/pages"],
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
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      status: "draft",
    },
  });

  const createPageMutation = useMutation({
    mutationFn: (data: PageFormData) => api.admin.pages.create(data),
    onSuccess: () => {
      toast({
        title: "Page created successfully",
        description: "The page has been created and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
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
        title: "Error creating page",
        description: "Failed to create the page. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PageFormData> }) => 
      api.admin.pages.update(id, data),
    onSuccess: () => {
      toast({
        title: "Page updated successfully",
        description: "The page has been updated and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setSelectedPage(null);
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
        title: "Error updating page",
        description: "Failed to update the page. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: number) => api.admin.pages.delete(id),
    onSuccess: () => {
      toast({
        title: "Page deleted successfully",
        description: "The page has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
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
        title: "Error deleting page",
        description: "Failed to delete the page. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PageFormData) => {
    if (selectedPage) {
      updatePageMutation.mutate({ id: selectedPage.id, data });
    } else {
      createPageMutation.mutate(data);
    }
  };

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    reset({
      slug: page.slug,
      title: page.title,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      content: page.content,
      status: page.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (pageId: number) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deletePageMutation.mutate(pageId);
    }
  };

  const handleNewPage = () => {
    setSelectedPage(null);
    reset({
      slug: "",
      title: "",
      metaTitle: "",
      metaDescription: "",
      content: {},
      status: "draft",
    });
    setIsDialogOpen(true);
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
              <h1 className="text-2xl font-serif font-bold text-foreground">Content Management</h1>
              <p className="text-muted-foreground">Manage website pages and content</p>
            </div>
            <Button onClick={handleNewPage} data-testid="button-new-page">
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pagesLoading ? (
                <div className="text-center py-8">Loading pages...</div>
              ) : pages?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page: any) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            /{page.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={page.status === 'published' ? 'default' : 'secondary'}
                            data-testid={`status-${page.id}`}
                          >
                            {page.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(page.updatedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(page)}
                              data-testid={`edit-${page.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(page.id)}
                              data-testid={`delete-${page.id}`}
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
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No pages yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first page to get started with content management.
                  </p>
                  <Button onClick={handleNewPage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Page
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPage ? 'Edit Page' : 'Create New Page'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Page title"
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
                  placeholder="page-url-slug"
                  data-testid="input-slug"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                {...register("metaTitle")}
                placeholder="SEO title"
                data-testid="input-meta-title"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                {...register("metaDescription")}
                placeholder="SEO description"
                data-testid="textarea-meta-description"
              />
            </div>

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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Content</Label>
              <ContentEditor 
                value={watch("content")}
                onChange={(content) => setValue("content", content)}
              />
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
                disabled={createPageMutation.isPending || updatePageMutation.isPending}
                data-testid="button-save"
              >
                {createPageMutation.isPending || updatePageMutation.isPending 
                  ? "Saving..." 
                  : selectedPage ? "Update Page" : "Create Page"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
