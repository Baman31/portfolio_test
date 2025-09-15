import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/cards/service-card";
import { 
  Smartphone, 
  Globe, 
  Brain, 
  Cloud, 
  Shield, 
  Cog,
  Code,
  Database,
  Server,
  Cpu,
  Monitor,
  Zap
} from "lucide-react";

const services = [
  {
    title: "Custom Software Development",
    description: "Tailored software solutions built with modern technologies to meet your specific business requirements.",
    features: ["Full-stack development", "API integration", "Cloud deployment", "Scalable architecture"],
    icon: <Code className="h-8 w-8" />,
    color: "chart-1"
  },
  {
    title: "Web Application Development",
    description: "Responsive web applications with exceptional user experience using cutting-edge frameworks.",
    features: ["React & Next.js", "Progressive Web Apps", "E-commerce platforms", "Admin dashboards"],
    icon: <Globe className="h-8 w-8" />,
    color: "chart-2"
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android with superior performance.",
    features: ["React Native & Flutter", "iOS & Android Native", "App Store Optimization", "Push notifications"],
    icon: <Smartphone className="h-8 w-8" />,
    color: "chart-3"
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and migration services for AWS, Google Cloud, and Azure platforms.",
    features: ["Cloud Migration & Strategy", "DevOps & CI/CD", "Kubernetes Orchestration", "Infrastructure as Code"],
    icon: <Cloud className="h-8 w-8" />,
    color: "chart-4"
  },
  {
    title: "AI & Machine Learning",
    description: "Intelligent solutions powered by artificial intelligence to automate and optimize processes.",
    features: ["Custom AI Models", "Data Analytics", "Process Automation", "Predictive Analytics"],
    icon: <Brain className="h-8 w-8" />,
    color: "chart-5"
  },
  {
    title: "Digital Transformation",
    description: "Strategic consulting and implementation to modernize your business processes and technology.",
    features: ["Strategy Consulting", "Legacy Modernization", "Process Optimization", "Technology Assessment"],
    icon: <Cog className="h-8 w-8" />,
    color: "primary"
  }
];

const technologies = [
  { name: "React", icon: <Monitor className="h-6 w-6" />, color: "chart-1" },
  { name: "Next.js", icon: <Globe className="h-6 w-6" />, color: "chart-2" },
  { name: "TypeScript", icon: <Code className="h-6 w-6" />, color: "chart-3" },
  { name: "Node.js", icon: <Server className="h-6 w-6" />, color: "chart-4" },
  { name: "Python", icon: <Cpu className="h-6 w-6" />, color: "chart-5" },
  { name: "AWS", icon: <Cloud className="h-6 w-6" />, color: "primary" },
  { name: "Docker", icon: <Database className="h-6 w-6" />, color: "chart-1" },
  { name: "PostgreSQL", icon: <Database className="h-6 w-6" />, color: "chart-2" }
];

export default function ServicesOverview() {
  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Our <span className="gradient-text">Expertise</span> & Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From cloud architecture to AI-powered solutions, we deliver comprehensive software development 
            services that scale with your business growth.
          </p>
        </div>

        {/* Service Categories */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              features={service.features}
              icon={service.icon}
              color={service.color}
              index={index}
            />
          ))}
        </div>

        {/* Technology Stack Showcase */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
            Technologies We Master
          </h3>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our team stays at the forefront of technology, working with the latest tools and frameworks 
            to deliver cutting-edge solutions.
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-16">
          {technologies.map((tech) => (
            <div 
              key={tech.name} 
              className="tech-card bg-card p-6 rounded-xl text-center hover:shadow-md group"
              data-testid={`tech-${tech.name.toLowerCase()}`}
            >
              <div className={`w-12 h-12 bg-${tech.color}/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <div className={`text-${tech.color}`}>
                  {tech.icon}
                </div>
              </div>
              <div className="font-medium text-sm text-foreground">{tech.name}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Ready to leverage our expertise for your next project?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" data-testid="button-explore-services">
                Explore All Services
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" data-testid="button-discuss-project">
                Discuss Your Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
