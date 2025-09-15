import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    quote: string;
    rating: number;
    author: {
      name: string;
      position: string;
      company: string;
      avatar?: string;
    };
  };
  index?: number;
}

export default function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  const animationDelay = `${index * 0.1}s`;

  return (
    <div 
      className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      style={{ animationDelay }}
      data-testid={`testimonial-${testimonial.id}`}
    >
      {/* Quote Icon */}
      <div className="flex items-center mb-4">
        <Quote className="h-8 w-8 text-chart-3 mb-2" />
      </div>

      {/* Rating */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, starIndex) => (
          <Star 
            key={starIndex} 
            className={`h-5 w-5 ${
              starIndex < testimonial.rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`} 
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-foreground mb-6 leading-relaxed italic">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center">
        {testimonial.author.avatar ? (
          <img 
            src={testimonial.author.avatar} 
            alt={`${testimonial.author.name} profile`}
            className="w-12 h-12 rounded-full object-cover mr-4"
            data-testid={`testimonial-avatar-${testimonial.id}`}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white font-semibold mr-4">
            {testimonial.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        )}
        <div>
          <div className="font-semibold text-foreground" data-testid={`testimonial-author-${testimonial.id}`}>
            {testimonial.author.name}
          </div>
          <div className="text-sm text-muted-foreground" data-testid={`testimonial-position-${testimonial.id}`}>
            {testimonial.author.position}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {testimonial.author.company}
          </div>
        </div>
      </div>
    </div>
  );
}
