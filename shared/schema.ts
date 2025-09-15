import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pages content table
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").unique().notNull(),
  title: varchar("title").notNull(),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  content: jsonb("content"),
  status: varchar("status").default("draft"), // draft, published, archived
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").unique().notNull(),
  title: varchar("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image"),
  authorId: varchar("author_id").references(() => users.id),
  categories: text("categories").array(),
  tags: text("tags").array(),
  readTime: integer("read_time"),
  status: varchar("status").default("draft"), // draft, published
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").unique().notNull(),
  title: varchar("title").notNull(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  client: jsonb("client"), // {name, industry, size, logo}
  technologies: text("technologies").array(),
  services: text("services").array(),
  timeline: jsonb("timeline"), // {startDate, endDate, duration}
  team: jsonb("team"), // {size, roles, members}
  media: jsonb("media"), // {featured, gallery, video, demo}
  results: jsonb("results"), // {metrics, testimonial}
  caseStudy: jsonb("case_study"), // {challenge, solution, implementation, results}
  featured: boolean("featured").default(false),
  status: varchar("status").default("active"), // active, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact leads table
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // contact, project, career
  source: varchar("source"),
  status: varchar("status").default("new"), // new, contacted, qualified, converted, closed
  priority: varchar("priority").default("medium"), // low, medium, high, urgent
  contact: jsonb("contact").notNull(), // {firstName, lastName, email, phone, company, position, website}
  inquiry: jsonb("inquiry"), // {subject, message, budget, timeline, services, attachments}
  tracking: jsonb("tracking"), // {ip, userAgent, referrer, utm}
  assignedTo: varchar("assigned_to").references(() => users.id),
  notes: jsonb("notes").default([]),
  activities: jsonb("activities").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  position: varchar("position").notNull(),
  department: varchar("department"),
  bio: text("bio"),
  skills: text("skills").array(),
  experience: varchar("experience"),
  education: varchar("education"),
  profileImage: varchar("profile_image"),
  socialLinks: jsonb("social_links"), // {linkedin, twitter, github}
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").unique().notNull(),
  value: jsonb("value"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
