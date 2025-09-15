import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Users } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    slug: string;
    title: string;
    shortDescription?: string;
    clientName?: string;
    clientIndustry?: string;
    technologies?: string[];
    services?: string[];
    featuredImage?: string;
    duration?: string;
    teamSize?: number;
    results?: {
      metrics?: Array<{
        label: string;
        value: string;
        improvement?: string;
      }>;
    };
    demoUrl?: string;
    featured?: boolean;
  };
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <div className={`project-card bg-card rounded-xl overflow-hidden shadow-lg group ${featured ? 'lg:flex' : ''}`}>
      {/* Project Image */}
      <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : 'h-64'}`}>
        {project.featuredImage ? (
          <img 
            src={project.featuredImage} 
            alt={project.title}
            className="project-image w-full h-full object-cover"
            data-testid={`project-image-${project.slug}`}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              {project.clientIndustry && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {project.clientIndustry}
                </Badge>
              )}
              {project.technologies && project.technologies.slice(0, 2).map((tech, index) => (
                <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className={`p-8 ${featured ? 'lg:w-1/2' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {project.featured && (
              <Badge className="bg-primary/20 text-primary">Featured</Badge>
            )}
            {project.clientIndustry && (
              <Badge variant="outline">{project.clientIndustry}</Badge>
            )}
          </div>
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <h3 className="text-2xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        
        {project.clientName && (
          <p className="text-sm text-muted-foreground mb-3">
            Client: {project.clientName}
          </p>
        )}

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Project Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          {project.duration && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{project.duration}</span>
            </div>
          )}
          {project.teamSize && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{project.teamSize} members</span>
            </div>
          )}
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.technologies.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Results/Metrics */}
        {project.results?.metrics && project.results.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-accent/50 rounded-lg">
            {project.results.metrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="text-center">
                <div className="font-bold text-foreground">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                {metric.improvement && (
                  <div className="text-xs text-chart-2">{metric.improvement}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tech Stack:</span>
            <span className="text-sm text-foreground font-medium">
              {project.technologies?.slice(0, 2).join(' • ') || 'Various'}
            </span>
          </div>
          <Link href={`/portfolio/${project.slug}`}>
            <Button variant="outline" size="sm" data-testid={`button-view-project-${project.slug}`}>
              View Details
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
