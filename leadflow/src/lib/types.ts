export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  is_duplicate: boolean;
  created_at: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}
