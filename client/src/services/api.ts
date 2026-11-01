import {
  AssistanceRequest,
  AssistanceResponse,
  Category,
  ImpactStats,
  UserProfile,
} from '../types';

const API_BASE = '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('needbridge_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async <T>(res: Response, defaultError: string): Promise<T> => {
  if (!res.ok) {
    let message = defaultError;
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const err = await res.json();
        message = err.error || message;
      } else {
        const text = await res.text();
        if (res.status === 500 || text.includes('Internal Server Error')) {
          message = 'The backend server is not responding. Please make sure the server is running on port 5000 (run "npm run dev" from project root).';
        } else {
          message = text || defaultError;
        }
      }
    } catch {
      message = defaultError;
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
};

export const api = {
  // Auth
  async register(data: { email: string; password: string; full_name: string; role?: string; phone?: string; location?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; token: string; user: UserProfile }>(res, 'Registration failed');
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; token: string; user: UserProfile }>(res, 'Login failed');
  },

  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserProfile>(res, 'Failed to fetch profile');
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<{ message: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse<{ message: string; user: UserProfile }>(res, 'Failed to update profile');
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse<Category[]>(res, 'Failed to fetch categories');
  },

  // Requests
  async getRequests(params?: { category?: string; status?: string; urgency?: string; search?: string }): Promise<AssistanceRequest[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.urgency) query.append('urgency', params.urgency);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/requests?${query.toString()}`);
    return handleResponse<AssistanceRequest[]>(res, 'Failed to fetch requests');
  },

  async getRequestById(id: string): Promise<AssistanceRequest & { responses: AssistanceResponse[] }> {
    const res = await fetch(`${API_BASE}/requests/${id}`);
    return handleResponse<AssistanceRequest & { responses: AssistanceResponse[] }>(res, 'Failed to fetch request details');
  },

  async createRequest(data: {
    title: string;
    description: string;
    category_id: string;
    urgency: string;
    location: string;
    contact_info?: string;
    image_url?: string;
  }): Promise<{ message: string; request: AssistanceRequest }> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; request: AssistanceRequest }>(res, 'Failed to post request');
  },

  async updateRequestStatus(id: string, status: string): Promise<{ message: string; request: AssistanceRequest }> {
    const res = await fetch(`${API_BASE}/requests/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<{ message: string; request: AssistanceRequest }>(res, 'Failed to update status');
  },

  async deleteRequest(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res, 'Failed to delete request');
  },

  // Assistance Responses
  async offerAssistance(requestId: string, data: { message: string; contact_phone?: string }): Promise<{ message: string; response: AssistanceResponse }> {
    const res = await fetch(`${API_BASE}/responses/request/${requestId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; response: AssistanceResponse }>(res, 'Failed to submit assistance offer');
  },

  async updateResponseStatus(responseId: string, status: string): Promise<{ message: string; response: AssistanceResponse }> {
    const res = await fetch(`${API_BASE}/responses/${responseId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<{ message: string; response: AssistanceResponse }>(res, 'Failed to update offer status');
  },

  // Dashboard & Stats
  async getImpactStats(): Promise<ImpactStats> {
    const res = await fetch(`${API_BASE}/dashboard/impact`);
    return handleResponse<ImpactStats>(res, 'Failed to fetch impact stats');
  },

  async getUserDashboard(): Promise<{
    myRequests: AssistanceRequest[];
    myOffers: AssistanceResponse[];
    stats: {
      totalRequested: number;
      resolvedRequested: number;
      totalOffered: number;
      successfulHelps: number;
    };
  }> {
    const res = await fetch(`${API_BASE}/dashboard/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{
      myRequests: AssistanceRequest[];
      myOffers: AssistanceResponse[];
      stats: {
        totalRequested: number;
        resolvedRequested: number;
        totalOffered: number;
        successfulHelps: number;
      };
    }>(res, 'Failed to fetch user dashboard');
  },
};
