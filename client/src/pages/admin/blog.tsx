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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isUnauthorizedError } from "@/lib/authUtils";
import { api } from "@/lib/api";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar,
  User,
  Clock
} from "lucide-react";

const blogPostSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  readTime: z.number().min(1, "Read time is required"),
  status: z.enum(["draft", "published"]),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function AdminBlog() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [tagInput, setTagInput] = useState("");

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

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/admin/blog"],
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
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      status: "draft",
      categories: [],
      tags: [],
      readTime: 5,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: BlogPostFormData) => api.admin.blog.create(data),
    onSuccess: () => {
      toast({
        title: "Blog post created successfully",
        description: "The blog post has been created and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
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
        title: "Error creating blog post",
        description: "Failed to create the blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlogPostFormData> }) => 
      api.admin.blog.update(id, data),
    onSuccess: () => {
      toast({
        title: "Blog post updated successfully",
        description: "The blog post has been updated and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setSelectedPost(null);
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
        title: "Error updating blog post",
        description: "Failed to update the blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => api.admin.blog.delete(id),
    onSuccess: () => {
      toast({
        title: "Blog post deleted successfully",
        description: "The blog post has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
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
        title: "Error deleting blog post",
        description: "Failed to delete the blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogPostFormData) => {
    if (selectedPost) {
      updatePostMutation.mutate({ id: selectedPost.id, data });
    } else {
      createPostMutation.mutate(data);
    }
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    reset({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || "",
      categories: post.categories || [],
      tags: post.tags || [],
      readTime: post.readTime || 5,
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (postId: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    reset({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categories: [],
      tags: [],
      readTime: 5,
      status: "draft",
    });
    setIsDialogOpen(true);
  };

  const addCategory = () => {
    if (categoryInput.trim()) {
      const currentCategories = watch("categories") || [];
      if (!currentCategories.includes(categoryInput.trim())) {
        setValue("categories", [...currentCategories, categoryInput.trim()]);
      }
      setCategoryInput("");
    }
  };

  const removeCategory = (index: number) => {
    const currentCategories = watch("categories") || [];
    setValue("categories", currentCategories.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = watch("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = watch("tags") || [];
    setValue("tags", currentTags.filter((_, i) => i !== index));
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
              <h1 className="text-2xl font-serif font-bold text-foreground">Blog Posts</h1>
              <p className="text-muted-foreground">Manage blog articles and content</p>
            </div>
            <Button onClick={handleNewPost} data-testid="button-new-post">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                All Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="text-center py-8">Loading posts...</div>
              ) : posts?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Read Time</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post: any) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {post.excerpt}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              /{post.slug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={post.status === 'published' ? 'default' : 'secondary'}
                            data-testid={`status-${post.id}`}
                          >
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {post.categories?.slice(0, 2).map((category: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {post.categories?.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{post.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {post.readTime}m
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.publishedAt 
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : 'Not published'
                            }
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(post)}
                              data-testid={`edit-${post.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(post.id)}
                              data-testid={`delete-${post.id}`}
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">No blog posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first blog post to start sharing insights.
                  </p>
                  <Button onClick={handleNewPost}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Blog Post Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Blog post title"
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
                  placeholder="post-url-slug"
                  data-testid="input-slug"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                {...register("excerpt")}
                placeholder="Brief post summary"
                data-testid="textarea-excerpt"
              />
              {errors.excerpt && (
                <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                {...register("featuredImage")}
                placeholder="https://example.com/image.jpg"
                data-testid="input-featured-image"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="readTime">Read Time (minutes) *</Label>
                <Input
                  id="readTime"
                  type="number"
                  {...register("readTime", { valueAsNumber: true })}
                  placeholder="5"
                  data-testid="input-read-time"
                />
                {errors.readTime && (
                  <p className="text-sm text-destructive mt-1">{errors.readTime.message}</p>
                )}
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categories */}
            <div>
              <Label>Categories</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Add category"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  data-testid="input-category"
                />
                <Button type="button" onClick={addCategory}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch("categories")?.map((category, index) => (
                  <Badge key={index} variant="outline">
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  data-testid="input-tag"
                />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch("tags")?.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Content *</Label>
              <ContentEditor 
                value={watch("content")}
                onChange={(content) => setValue("content", content)}
              />
              {errors.content && (
                <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
              )}
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
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
                data-testid="button-save"
              >
                {createPostMutation.isPending || updatePostMutation.isPending 
                  ? "Saving..." 
                  : selectedPost ? "Update Post" : "Create Post"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
