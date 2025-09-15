import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
}

export default function ServiceCard({ icon, title, description, features, color }: ServiceCardProps) {
  return (
    <Card className="tech-card bg-card hover:shadow-lg">
      <CardContent className="p-8">
        <div className={`w-16 h-16 bg-${color}/20 rounded-xl flex items-center justify-center mb-6 text-${color}`}>
          {icon}
        </div>
        <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
