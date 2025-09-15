import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Calendar, Users, ExternalLink } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: [`/api/projects/${slug}`],
  });

  useEffect(() => {
    if (project) {
      document.title = `${project.title} - Portfolio - TechForge Solutions`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', 
        project.shortDescription || project.fullDescription?.substring(0, 160)
      );
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-muted rounded-xl mb-8"></div>
              <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/portfolio">
              <Button data-testid="button-back-to-portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="py-8 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm" data-testid="breadcrumb">
              <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                Portfolio
              </Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-foreground">{project.title}</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  {project.clientLogo && (
                    <img 
                      src={project.clientLogo} 
                      alt={`${project.clientName} logo`}
                      className="h-12 w-auto"
                    />
                  )}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
                      {project.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {project.clientName && `for ${project.clientName}`}
                    </p>
                  </div>
                </div>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {project.shortDescription}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {project.duration && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-semibold text-foreground">{project.duration}</div>
                      </div>
                    </div>
                  )}
                  {project.teamSize && (
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Team Size</div>
                        <div className="font-semibold text-foreground">{project.teamSize} members</div>
                      </div>
                    </div>
                  )}
                  {project.clientIndustry && (
                    <div>
                      <div className="text-sm text-muted-foreground">Industry</div>
                      <div className="font-semibold text-foreground">{project.clientIndustry}</div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button data-testid="button-view-live">
                        View Live Demo
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  <Link href="/contact">
                    <Button variant="outline" data-testid="button-similar-project">
                      Request Similar Project
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                {project.featuredImage ? (
                  <img 
                    src={project.featuredImage} 
                    alt={project.title}
                    className="w-full h-96 object-cover rounded-xl shadow-lg"
                    data-testid="project-featured-image"
                  />
                ) : (
                  <div className="w-full h-96 bg-muted rounded-xl flex items-center justify-center">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {/* Description */}
                {project.fullDescription && (
                  <div className="mb-12">
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                      Project Overview
                    </h2>
                    <div className="prose prose-lg text-muted-foreground" 
                         dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
                  </div>
                )}

                {/* Case Study */}
                {project.caseStudy && (
                  <div className="mb-12">
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                      Case Study
                    </h2>
                    <div className="space-y-8">
                      {project.caseStudy.challenge && (
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-3">The Challenge</h3>
                          <p className="text-muted-foreground leading-relaxed">{project.caseStudy.challenge}</p>
                        </div>
                      )}
                      {project.caseStudy.solution && (
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-3">Our Solution</h3>
                          <p className="text-muted-foreground leading-relaxed">{project.caseStudy.solution}</p>
                        </div>
                      )}
                      {project.caseStudy.implementation && (
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-3">Implementation</h3>
                          <p className="text-muted-foreground leading-relaxed">{project.caseStudy.implementation}</p>
                        </div>
                      )}
                      {project.caseStudy.results && (
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-3">Results</h3>
                          <p className="text-muted-foreground leading-relaxed">{project.caseStudy.results}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {project.gallery && project.gallery.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                      Project Gallery
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {project.gallery.map((image: string, index: number) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                          data-testid={`gallery-image-${index}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="bg-card p-6 rounded-xl mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {project.services && project.services.length > 0 && (
                  <div className="bg-card p-6 rounded-xl mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Services Provided</h3>
                    <ul className="space-y-2">
                      {project.services.map((service: string, index: number) => (
                        <li key={index} className="text-muted-foreground">• {service}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Results/Metrics */}
                {project.results && project.results.metrics && (
                  <div className="bg-card p-6 rounded-xl mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Key Results</h3>
                    <div className="space-y-4">
                      {project.results.metrics.map((metric: any, index: number) => (
                        <div key={index} className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                          <div className="text-sm text-foreground font-medium">{metric.label}</div>
                          {metric.improvement && (
                            <div className="text-xs text-muted-foreground">{metric.improvement}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial */}
                {project.testimonial && (
                  <div className="bg-card p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Client Testimonial</h3>
                    <blockquote className="text-muted-foreground italic mb-4">
                      "{project.testimonial.quote}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-foreground">{project.testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{project.testimonial.position}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Interested in a Similar Project?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can create a custom solution for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" data-testid="button-start-similar-project">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" data-testid="button-view-more-projects">
                  View More Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
