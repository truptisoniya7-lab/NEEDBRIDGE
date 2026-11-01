export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type RequestStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ResponseStatus = 'pending' | 'accepted' | 'completed' | 'declined';
export type UserRole = 'user' | 'volunteer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  request_count?: number;
}

export interface AssistanceRequest {
  id: string;
  title: string;
  description: string;
  category_id: string;
  category?: Category;
  user_id: string;
  author?: UserProfile;
  urgency: UrgencyLevel;
  status: RequestStatus;
  location: string;
  contact_info?: string;
  image_url?: string;
  responses_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AssistanceResponse {
  id: string;
  request_id: string;
  request?: AssistanceRequest;
  helper_id: string;
  helper?: UserProfile;
  message: string;
  status: ResponseStatus;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface ImpactStats {
  totalRequests: number;
  resolvedRequests: number;
  activeRequests: number;
  activeHelpers: number;
  totalCategories: number;
  resolutionRate: number;
}
