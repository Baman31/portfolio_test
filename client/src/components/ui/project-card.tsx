import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ExternalLink, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: number;
    slug: string;
    title: string;
    shortDescription: string;
    client: {
      name: string;
      industry: string;
    };
    technologies: string[];
    services: string[];
    media: {
      featured: string;
    };
    results?: {
      metrics: Array<{
        label: string;
        value: string;
        improvement: string;
      }>;
    };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="project-card bg-card shadow-lg group">
      <div className="relative h-80 overflow-hidden rounded-t-xl">
        <div className="project-image w-full h-full bg-gradient-to-br from-chart-1 to-chart-2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-chart-1/20 text-chart-1">
                {project.client?.industry || 'Technology'}
              </Badge>
              {project.technologies.slice(0, 2).map((tech) => (
                <Badge key={tech} variant="outline" className="bg-white/20 text-white border-white/30">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-8">
        <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {project.shortDescription}
        </p>
        
        {/* Project Stats */}
        {project.results?.metrics && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-accent rounded-lg">
            {project.results.metrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="text-center">
                <div className="font-bold text-foreground">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Client:</span>
            <span className="text-sm text-foreground font-medium">
              {project.client?.name || 'Confidential'}
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/portfolio/${project.slug}`} className="inline-flex items-center">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
