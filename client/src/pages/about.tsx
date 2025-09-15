import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import StatsGrid from "@/components/ui/stats-grid";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  Rocket, 
  Shield, 
  Users, 
  Award,
  Target,
  Eye,
  Heart,
  Lightbulb,
  CheckCircle,
  Handshake
} from "lucide-react";

export default function About() {
  const { data: team } = useQuery({
    queryKey: ["/api/team"],
  });

  const companyValues = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Innovation First",
      description: "We stay ahead of technology trends, constantly exploring new frameworks, tools, and methodologies to deliver cutting-edge solutions that give our clients a competitive advantage.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality Assurance",
      description: "Every project undergoes rigorous testing and quality assurance processes. We maintain 99.7% uptime across all deployed applications and follow industry best practices for security.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client Partnership",
      description: "We believe in building long-term partnerships with our clients. Our dedicated project managers ensure clear communication, timely delivery, and ongoing support for all our solutions.",
    },
  ];

  const timeline = [
    {
      year: "2012",
      title: "Company Founded",
      description: "Started with a vision to deliver quality software solutions that transform businesses worldwide.",
      icon: <Rocket className="h-6 w-6" />,
    },
    {
      year: "2015",
      title: "First International Client",
      description: "Expanded services globally, establishing our presence in multiple countries across different continents.",
      icon: <Award className="h-6 w-6" />,
    },
    {
      year: "2018",
      title: "500+ Projects Milestone",
      description: "Achieved a major milestone of successfully delivering over 500 projects across various industries.",
      icon: <Target className="h-6 w-6" />,
    },
    {
      year: "2022",
      title: "AI/ML Practice Launch",
      description: "Added cutting-edge AI and machine learning services to help clients leverage intelligent automation.",
      icon: <Lightbulb className="h-6 w-6" />,
    },
  ];

  const coreValues = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Our Mission",
      description: "To empower businesses worldwide through innovative software solutions that drive digital transformation and sustainable growth.",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Our Vision",
      description: "To be the global leader in custom software development, setting industry standards for innovation, quality, and client satisfaction.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Our Values",
      description: "Integrity, excellence, collaboration, and continuous learning guide everything we do, ensuring we deliver exceptional value to our clients.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            About <span className="gradient-text">TechForge</span> Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Founded in 2012, we're a global software development company with a mission to help businesses 
            transform their operations through innovative technology solutions. Our team of 150+ experts 
            across 12 countries has delivered 500+ successful projects for clients ranging from startups 
            to Fortune 500 companies.
          </p>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our core values shape our culture, guide our decisions, and define how we serve our clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
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
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
                Our Foundation
              </h2>
              <div className="space-y-8">
                {coreValues.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-6">Company Highlights</h3>
                  <StatsGrid 
                    stats={[
                      { value: "150+", label: "Team Members" },
                      { value: "98%", label: "Client Satisfaction" },
                      { value: "24/7", label: "Support Available" },
                      { value: "ISO", label: "27001 Certified" },
                    ]}
                    columns={2}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From a small startup to a global software development company, here are the key milestones that shaped our growth
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border hidden md:block"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                <Card className={`w-full md:w-5/12 hover-lift ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{item.year}</div>
                        <h3 className="text-xl font-serif font-semibold text-foreground">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our diverse team of experts brings together decades of experience in software development, 
              design, and digital transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team?.map((member: any) => (
              <Card key={member.id} className="hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.position}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  
                  {/* Skills */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1">
                      {member.skills.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-muted text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Global Presence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              With offices and team members across multiple continents, we provide 24/7 support and 
              local expertise to clients worldwide
            </p>
          </div>

          <StatsGrid 
            stats={[
              { value: "12", label: "Countries" },
              { value: "5", label: "Continents" },
              { value: "24/7", label: "Support" },
              { value: "150+", label: "Team Members" },
            ]}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
