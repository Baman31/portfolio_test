import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/cards/blog-card";
import { ArrowRight, FileText } from "lucide-react";

export default function BlogPreview() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/blog', { limit: 3 }],
  });

  const { data: featuredPost } = useQuery({
    queryKey: ['/api/blog', { limit: 1, featured: true }],
  });

  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Latest <span className="gradient-text">Insights</span> & Articles
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay up-to-date with the latest trends in software development, technology insights, 
            and industry best practices from our team of experts.
          </p>
        </div>

        {/* Featured Article */}
        {featuredPost && featuredPost.length > 0 && (
          <div className="mb-16">
            <article className="bg-card rounded-xl overflow-hidden shadow-lg lg:flex">
              <div className="lg:w-1/2">
                {featuredPost[0].featuredImage ? (
                  <img 
                    src={featuredPost[0].featuredImage} 
                    alt={featuredPost[0].title}
                    className="w-full h-64 lg:h-full object-cover" 
                    data-testid="featured-post-image"
                  />
                ) : (
                  <div className="w-full h-64 lg:h-full bg-muted flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">Featured</span>
                  {featuredPost[0].categories && featuredPost[0].categories.length > 0 && (
                    <span className="px-3 py-1 bg-chart-1/20 text-chart-1 text-sm font-medium rounded-full">
                      {featuredPost[0].categories[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-foreground mb-4">
                  {featuredPost[0].title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {featuredPost[0].author?.firstName?.[0] || 'A'}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {featuredPost[0].author?.firstName} {featuredPost[0].author?.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(featuredPost[0].publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Link href={`/blog/${featuredPost[0].slug}`}>
                    <Button variant="outline" data-testid="button-read-featured">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Recent Articles Grid */}
        <div className="mb-12">
          {isLoading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-card rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No blog posts available at the moment.</p>
            </div>
          )}
        </div>

        {/* View All Posts CTA */}
        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" data-testid="button-view-all-posts">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
