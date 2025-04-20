export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'dev' | 'prod';
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
} 