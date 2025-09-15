import { useState } from "react";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import BlogCard from "@/components/ui/blog-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, BookOpen, TrendingUp } from "lucide-react";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/blog"],
  });

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "technology", label: "Technology" },
    { id: "development", label: "Development" },
    { id: "design", label: "Design" },
    { id: "business", label: "Business" },
    { id: "tutorials", label: "Tutorials" },
    { id: "case-studies", label: "Case Studies" },
  ];

  const filteredPosts = posts?.filter((post: any) => {
    const matchesCategory = selectedCategory === "all" || 
      post.categories?.some((cat: string) => 
        cat.toLowerCase().includes(selectedCategory.toLowerCase())
      );

    const matchesSearch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag: string) => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  // Mock featured post for demo
  const featuredPost = posts?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Insights & <span className="gradient-text">Updates</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Latest thoughts on technology, industry trends, development best practices, 
            and insights from our team of experts
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-accent"
                }`}
                data-testid={`category-${category.id}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === "all" && !searchQuery && (
        <section className="pb-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-8">Featured Article</h2>
              <Card className="lg:flex overflow-hidden hover-lift">
                <div className="lg:w-1/2">
                  <div className="h-64 lg:h-full bg-gradient-to-br from-chart-1 to-chart-2 relative">
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/20 text-white">Featured</Badge>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex items-center gap-2 mb-4">
                      {featuredPost.categories?.slice(0, 2).map((category: string) => (
                        <Badge key={category} variant="outline">{category}</Badge>
                      ))}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-foreground mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{featuredPost.readTime} min read</span>
                        </div>
                      </div>
                      <Button variant="ghost" asChild>
                        <a href={`/blog/${featuredPost.slug}`}>
                          Read More →
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredPosts?.length} {filteredPosts?.length === 1 ? 'article' : 'articles'}
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card h-96 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredPosts?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts
                .filter((post: any) => post.id !== featuredPost?.id || selectedCategory !== "all" || searchQuery)
                .map((post: any) => (
                  <BlogCard key={post.id} post={post} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? `No articles match "${searchQuery}"` : "No articles in this category"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Sidebar Content */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Popular Tags */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-serif font-semibold text-foreground mb-6">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "AI", "Cloud", "DevOps", "Security", "Mobile"].map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Stay Updated</h3>
                <p className="text-muted-foreground mb-6">
                  Get the latest insights and updates delivered directly to your inbox.
                </p>
                <div className="space-y-4">
                  <Input placeholder="Enter your email" type="email" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Blog Stats */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-serif font-semibold text-foreground mb-6">Blog Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Articles</span>
                    <span className="font-semibold text-foreground">{posts?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Categories</span>
                    <span className="font-semibold text-foreground">{categories.length - 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Authors</span>
                    <span className="font-semibold text-foreground">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
