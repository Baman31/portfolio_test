import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Send } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine(val => val === true, "Consent is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      consent: false,
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => api.contact.submit(data),
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <Card>
      <CardContent className="p-8">
        <h3 className="text-2xl font-serif font-semibold mb-6">Get Started Today</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="John"
                data-testid="input-firstName"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Doe"
                data-testid="input-lastName"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john.doe@company.com"
              data-testid="input-email"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Your Company"
              data-testid="input-company"
            />
          </div>

          <div>
            <Label htmlFor="projectType">Project Type</Label>
            <Select onValueChange={(value) => setValue("projectType", value)} data-testid="select-projectType">
              <SelectTrigger>
                <SelectValue placeholder="Select a project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-app">Mobile Application</SelectItem>
                <SelectItem value="cloud-migration">Cloud Migration</SelectItem>
                <SelectItem value="enterprise-software">Enterprise Software</SelectItem>
                <SelectItem value="ai-ml">AI/ML Solution</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget">Project Budget</Label>
            <Select onValueChange={(value) => setValue("budget", value)} data-testid="select-budget">
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                <SelectItem value="500k+">$500K+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Project Description *</Label>
            <Textarea
              id="message"
              rows={5}
              {...register("message")}
              placeholder="Tell us about your project, goals, and requirements..."
              data-testid="textarea-message"
            />
            {errors.message && (
              <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={watch("consent")}
              onCheckedChange={(checked) => setValue("consent", !!checked)}
              data-testid="checkbox-consent"
            />
            <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
              I agree to receive communications from TechForge Solutions and understand that I can 
              unsubscribe at any time. View our Privacy Policy.
            </Label>
          </div>
          {errors.consent && (
            <p className="text-sm text-destructive">{errors.consent.message}</p>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={contactMutation.isPending}
            data-testid="button-submit"
          >
            {contactMutation.isPending ? (
              "Sending..."
            ) : (
              <>
                <span>Send Message</span>
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
