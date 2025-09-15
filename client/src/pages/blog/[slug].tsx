import { useParams } from "wouter";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import BlogCard from "@/components/ui/blog-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2,
  Bookmark,
  MessageCircle,
  ThumbsUp
} from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["/api/blog"],
  });

  const { data: author } = useQuery({
    queryKey: [`/api/auth/user`],
    enabled: !!post?.authorId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-muted rounded-xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredRelatedPosts = relatedPosts?.filter((p: any) => 
    p.id !== post.id && 
    (p.categories?.some((cat: string) => post.categories?.includes(cat)) ||
     p.tags?.some((tag: string) => post.tags?.includes(tag)))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category: string) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            {author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{author.firstName} {author.lastName}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-12">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmark
            </Button>
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Like
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12">
          <div className="h-96 bg-gradient-to-br from-chart-1 to-chart-2 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <div 
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {author && (
          <Card className="mb-16">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {author.firstName?.[0]}{author.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                    {author.firstName} {author.lastName}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Software development expert and thought leader with extensive experience in modern web technologies.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">Follow</Button>
                    <Button variant="ghost" size="sm">View Profile</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-semibold text-foreground">Comments</h3>
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No comments yet. Be the first to share your thoughts!</p>
              <Button>Add Comment</Button>
            </div>
          </CardContent>
        </Card>
      </article>

      {/* Related Articles */}
      {filteredRelatedPosts && filteredRelatedPosts.length > 0 && (
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRelatedPosts.map((relatedPost: any) => (
                <BlogCard key={relatedPost.id} post={relatedPost} author={author} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card>
            <CardContent className="p-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get the latest insights and updates delivered directly to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
