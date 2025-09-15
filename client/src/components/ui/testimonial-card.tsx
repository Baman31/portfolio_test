import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  rating: number;
  author: string;
  position: string;
  avatar: string;
}

export default function TestimonialCard({ quote, rating, author, position, avatar }: TestimonialCardProps) {
  return (
    <Card className="bg-card hover-lift">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="flex text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < rating ? 'fill-current' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <div className="relative mb-6">
          <Quote className="h-8 w-8 text-chart-3 mb-4" />
          <blockquote className="text-foreground leading-relaxed italic">
            "{quote}"
          </blockquote>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center text-white font-semibold mr-4">
            {avatar}
          </div>
          <div>
            <div className="font-semibold text-foreground">{author}</div>
            <div className="text-sm text-muted-foreground">{position}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
