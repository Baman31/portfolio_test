import { useParams } from "wouter";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Users, 
  Clock,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";

export default function PortfolioDetail() {
  const { id } = useParams();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-muted rounded-xl mb-8"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-background via-card to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary">{project.client?.industry || 'Technology'}</Badge>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                {project.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {project.shortDescription}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {project.client && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <div className="font-medium text-foreground">{project.client.name}</div>
                      <div className="text-sm text-muted-foreground">{project.client.industry}</div>
                    </div>
                  </div>
                )}
                
                {project.timeline && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <div className="font-medium text-foreground">Duration</div>
                      <div className="text-sm text-muted-foreground">{project.timeline.duration}</div>
                    </div>
                  </div>
                )}
                
                {project.team && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <div className="font-medium text-foreground">Team Size</div>
                      <div className="text-sm text-muted-foreground">{project.team.size} members</div>
                    </div>
                  </div>
                )}
              </div>

              {project.media?.demo && (
                <Button size="lg" asChild>
                  <a href={project.media.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Live Demo
                  </a>
                </Button>
              )}
            </div>
            
            <div className="relative">
              <div className="h-96 bg-gradient-to-br from-chart-1 to-chart-2 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 4).map((tech: string) => (
                      <Badge key={tech} variant="outline" className="bg-white/20 text-white border-white/30">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Challenge */}
            {project.caseStudy?.challenge && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">The Challenge</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.caseStudy.challenge}</p>
                </CardContent>
              </Card>
            )}

            {/* Solution */}
            {project.caseStudy?.solution && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">Our Solution</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.caseStudy.solution}</p>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {project.caseStudy?.results && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">Results Achieved</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.caseStudy.results}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Results Metrics */}
      {project.results?.metrics && project.results.metrics.length > 0 && (
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Project Results
              </h2>
              <p className="text-xl text-muted-foreground">
                Measurable impact delivered through innovative solutions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {project.results.metrics.map((metric: any, index: number) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-chart-2/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-chart-2" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                    <div className="text-lg font-semibold text-foreground mb-2">{metric.label}</div>
                    <div className="text-sm text-muted-foreground">{metric.improvement}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Used */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
                Technical Implementation
              </h2>
              
              {project.caseStudy?.implementation && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Implementation Approach</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.caseStudy.implementation}</p>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {project.services && project.services.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Services Provided</h3>
                    <ul className="space-y-3">
                      {project.services.map((service: string) => (
                        <li key={service} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-chart-2 mr-3" />
                          <span className="text-foreground">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {project.results?.testimonial && (
        <section className="py-20 bg-card/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card>
              <CardContent className="p-12">
                <Award className="h-12 w-12 text-chart-3 mx-auto mb-6" />
                <blockquote className="text-2xl font-medium text-foreground mb-8 italic">
                  "{project.results.testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-foreground text-lg">{project.results.testimonial.author}</div>
                  <div className="text-muted-foreground">{project.results.testimonial.position}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Let's discuss how we can help you achieve similar results with innovative software solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/portfolio">View More Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
