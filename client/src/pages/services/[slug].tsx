import { useEffect } from "react";
import { useParams } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";

const serviceDetails: Record<string, any> = {
  "web-development": {
    title: "Web Development",
    subtitle: "Modern, scalable web applications built with cutting-edge technologies",
    description: "Our web development services encompass the full spectrum of modern web technologies. From responsive websites to complex web applications, we create digital experiences that engage users and drive business growth. Our team specializes in React, Next.js, and other modern frameworks to deliver fast, secure, and scalable solutions.",
    benefits: [
      "Responsive design that works on all devices",
      "SEO-optimized for better search rankings",
      "Fast loading times and excellent performance",
      "Scalable architecture for future growth",
      "Secure coding practices and data protection",
      "Cross-browser compatibility"
    ],
    useCases: [
      "E-commerce platforms and online stores",
      "Corporate websites and portfolios",
      "Web applications and SaaS platforms",
      "Admin dashboards and management systems",
      "Progressive Web Apps (PWAs)",
      "API development and integration"
    ],
    technologies: {
      frontend: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Python", "Express.js", "FastAPI", "GraphQL"],
      database: ["PostgreSQL", "MongoDB", "Redis", "Firebase"],
      cloud: ["AWS", "Vercel", "Google Cloud", "Azure"]
    },
    pricing: [
      {
        name: "Starter Package",
        description: "Perfect for small businesses and startups",
        features: ["Responsive design", "Basic SEO", "Contact forms", "3-month support"]
      },
      {
        name: "Professional Package",
        description: "Ideal for growing businesses",
        features: ["Advanced features", "E-commerce integration", "Analytics setup", "6-month support"]
      },
      {
        name: "Enterprise Package",
        description: "Comprehensive solution for large organizations",
        features: ["Custom development", "Advanced security", "Scalable architecture", "12-month support"]
      }
    ]
  },
  "mobile-development": {
    title: "Mobile App Development",
    subtitle: "Native and cross-platform mobile applications for iOS and Android",
    description: "We create mobile applications that deliver exceptional user experiences across iOS and Android platforms. Whether you need a native app for optimal performance or a cross-platform solution for broader reach, our team uses the latest technologies like React Native, Flutter, and native development tools to bring your mobile vision to life.",
    benefits: [
      "Native performance and user experience",
      "Cross-platform compatibility",
      "App Store and Google Play optimization",
      "Push notifications and real-time features",
      "Offline functionality support",
      "Regular updates and maintenance"
    ],
    useCases: [
      "Business and productivity apps",
      "E-commerce and shopping apps",
      "Social networking platforms",
      "Healthcare and fitness apps",
      "Financial and banking apps",
      "Entertainment and media apps"
    ],
    technologies: {
      crossPlatform: ["React Native", "Flutter", "Expo"],
      native: ["Swift", "Kotlin", "Objective-C", "Java"],
      backend: ["Firebase", "AWS Amplify", "Node.js", "GraphQL"],
      tools: ["Xcode", "Android Studio", "Figma", "TestFlight"]
    }
  },
  "cloud-solutions": {
    title: "Cloud Solutions",
    subtitle: "Scalable cloud infrastructure and migration services",
    description: "Transform your business with our comprehensive cloud solutions. We help organizations migrate to the cloud, optimize their infrastructure, and implement DevOps practices for improved efficiency and scalability. Our expertise spans AWS, Google Cloud, and Azure platforms.",
    benefits: [
      "Reduced infrastructure costs",
      "Improved scalability and flexibility",
      "Enhanced security and compliance",
      "Better disaster recovery capabilities",
      "Automated deployment and monitoring",
      "24/7 technical support"
    ],
    useCases: [
      "Legacy system migration",
      "Microservices architecture",
      "Containerization with Docker and Kubernetes",
      "CI/CD pipeline implementation",
      "Serverless application development",
      "Multi-cloud and hybrid solutions"
    ],
    technologies: {
      aws: ["EC2", "Lambda", "RDS", "S3", "CloudFormation"],
      gcp: ["Compute Engine", "Cloud Functions", "Cloud SQL", "GKE"],
      azure: ["Virtual Machines", "Azure Functions", "Azure SQL", "AKS"],
      tools: ["Docker", "Kubernetes", "Terraform", "Jenkins"]
    }
  }
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = serviceDetails[slug as string];

  useEffect(() => {
    if (service) {
      document.title = `${service.title} - TechForge Solutions`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', service.description);
    }
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
            <Link href="/services">
              <Button data-testid="button-back-to-services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
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
              <Link href="/services" className="text-muted-foreground hover:text-foreground">
                Services
              </Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-foreground">{service.title}</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {service.subtitle}
              </p>
              <Link href="/contact">
                <Button size="lg" data-testid="button-get-consultation">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Overview</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {service.description}
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {service.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Common Use Cases</h3>
                <div className="space-y-4">
                  {service.useCases.map((useCase: string, index: number) => (
                    <div key={index} className="bg-card p-4 rounded-lg">
                      <p className="text-foreground font-medium">{useCase}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-24 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
              Technologies We Use
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(service.technologies).map(([category, techs]: [string, string[]]) => (
                <div key={category} className="bg-card p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-foreground mb-4 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="space-y-2">
                    {techs.map((tech: string, index: number) => (
                      <div key={index} className="bg-background px-3 py-2 rounded-lg text-sm text-foreground">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {service.pricing && (
          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  Pricing Models
                </h2>
                <p className="text-muted-foreground">
                  Choose the package that best fits your project needs
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {service.pricing.map((pkg: any, index: number) => (
                  <div key={index} className="bg-card p-8 rounded-xl border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{pkg.name}</h3>
                    <p className="text-muted-foreground mb-6">{pkg.description}</p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-chart-2" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-24 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your {service.title.toLowerCase()} project and create a solution 
              that drives your business forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" data-testid="button-start-project-cta">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" data-testid="button-view-examples">
                  View Examples
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
