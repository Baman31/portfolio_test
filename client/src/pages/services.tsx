import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ServiceCard from "@/components/ui/service-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Smartphone, 
  Globe, 
  Brain, 
  Cloud, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Search,
  Paintbrush,
  Code,
  Rocket
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile apps that deliver exceptional user experiences across iOS and Android platforms.",
      features: ["React Native & Flutter", "iOS & Android Native", "Progressive Web Apps"],
      color: "primary",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
      useCases: [
        "E-commerce mobile applications",
        "Social networking platforms", 
        "Business productivity apps",
        "Real-time messaging systems"
      ],
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Web Development",
      description: "Modern web applications built with the latest technologies for performance, scalability, and user engagement.",
      features: ["Next.js & React", "Node.js & Python", "Cloud Architecture"],
      color: "chart-1",
      technologies: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "Python"],
      useCases: [
        "Enterprise web applications",
        "E-commerce platforms",
        "Content management systems",
        "Real-time dashboards"
      ],
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI & Machine Learning",
      description: "Intelligent solutions powered by artificial intelligence and machine learning to automate and optimize business processes.",
      features: ["Custom AI Models", "Data Analytics", "Process Automation"],
      color: "chart-2",
      technologies: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenAI", "Hugging Face"],
      useCases: [
        "Predictive analytics",
        "Natural language processing",
        "Computer vision applications",
        "Recommendation systems"
      ],
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and migration services to ensure your applications perform at their best.",
      features: ["AWS & Azure", "DevOps & CI/CD", "Infrastructure as Code"],
      color: "chart-3",
      technologies: ["AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform"],
      useCases: [
        "Cloud migration strategies",
        "Serverless architectures",
        "Auto-scaling solutions",
        "Disaster recovery planning"
      ],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets and ensure compliance with industry standards.",
      features: ["Security Audits", "Penetration Testing", "Compliance Solutions"],
      color: "chart-4",
      technologies: ["OAuth", "JWT", "SSL/TLS", "OWASP", "ISO 27001"],
      useCases: [
        "Security vulnerability assessments",
        "Compliance auditing",
        "Identity and access management",
        "Data encryption solutions"
      ],
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Digital Transformation",
      description: "Strategic consulting and implementation to modernize your business processes and technology stack.",
      features: ["Strategy Consulting", "Legacy Modernization", "Process Optimization"],
      color: "chart-5",
      technologies: ["Microservices", "API Gateway", "Event-Driven Architecture"],
      useCases: [
        "Legacy system modernization",
        "Business process automation",
        "Digital strategy consulting",
        "Technology roadmap planning"
      ],
    },
  ];

  const developmentProcess = [
    {
      number: "01",
      title: "Discovery & Planning",
      description: "Requirements gathering, stakeholder interviews, and comprehensive project planning to ensure alignment with business goals.",
      icon: <Search className="h-8 w-8" />,
    },
    {
      number: "02",
      title: "Design & Architecture",
      description: "UI/UX design, system architecture planning, and technical specification documentation for optimal user experience.",
      icon: <Paintbrush className="h-8 w-8" />,
    },
    {
      number: "03",
      title: "Development & Testing",
      description: "Agile development methodology with continuous integration, automated testing, and regular client feedback incorporation.",
      icon: <Code className="h-8 w-8" />,
    },
    {
      number: "04",
      title: "Deployment & Support",
      description: "Production deployment, performance monitoring, ongoing maintenance, and continuous improvement support.",
      icon: <Rocket className="h-8 w-8" />,
    },
  ];

  const pricingModels = [
    {
      name: "Time & Materials",
      description: "Flexible hourly-based pricing model ideal for projects with evolving requirements and ongoing development needs.",
      bestFor: "Evolving requirements, ongoing development",
      features: [
        "Hourly billing structure",
        "Flexible scope adjustments",
        "Regular progress reports",
        "Transparent time tracking"
      ],
    },
    {
      name: "Fixed Price",
      description: "Predetermined project cost based on well-defined scope and requirements for predictable budget planning.",
      bestFor: "Well-defined projects, fixed budgets",
      features: [
        "Predetermined total cost",
        "Clear scope definition",
        "Milestone-based payments",
        "Detailed project timeline"
      ],
    },
    {
      name: "Dedicated Team",
      description: "Extended team augmentation with dedicated developers working exclusively on your project for long-term partnerships.",
      bestFor: "Long-term partnerships, team extension",
      features: [
        "Dedicated team members",
        "Full-time commitment",
        "Direct team communication",
        "Scalable team size"
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive software development solutions that transform businesses and create lasting impact in the digital world
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Our Expertise
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial concept to final deployment, we provide end-to-end software development services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-${service.color}/20 rounded-xl flex items-center justify-center mb-6 text-${service.color}`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Common Use Cases</h4>
                    <ul className="space-y-1">
                      {service.useCases.map((useCase, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Our Development Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery from concept to deployment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developmentProcess.map((step, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary">
                    {step.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{step.number}</div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Flexible Pricing Models
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the pricing model that best fits your project requirements and business goals
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingModels.map((model, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">{model.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{model.description}</p>
                  
                  <div className="mb-6">
                    <Badge variant="secondary" className="mb-4">
                      Best for: {model.bestFor}
                    </Badge>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {model.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-chart-2 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button variant="outline" className="w-full">
                    Discuss This Model
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Let's discuss your project requirements and explore how our expertise can help you achieve your goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/portfolio">
                View Our Work
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
