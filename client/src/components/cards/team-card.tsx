import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";

interface TeamCardProps {
  member: {
    id: string;
    name: string;
    position: string;
    department?: string;
    bio?: string;
    expertise?: string[];
    experience?: string;
    avatar?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      email?: string;
    };
  };
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow group">
      {/* Avatar */}
      <div className="relative mb-6">
        {member.avatar ? (
          <img 
            src={member.avatar} 
            alt={`${member.name} professional headshot`}
            className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
            data-testid={`team-avatar-${member.id}`}
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white font-bold text-2xl">
            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity"></div>
      </div>

      {/* Basic Info */}
      <h4 className="text-xl font-serif font-semibold text-foreground mb-2" data-testid={`team-name-${member.id}`}>
        {member.name}
      </h4>
      <p className="text-primary font-medium mb-2" data-testid={`team-position-${member.id}`}>
        {member.position}
      </p>
      
      {member.department && (
        <Badge variant="outline" className="mb-4">
          {member.department}
        </Badge>
      )}

      {/* Experience */}
      {member.experience && (
        <p className="text-sm text-muted-foreground mb-4">
          {member.experience} experience
        </p>
      )}

      {/* Bio */}
      {member.bio && (
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {member.bio}
        </p>
      )}

      {/* Expertise */}
      {member.expertise && member.expertise.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground mb-2">Expertise</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {member.expertise.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {member.expertise.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{member.expertise.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Social Links */}
      {member.socialLinks && (
        <div className="flex justify-center space-x-3 mt-4">
          {member.socialLinks.linkedin && (
            <a 
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${member.name} LinkedIn profile`}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.socialLinks.twitter && (
            <a 
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${member.name} Twitter profile`}
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {member.socialLinks.github && (
            <a 
              href={member.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${member.name} GitHub profile`}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {member.socialLinks.email && (
            <a 
              href={`mailto:${member.socialLinks.email}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Email ${member.name}`}
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
