import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/cards/project-card";
import { ArrowRight, FolderOpen } from "lucide-react";

const filterTabs = [
  { id: "all", name: "All Projects" },
  { id: "web", name: "Web Apps" },
  { id: "mobile", name: "Mobile Apps" },
  { id: "enterprise", name: "Enterprise" },
];

export default function PortfolioHighlights() {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects', { featured: true, limit: 6 }],
  });

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Featured <span className="gradient-text">Projects</span> & Case Studies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Discover how we've helped businesses transform their operations with innovative software solutions 
            that deliver measurable results.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeFilter === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(tab.id)}
                data-testid={`portfolio-filter-${tab.id}`}
              >
                {tab.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="mb-20">
          {isLoading ? (
            <div className="grid lg:grid-cols-2 gap-12">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-card rounded-xl overflow-hidden animate-pulse">
                  <div className="h-80 bg-muted"></div>
                  <div className="p-8">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-muted rounded-full w-16"></div>
                      <div className="h-6 bg-muted rounded-full w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-12">
              {projects.map((project: any) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No featured projects available at the moment.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8">
            Ready to see how we can transform your business with innovative software solutions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio">
              <Button size="lg" data-testid="button-view-all-projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" data-testid="button-start-project">
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
