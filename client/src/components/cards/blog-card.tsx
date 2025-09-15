import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: string;
    categories?: string[];
    tags?: string[];
    readTime?: number;
    publishedAt: string;
    author?: {
      firstName?: string;
      lastName?: string;
    };
    viewCount?: number;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
        {/* Featured Image */}
        <div className="relative h-48 overflow-hidden">
          {post.featuredImage ? (
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`blog-image-${post.slug}`}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          
          {/* Category Badge */}
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/90 text-primary-foreground">
                {post.categories[0]}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Information */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            {post.author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.author.firstName} {post.author.lastName}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {post.viewCount !== undefined && (
                <span>{post.viewCount} views</span>
              )}
            </div>
            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Read More</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
