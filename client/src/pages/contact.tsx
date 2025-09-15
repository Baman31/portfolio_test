import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/ui/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Users,
  Globe
} from "lucide-react";

export default function Contact() {
  const offices = [
    {
      country: "🇺🇸 United States",
      city: "New York",
      address: "123 Tech Avenue, Suite 500\nNew York, NY 10001",
      phone: "+1 (555) 123-4567",
      timezone: "EST",
    },
    {
      country: "🇬🇧 United Kingdom", 
      city: "London",
      address: "45 Innovation Street\nLondon, UK EC2A 4DP",
      phone: "+44 20 7123 4567",
      timezone: "GMT",
    },
    {
      country: "🇸🇬 Singapore",
      city: "Singapore",
      address: "88 Marina Bay Drive\nSingapore 018956",
      phone: "+65 6123 4567",
      timezone: "SGT",
    },
  ];

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "hello@techforge.com",
      action: "mailto:hello@techforge.com",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      description: "Call us during business hours for immediate assistance",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with our team in real-time during business hours",
      contact: "Available on our website",
      action: "#",
    },
  ];

  const businessHours = [
    { location: "New York", hours: "Mon - Fri: 9AM - 6PM EST" },
    { location: "London", hours: "Mon - Fri: 9AM - 6PM GMT" },
    { location: "Singapore", hours: "Mon - Fri: 9AM - 6PM SGT" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Ready to transform your ideas into reality? Let's discuss your project and explore 
            how our expertise can help you achieve your goals
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24h</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">12+</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the communication method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">{method.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{method.description}</p>
                  <div className="font-semibold text-foreground mb-4">{method.contact}</div>
                  <a
                    href={method.action}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Contact Now
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Locations */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-serif font-semibold mb-6 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Our Global Offices
                  </h3>
                  <div className="space-y-6">
                    {offices.map((office, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-chart-1/10 text-chart-1 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{office.country}</h4>
                          <p className="text-muted-foreground text-sm whitespace-pre-line">
                            {office.address}
                          </p>
                          <p className="text-sm text-primary mt-1">{office.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-serif font-semibold mb-6 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Business Hours
                  </h3>
                  <div className="space-y-4">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{schedule.location}</span>
                        <span className="text-muted-foreground text-sm">{schedule.hours}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        For urgent matters outside business hours, please email us and we'll respond as soon as possible.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Information */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-serif font-semibold mb-6 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Support & Services
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Sales Inquiries</h4>
                      <p className="text-sm text-muted-foreground">
                        Questions about our services, pricing, or project timelines
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Technical Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Support for existing clients and ongoing projects
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Partnership Opportunities</h4>
                      <p className="text-sm text-muted-foreground">
                        Strategic partnerships, referrals, and collaboration opportunities
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Career Inquiries</h4>
                      <p className="text-sm text-muted-foreground">
                        Join our team of talented developers and designers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about our services and process
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary based on complexity and scope. Simple websites typically take 4-6 weeks, while complex applications can take 3-6 months. We provide detailed timelines during our initial consultation."
              },
              {
                question: "What is your pricing structure?",
                answer: "We offer flexible pricing models including fixed-price projects, time & materials, and dedicated team arrangements. Pricing depends on project scope, complexity, and timeline requirements."
              },
              {
                question: "Do you provide ongoing support and maintenance?",
                answer: "Yes, we offer comprehensive support and maintenance packages to ensure your application continues to perform optimally. This includes bug fixes, security updates, and feature enhancements."
              },
              {
                question: "Can you work with our existing team?",
                answer: "Absolutely! We frequently collaborate with in-house teams and can provide team augmentation services or work as an extension of your existing development team."
              },
              {
                question: "What technologies do you specialize in?",
                answer: "We specialize in modern web technologies including React, Next.js, Node.js, Python, cloud platforms (AWS, Azure, GCP), and emerging technologies like AI/ML and blockchain."
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
