import { useEffect } from "react";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/ui/hero-section";
import ServiceCard from "@/components/ui/service-card";
import ProjectCard from "@/components/ui/project-card";
import TestimonialCard from "@/components/ui/testimonial-card";
import ContactForm from "@/components/ui/contact-form";
import StatsGrid from "@/components/ui/stats-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Rocket, 
  Globe, 
  Smartphone, 
  Cloud, 
  Shield, 
  Brain,
  Star,
  ArrowRight,
  Code,
  Users,
  Zap,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  const { data: featuredProjects } = useQuery({
    queryKey: ["/api/projects/featured"],
  });

  const { data: featuredTeam } = useQuery({
    queryKey: ["/api/team/featured"],
  });

  const services = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile apps that deliver exceptional user experiences across iOS and Android.",
      features: ["React Native & Flutter", "iOS & Android Native", "Progressive Web Apps"],
      color: "primary",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Web Development", 
      description: "Modern web applications built with the latest technologies for performance, scalability, and user engagement.",
      features: ["Next.js & React", "Node.js & Python", "Cloud Architecture"],
      color: "chart-1",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI & Machine Learning",
      description: "Intelligent solutions powered by artificial intelligence and machine learning to automate and optimize business processes.",
      features: ["Custom AI Models", "Data Analytics", "Process Automation"],
      color: "chart-2",
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and migration services to ensure your applications perform at their best.",
      features: ["AWS & Azure", "DevOps & CI/CD", "Infrastructure as Code"],
      color: "chart-3",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets and ensure compliance with industry standards.",
      features: ["Security Audits", "Penetration Testing", "Compliance Solutions"],
      color: "chart-4",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Digital Transformation",
      description: "Strategic consulting and implementation to modernize your business processes and technology stack.",
      features: ["Strategy Consulting", "Legacy Modernization", "Process Optimization"],
      color: "chart-5",
    },
  ];

  const testimonials = [
    {
      quote: "TechForge transformed our entire e-commerce infrastructure. Their team's expertise and dedication resulted in a 300% increase in our online sales within the first quarter.",
      rating: 5,
      author: "Sarah Anderson",
      position: "CEO, RetailMax Global",
      avatar: "SA",
    },
    {
      quote: "The mobile banking app they developed for us has received outstanding user feedback. The security features and user experience are best-in-class.",
      rating: 5,
      author: "Michael Rodriguez", 
      position: "CTO, SecureBank Solutions",
      avatar: "MR",
    },
    {
      quote: "Their AI-powered healthcare platform has revolutionized our patient care process. We've seen a 50% improvement in diagnostic accuracy and patient satisfaction.",
      rating: 5,
      author: "Dr. Emily Chen",
      position: "Director, MedTech Innovations",
      avatar: "EC",
    },
  ];

  const stats = [
    { value: "500+", label: "Projects Delivered" },
    { value: "200+", label: "Global Clients" },
    { value: "12+", label: "Years Experience" },
    { value: "150+", label: "Team Members" },
  ];

  const companyValues = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Innovation First",
      description: "We stay ahead of technology trends, constantly exploring new frameworks and methodologies to deliver cutting-edge solutions.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality Assurance",
      description: "Every project undergoes rigorous testing and quality assurance processes. We maintain 99.7% uptime across all deployed applications.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client Partnership",
      description: "We believe in building long-term partnerships with our clients through clear communication, timely delivery, and ongoing support.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-heading-mobile md:text-heading-tablet lg:text-heading-desktop font-serif font-bold text-foreground mb-6">
              Our <span className="gradient-text">Expertise</span> & Services
            </h2>
            <p className="text-body-mobile md:text-body-tablet lg:text-body-desktop text-muted-foreground max-w-3xl mx-auto">
              From cloud architecture to AI-powered solutions, we deliver comprehensive software development 
              services that scale with your business growth.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          {/* Technology Stack */}
          <div className="text-center mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Technologies We Master
            </h3>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our team stays at the forefront of technology, working with the latest tools and frameworks 
              to deliver cutting-edge solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
            {['React', 'Next.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL'].map((tech) => (
              <div key={tech} className="tech-card bg-card p-6 rounded-xl text-center hover:shadow-md">
                <div className="w-12 h-12 bg-chart-1/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-chart-1">{tech[0]}</span>
                </div>
                <div className="font-medium text-sm text-foreground">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-heading-mobile md:text-heading-tablet lg:text-heading-desktop font-serif font-bold text-foreground mb-6">
              Featured <span className="gradient-text">Projects</span> & Case Studies
            </h2>
            <p className="text-body-mobile md:text-body-tablet lg:text-body-desktop text-muted-foreground max-w-3xl mx-auto mb-12">
              Discover how we've helped businesses transform their operations with innovative software solutions 
              that deliver measurable results.
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
              <Badge variant="default" className="px-6 py-2">All Projects</Badge>
              <Badge variant="secondary" className="px-6 py-2">Web Applications</Badge>
              <Badge variant="secondary" className="px-6 py-2">Mobile Apps</Badge>
              <Badge variant="secondary" className="px-6 py-2">Enterprise Solutions</Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20">
            {featuredProjects?.slice(0, 4).map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-8">
              Ready to see how we can transform your business with innovative software solutions?
            </p>
            <Link href="/contact">
              <Button size="lg" className="inline-flex items-center">
                Start Your Project Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-heading-mobile md:text-heading-tablet lg:text-heading-desktop font-serif font-bold text-foreground mb-6">
              About <span className="gradient-text">TechForge</span> Solutions
            </h2>
            <p className="text-body-mobile md:text-body-tablet lg:text-body-desktop text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Founded in 2012, we're a global software development company with a mission to help businesses 
              transform their operations through innovative technology solutions. Our team of 150+ experts 
              across 12 countries has delivered 500+ successful projects for clients ranging from startups 
              to Fortune 500 companies.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-24">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-chart-1/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-chart-1">
                  {value.icon}
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Leadership Team */}
          <div className="text-center mb-16">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Meet Our Leadership Team
            </h3>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our experienced leadership team combines decades of industry expertise with a passion 
              for innovation and client success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20">
            {featuredTeam?.map((member: any) => (
              <div key={member.id} className="text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl">
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                </div>
                <h4 className="text-xl font-serif font-semibold text-foreground mb-2">{member.name}</h4>
                <p className="text-primary font-medium mb-2">{member.position}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
              </div>
            ))}
          </div>

          {/* Global Presence */}
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
              Global Presence
            </h3>
            <StatsGrid stats={[
              { value: "12", label: "Countries" },
              { value: "5", label: "Continents" },
              { value: "24/7", label: "Support" },
              { value: "150+", label: "Team Members" },
            ]} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-heading-mobile md:text-heading-tablet lg:text-heading-desktop font-serif font-bold text-foreground mb-6">
              What Our <span className="gradient-text">Clients</span> Say
            </h2>
            <p className="text-body-mobile md:text-body-tablet lg:text-body-desktop text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what industry leaders and business owners 
              have to say about working with TechForge Solutions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>

          {/* Client Logos */}
          <div className="text-center mb-12">
            <p className="text-muted-foreground mb-8">Trusted by leading companies worldwide</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-8 items-center opacity-60">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="bg-muted w-32 h-16 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground font-semibold">Client Logo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-heading-mobile md:text-heading-tablet lg:text-heading-desktop font-serif font-bold text-foreground mb-6">
              Latest <span className="gradient-text">Insights</span> & Articles
            </h2>
            <p className="text-body-mobile md:text-body-tablet lg:text-body-desktop text-muted-foreground max-w-3xl mx-auto">
              Stay up-to-date with the latest trends in software development, technology insights, 
              and industry best practices from our team of experts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {[
              {
                title: "The Future of AI in Software Development: Trends for 2024",
                excerpt: "Explore how artificial intelligence is revolutionizing software development workflows, from automated code generation to intelligent testing frameworks.",
                author: "Sarah Wilson",
                date: "Dec 15, 2024",
                readTime: "8 min read",
                category: "Technology",
              },
              {
                title: "Microservices Architecture: Best Practices for 2024",
                excerpt: "Learn the essential patterns and practices for building scalable microservices architecture that can handle enterprise-level demands.",
                author: "Michael Chen",
                date: "Dec 12, 2024",
                readTime: "8 min read",
                category: "Cloud",
              },
              {
                title: "Zero Trust Security in Modern Web Applications",
                excerpt: "Implementing zero trust architecture principles in web applications to ensure maximum security in today's distributed computing environment.",
                author: "David Rodriguez",
                date: "Dec 8, 2024",
                readTime: "15 min read",
                category: "Security",
              },
            ].map((post, index) => (
              <Card key={index} className="hover-lift group">
                <div className="h-48 bg-gradient-to-br from-chart-1 to-chart-2 relative rounded-t-lg">
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="text-muted-foreground">{post.author}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{post.readTime}</span>
                    </div>
                    <span className="text-muted-foreground">{post.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline" className="inline-flex items-center">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-heading-mobile md:text-heading-tablet lg:text-heading-desktop font-serif font-bold text-foreground mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </h2>
            <p className="text-body-mobile md:text-body-tablet lg:text-body-desktop text-muted-foreground max-w-3xl mx-auto">
              Let's discuss your project and see how our expertise can help you achieve your goals. 
              Get in touch with our team for a free consultation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <ContactForm />
            
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Locations */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-serif font-semibold mb-6">Our Offices</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-chart-1/10 text-chart-1 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">🇺🇸 New York (Headquarters)</h4>
                        <p className="text-muted-foreground text-sm">
                          123 Tech Avenue, Suite 500<br />
                          New York, NY 10001<br />
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-chart-2/10 text-chart-2 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">🇬🇧 London</h4>
                        <p className="text-muted-foreground text-sm">
                          45 Innovation Street<br />
                          London, UK EC2A 4DP<br />
                          +44 20 7123 4567
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-chart-3/10 text-chart-3 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">🇸🇬 Singapore</h4>
                        <p className="text-muted-foreground text-sm">
                          88 Marina Bay Drive<br />
                          Singapore 018956<br />
                          +65 6123 4567
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-serif font-semibold mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-muted-foreground">hello@techforge.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-chart-2/10 text-chart-2 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-chart-4/10 text-chart-4 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Business Hours</p>
                        <p className="text-muted-foreground">Mon - Fri: 9AM - 6PM EST</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
