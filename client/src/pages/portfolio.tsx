import { useState } from "react";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ProjectCard from "@/components/ui/project-card";
import StatsGrid from "@/components/ui/stats-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";

export default function Portfolio() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const filterCategories = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Applications" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "enterprise", label: "Enterprise Software" },
    { id: "ecommerce", label: "E-commerce Platforms" },
    { id: "ai-ml", label: "AI/ML Solutions" },
  ];

  const filteredProjects = projects?.filter((project: any) => {
    const matchesFilter = selectedFilter === "all" || 
      project.services?.some((service: string) => 
        service.toLowerCase().includes(selectedFilter)
      ) ||
      project.technologies?.some((tech: string) => 
        tech.toLowerCase().includes(selectedFilter)
      );

    const matchesSearch = searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const portfolioStats = [
    { value: "500+", label: "Completed Projects" },
    { value: "200+", label: "Happy Clients" },
    { value: "15+", label: "Industries Served" },
    { value: "12+", label: "Years Experience" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Our <span className="gradient-text">Work</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Showcasing successful projects and client partnerships that demonstrate our expertise 
            in delivering innovative software solutions across various industries
          </p>
          
          <StatsGrid stats={portfolioStats} />
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects, clients, or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedFilter(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedFilter === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-accent"
                }`}
                data-testid={`filter-${category.id}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid lg:grid-cols-2 gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card h-96 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredProjects?.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-12">
              {filteredProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? `No projects match "${searchQuery}"` : "No projects match the selected filter"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Technologies We Use
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our expertise spans across modern frameworks, cloud platforms, and emerging technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              "React", "Next.js", "Vue.js", "Angular", "Node.js", "Python",
              "TypeScript", "JavaScript", "AWS", "Google Cloud", "Azure", "Docker",
              "Kubernetes", "PostgreSQL", "MongoDB", "Redis", "TensorFlow", "PyTorch"
            ].map((tech) => (
              <div key={tech} className="tech-card bg-card p-4 rounded-xl text-center hover:shadow-md">
                <div className="w-12 h-12 bg-chart-1/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-chart-1">{tech[0]}</span>
                </div>
                <div className="font-medium text-sm text-foreground">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Let's discuss how we can help you achieve your goals with innovative software solutions
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Get Started Today</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
