// ─── Supabase Types ──────────────────────────────────────────────
// All shared TypeScript types for the application

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
  order_num: number;
  created_at: string;
}

export interface Indicator {
  id: string;
  domain_id: string;
  name: string;
  description: string;
  order_num: number;
  created_at: string;
  domains?: Domain;
}

export interface Staff {
  id: string;
  national_id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Evidence {
  id: string;
  indicator_id: string;
  staff_id: string;
  name: string;
  description: string;
  file_url: string;
  file_name: string;
  created_at: string;
  indicators?: Indicator & { domains?: Domain };
  staff?: Staff;
}

export interface Admin {
  id: string;
  username: string;
  created_at: string;
}
