import { apiRequest } from "./queryClient";

export const api = {
  // Public API methods
  pages: {
    getAll: () => apiRequest("GET", "/api/pages"),
    getBySlug: (slug: string) => apiRequest("GET", `/api/pages/${slug}`),
  },
  
  blog: {
    getAll: () => apiRequest("GET", "/api/blog"),
    getBySlug: (slug: string) => apiRequest("GET", `/api/blog/${slug}`),
    search: (query: string) => apiRequest("GET", `/api/blog/search/${query}`),
  },
  
  projects: {
    getAll: () => apiRequest("GET", "/api/projects"),
    getFeatured: () => apiRequest("GET", "/api/projects/featured"),
    getBySlug: (slug: string) => apiRequest("GET", `/api/projects/${slug}`),
  },
  
  team: {
    getAll: () => apiRequest("GET", "/api/team"),
    getFeatured: () => apiRequest("GET", "/api/team/featured"),
  },
  
  contact: {
    submit: (data: any) => apiRequest("POST", "/api/contact", data),
  },
  
  // Admin API methods
  admin: {
    pages: {
      getAll: () => apiRequest("GET", "/api/admin/pages"),
      create: (data: any) => apiRequest("POST", "/api/admin/pages", data),
      update: (id: number, data: any) => apiRequest("PUT", `/api/admin/pages/${id}`, data),
      delete: (id: number) => apiRequest("DELETE", `/api/admin/pages/${id}`),
    },
    
    blog: {
      getAll: () => apiRequest("GET", "/api/admin/blog"),
      create: (data: any) => apiRequest("POST", "/api/admin/blog", data),
      update: (id: number, data: any) => apiRequest("PUT", `/api/admin/blog/${id}`, data),
      delete: (id: number) => apiRequest("DELETE", `/api/admin/blog/${id}`),
    },
    
    projects: {
      getAll: () => apiRequest("GET", "/api/admin/projects"),
      create: (data: any) => apiRequest("POST", "/api/admin/projects", data),
      update: (id: number, data: any) => apiRequest("PUT", `/api/admin/projects/${id}`, data),
      delete: (id: number) => apiRequest("DELETE", `/api/admin/projects/${id}`),
    },
    
    leads: {
      getAll: () => apiRequest("GET", "/api/admin/leads"),
      update: (id: number, data: any) => apiRequest("PUT", `/api/admin/leads/${id}`, data),
    },
    
    team: {
      getAll: () => apiRequest("GET", "/api/admin/team"),
      create: (data: any) => apiRequest("POST", "/api/admin/team", data),
      update: (id: number, data: any) => apiRequest("PUT", `/api/admin/team/${id}`, data),
      delete: (id: number) => apiRequest("DELETE", `/api/admin/team/${id}`),
    },
  },
};
