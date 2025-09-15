import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  index: number;
}

export default function ServiceCard({ 
  title, 
  description, 
  features, 
  icon, 
  color, 
  index 
}: ServiceCardProps) {
  const animationDelay = `${index * 0.1}s`;

  return (
    <div 
      className="tech-card bg-card p-8 rounded-xl hover:shadow-lg group"
      style={{ animationDelay }}
      data-testid={`service-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`w-16 h-16 bg-${color}/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <div className={`text-${color}`}>
          {icon}
        </div>
      </div>
      
      <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-2 text-sm text-muted-foreground">
        {features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-center">
            <CheckCircle className="h-4 w-4 text-chart-2 mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 pt-6 border-t border-border">
        <button className="text-primary hover:text-primary/80 font-medium inline-flex items-center transition-colors">
          Learn More
          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
