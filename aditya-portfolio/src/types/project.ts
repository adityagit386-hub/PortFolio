export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  category: string;
  created_at: string;
}
