import { useQuery } from "@tanstack/react-query";
import TestimonialCard from "@/components/cards/testimonial-card";
import { Star, Users } from "lucide-react";

// Mock testimonials data - in a real app, this would come from the API
const testimonials = [
  {
    id: "1",
    quote: "TechForge transformed our e-commerce platform completely. The new system handles 10x more traffic and our conversion rates increased by 300%. Their team's expertise and professionalism exceeded all our expectations.",
    rating: 5,
    author: {
      name: "Sarah Johnson",
      position: "CEO, RetailMax Global",
      company: "RetailMax Global",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c179e8f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "2", 
    quote: "The mobile banking app they developed for us has been a game-changer. With 500,000+ active users and a 4.8-star rating, it's clear that TechForge understands both technology and user experience.",
    rating: 5,
    author: {
      name: "Michael Chen",
      position: "CTO, SecureBank Digital",
      company: "SecureBank Digital",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "3",
    quote: "Working with TechForge on our IoT platform was exceptional. They delivered a solution that monitors 10,000+ devices and reduced our operational costs by 45%. True technology partnership.",
    rating: 5,
    author: {
      name: "Emily Rodriguez",
      position: "VP Operations, ManufacturingCorp",
      company: "ManufacturingCorp",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            What Our <span className="gradient-text">Clients</span> Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry leaders and business owners 
            have to say about working with TechForge Solutions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>

        {/* Client Logos */}
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-8">Trusted by leading companies worldwide</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="flex justify-center" 
              data-testid={`client-logo-${index}`}
            >
              <div className="bg-muted w-32 h-16 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground font-semibold text-sm">Client Logo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">200+</div>
              <div className="text-sm text-muted-foreground">Success Stories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
