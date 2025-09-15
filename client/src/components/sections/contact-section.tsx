import ContactForm from "@/components/forms/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  Clock, 
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Dribbble
} from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Ready to <span className="gradient-text">Transform</span> Your Business?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Let's discuss your project and see how our expertise can help you achieve your goals. 
            Get in touch with our team for a free consultation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information & Offices */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground mt-1">Available 24/7 for urgent inquiries</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-chart-2/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground">hello@techforge.com</p>
                    <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-chart-3/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-chart-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Business Hours</h4>
                    <p className="text-muted-foreground">Monday - Friday</p>
                    <p className="text-sm text-muted-foreground mt-1">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Our Offices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-primary mr-2" />
                    <h4 className="font-semibold text-foreground">🇺🇸 New York (Headquarters)</h4>
                  </div>
                  <p className="text-muted-foreground text-sm ml-6">
                    123 Tech Avenue, Suite 500<br />
                    New York, NY 10001<br />
                    +1 (555) 123-4567
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-primary mr-2" />
                    <h4 className="font-semibold text-foreground">🇬🇧 London</h4>
                  </div>
                  <p className="text-muted-foreground text-sm ml-6">
                    45 Innovation Street<br />
                    London, UK EC2A 4DP<br />
                    +44 20 7123 4567
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-primary mr-2" />
                    <h4 className="font-semibold text-foreground">🇸🇬 Singapore</h4>
                  </div>
                  <p className="text-muted-foreground text-sm ml-6">
                    88 Marina Bay Drive<br />
                    Singapore 018956<br />
                    +65 6123 4567
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a 
                    href="https://linkedin.com/company/techforge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-chart-1/10 text-chart-1 rounded-lg flex items-center justify-center hover:bg-chart-1 hover:text-white transition-colors"
                    aria-label="Follow us on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://twitter.com/techforge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-chart-2/10 text-chart-2 rounded-lg flex items-center justify-center hover:bg-chart-2 hover:text-white transition-colors"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://github.com/techforge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-chart-3/10 text-chart-3 rounded-lg flex items-center justify-center hover:bg-chart-3 hover:text-white transition-colors"
                    aria-label="Follow us on GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://dribbble.com/techforge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-chart-4/10 text-chart-4 rounded-lg flex items-center justify-center hover:bg-chart-4 hover:text-white transition-colors"
                    aria-label="Follow us on Dribbble"
                  >
                    <Dribbble className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
