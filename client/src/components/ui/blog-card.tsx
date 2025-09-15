import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, Clock, User } from "lucide-react";

interface BlogCardProps {
  post: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    featuredImage?: string;
    categories: string[];
    tags: string[];
    readTime: number;
    publishedAt: string;
    authorId: string;
  };
  author?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function BlogCard({ post, author }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover-lift group cursor-pointer" asChild>
      <Link href={`/blog/${post.slug}`}>
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-chart-1 to-chart-2 relative rounded-t-lg">
            <div className="absolute top-4 left-4">
              {post.categories.length > 0 && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {post.categories[0]}
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                {author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{author.firstName} {author.lastName}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
