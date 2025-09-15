import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendEmail } from "./sendgrid";
import { 
  insertBlogPostSchema, 
  insertProjectSchema, 
  insertLeadSchema, 
  insertTeamMemberSchema, 
  insertPageSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes

  // Pages
  app.get('/api/pages', async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages.filter(page => page.status === 'published'));
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const page = await storage.getPage(req.params.slug);
      if (!page || page.status !== 'published') {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Blog posts
  app.get('/api/blog', async (req, res) => {
    try {
      const posts = await storage.getBlogPosts({ status: 'published' });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post || post.status !== 'published') {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get('/api/blog/search/:query', async (req, res) => {
    try {
      const posts = await storage.searchBlogPosts(req.params.query);
      res.json(posts.filter(post => post.status === 'published'));
    } catch (error) {
      console.error("Error searching blog posts:", error);
      res.status(500).json({ message: "Failed to search blog posts" });
    }
  });

  // Projects
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects({ status: 'active' });
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/featured', async (req, res) => {
    try {
      const projects = await storage.getProjects({ status: 'active', featured: true });
      res.json(projects);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });

  app.get('/api/projects/:slug', async (req, res) => {
    try {
      const project = await storage.getProject(req.params.slug);
      if (!project || project.status !== 'active') {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Team members
  app.get('/api/team', async (req, res) => {
    try {
      const team = await storage.getTeamMembers({ active: true });
      res.json(team);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get('/api/team/featured', async (req, res) => {
    try {
      const team = await storage.getTeamMembers({ active: true, featured: true });
      res.json(team);
    } catch (error) {
      console.error("Error fetching featured team members:", error);
      res.status(500).json({ message: "Failed to fetch featured team members" });
    }
  });

  // Contact form
  const contactSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    company: z.string().optional(),
    projectType: z.string().optional(),
    budget: z.string().optional(),
    message: z.string().min(1),
    consent: z.boolean(),
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const data = contactSchema.parse(req.body);
      
      if (!data.consent) {
        return res.status(400).json({ message: "Consent is required" });
      }

      // Create lead
      const lead = await storage.createLead({
        type: 'contact',
        contact: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          company: data.company || '',
          position: '',
          phone: '',
          website: '',
        },
        inquiry: {
          subject: 'Contact Form Submission',
          message: data.message,
          budget: data.budget || '',
          timeline: '',
          services: data.projectType ? [data.projectType] : [],
          attachments: [],
        },
        tracking: {
          ip: req.ip,
          userAgent: req.get('User-Agent') || '',
          referrer: req.get('Referer') || '',
        },
      });

      // Send email notification
      const emailContent = `
        New contact form submission:
        
        Name: ${data.firstName} ${data.lastName}
        Email: ${data.email}
        Company: ${data.company || 'Not provided'}
        Project Type: ${data.projectType || 'Not specified'}
        Budget: ${data.budget || 'Not specified'}
        
        Message:
        ${data.message}
      `;

      await sendEmail(
        process.env.SENDGRID_API_KEY || '',
        {
          to: 'hello@techforge.com',
          from: 'noreply@techforge.com',
          subject: 'New Contact Form Submission',
          text: emailContent,
        }
      );

      res.json({ message: "Thank you for your message! We'll get back to you soon.", leadId: lead.id });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Failed to process contact form" });
    }
  });

  // Protected Admin API routes
  const adminAuth = (req: any, res: any, next: any) => {
    isAuthenticated(req, res, () => {
      if (req.user?.claims?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      next();
    });
  };

  // Admin - Pages
  app.get('/api/admin/pages', adminAuth, async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching admin pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.post('/api/admin/pages', adminAuth, async (req, res) => {
    try {
      const pageData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(pageData);
      res.json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.put('/api/admin/pages/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pageData = insertPageSchema.partial().parse(req.body);
      const page = await storage.updatePage(id, pageData);
      
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      res.json(page);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete('/api/admin/pages/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Admin - Blog posts
  app.get('/api/admin/blog', adminAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post('/api/admin/blog', adminAuth, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub,
      });
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put('/api/admin/blog/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, postData);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/admin/blog/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Admin - Projects
  app.get('/api/admin/projects', adminAuth, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching admin projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/admin/projects', adminAuth, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/admin/projects/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/admin/projects/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Admin - Leads
  app.get('/api/admin/leads', adminAuth, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.put('/api/admin/leads/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leadData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(id, leadData);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  // Admin - Team members
  app.get('/api/admin/team', adminAuth, async (req, res) => {
    try {
      const team = await storage.getTeamMembers();
      res.json(team);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post('/api/admin/team', adminAuth, async (req, res) => {
    try {
      const memberData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(memberData);
      res.json(member);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put('/api/admin/team/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const memberData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, memberData);
      
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete('/api/admin/team/:id', adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTeamMember(id);
      
      if (!success) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
