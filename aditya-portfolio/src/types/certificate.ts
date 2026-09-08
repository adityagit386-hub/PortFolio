export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string | null;
  certificate_file_url: string | null;
  certificate_image_url: string | null;
  category: string | null;
  skills: string[];
  featured: boolean;
  created_at: string;
}
