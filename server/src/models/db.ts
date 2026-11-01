import { AssistanceRequest, AssistanceResponse, Category, ImpactStats, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import bcrypt from 'bcryptjs';

// Seed Categories
export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Academic & Tutoring',
    slug: 'academic',
    description: 'Textbooks, course notes, tutoring, project guidance and study resources',
    icon: 'GraduationCap',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'cat-2',
    name: 'Food & Essentials',
    slug: 'food',
    description: 'Emergency groceries, meals, pantry items and everyday necessities',
    icon: 'Utensils',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'cat-3',
    name: 'Transportation',
    slug: 'transport',
    description: 'Rides, carpools, emergency travel help and vehicle assistance',
    icon: 'Car',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'cat-4',
    name: 'Health & Wellness',
    slug: 'health',
    description: 'Medicine delivery, medical equipment, blood donor needs and wellness support',
    icon: 'HeartPulse',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'cat-5',
    name: 'Household & Tools',
    slug: 'household',
    description: 'Furniture, appliances, repair tools and home living essentials',
    icon: 'Home',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'cat-6',
    name: 'Tech & Gadgets',
    slug: 'tech',
    description: 'Laptop repairs, peripherals, software setup and technical guidance',
    icon: 'Laptop',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'cat-7',
    name: 'Other Assistance',
    slug: 'other',
    description: 'General community support, volunteer requests and miscellaneous help',
    icon: 'HelpCircle',
    color: 'bg-slate-50 text-slate-700 border-slate-200',
  },
];

// Pre-seeded Users
const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('password123', salt);

export const initialUsers: (UserProfile & { password_hash: string })[] = [
  {
    id: 'usr-1',
    email: 'sarah.c@community.org',
    password_hash: defaultPasswordHash,
    full_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'CS Student & peer volunteer passionate about mutual community support.',
    phone: '+1 (555) 234-5678',
    location: 'North Campus, Block B',
    role: 'user',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-2',
    email: 'marcus.j@volunteer.net',
    password_hash: defaultPasswordHash,
    full_name: 'Marcus Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Local volunteer with vehicle access, ready to help with rides and grocery runs.',
    phone: '+1 (555) 987-6543',
    location: 'Downtown District',
    role: 'volunteer',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-3',
    email: 'priya.patel@healthbridge.org',
    password_hash: defaultPasswordHash,
    full_name: 'Dr. Priya Patel',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: 'Community clinic volunteer coordinator and health literacy advocate.',
    phone: '+1 (555) 345-6789',
    location: 'Southside Health Center',
    role: 'volunteer',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Seed Requests
export const initialRequests: AssistanceRequest[] = [
  {
    id: 'req-1',
    title: 'Need Data Structures & Algorithms Textbook (Cormen / CLRS)',
    description: 'Looking to borrow or receive a copy of Introduction to Algorithms (CLRS) for this semester. Can return it in pristine condition before finals or exchange with Python books!',
    category_id: 'cat-1',
    user_id: 'usr-1',
    urgency: 'medium',
    status: 'open',
    location: 'University Library / North Hall',
    contact_info: 'Discord: sarah_c#1024 or email',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    responses_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'req-2',
    title: 'Urgent: Ride to Central Hospital for Chemotherapy Appointment',
    description: 'My usual transit is delayed and I have a crucial medical consultation at 2:00 PM tomorrow. Looking for a community driver who can assist with a one-way or round trip.',
    category_id: 'cat-3',
    user_id: 'usr-3',
    urgency: 'critical',
    status: 'in_progress',
    location: 'Elmwood Apartments to Central Hospital',
    contact_info: 'Call or SMS: +1 (555) 345-6789',
    image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600',
    responses_count: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'req-3',
    title: 'Emergency Food Pantry Assistance for Family of 4',
    description: 'Experiencing a temporary setback between seasonal work paychecks. Need essential staple items (rice, flour, canned goods, baby formula) for the coming 4-5 days.',
    category_id: 'cat-2',
    user_id: 'usr-1',
    urgency: 'high',
    status: 'open',
    location: 'Oakridge Community Center Area',
    contact_info: 'Text message preferred',
    image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600',
    responses_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'req-4',
    title: 'Laptop Screen Display Glitch / RAM Upgrade Support',
    description: 'My laptop display flickers constantly when running dev servers. Would appreciate guidance from someone who knows hardware repair or has a spare external monitor for 3 days.',
    category_id: 'cat-6',
    user_id: 'usr-2',
    urgency: 'low',
    status: 'resolved',
    location: 'Engineering Building Room 204',
    contact_info: 'marcus.j@volunteer.net',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
    responses_count: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

// Seed Responses
export const initialResponses: AssistanceResponse[] = [
  {
    id: 'res-1',
    request_id: 'req-1',
    helper_id: 'usr-2',
    message: 'Hey Sarah! I have a 3rd edition CLRS hardcover sitting on my shelf. Happy to hand it over at the student center tomorrow morning!',
    status: 'pending',
    contact_phone: '+1 (555) 987-6543',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'res-2',
    request_id: 'req-2',
    helper_id: 'usr-2',
    message: 'I can drive you tomorrow! My SUV is sanitized and comfortable. I will arrive 30 minutes early.',
    status: 'accepted',
    contact_phone: '+1 (555) 987-6543',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// In-Memory Database Store
class DatabaseStore {
  private users: (UserProfile & { password_hash: string })[] = [...initialUsers];
  private categories: Category[] = [...initialCategories];
  private requests: AssistanceRequest[] = [...initialRequests];
  private responses: AssistanceResponse[] = [...initialResponses];

  // User methods
  async findUserByEmail(email: string) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Supabase query error, using local memory store:', err);
      }
    }
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id: string) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Supabase query error, using local memory store:', err);
      }
    }
    return this.users.find((u) => u.id === id);
  }

  async createUser(userData: { email: string; password_hash: string; full_name: string; role?: 'user' | 'volunteer' | 'admin' }) {
    const newUser: UserProfile & { password_hash: string } = {
      id: 'usr-' + Date.now(),
      email: userData.email,
      password_hash: userData.password_hash,
      full_name: userData.full_name,
      role: userData.role || 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('profiles').insert([newUser]);
    }

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<UserProfile>) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.users[index];
  }

  // Categories
  async getCategories() {
    return this.categories.map((c) => ({
      ...c,
      request_count: this.requests.filter((r) => r.category_id === c.id).length,
    }));
  }

  async getCategoryById(id: string) {
    return this.categories.find((c) => c.id === id || c.slug === id);
  }

  // Requests
  async getRequests(filters?: { category?: string; status?: string; urgency?: string; search?: string }) {
    let list = [...this.requests];

    if (filters?.category && filters.category !== 'all') {
      const cat = this.categories.find((c) => c.id === filters.category || c.slug === filters.category);
      if (cat) {
        list = list.filter((r) => r.category_id === cat.id);
      }
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((r) => r.status === filters.status);
    }

    if (filters?.urgency && filters.urgency !== 'all') {
      list = list.filter((r) => r.urgency === filters.urgency);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

    return list.map((r) => this.hydrateRequest(r));
  }

  async getRequestById(id: string) {
    const req = this.requests.find((r) => r.id === id);
    if (!req) return null;
    return this.hydrateRequest(req);
  }

  async createRequest(data: Omit<AssistanceRequest, 'id' | 'created_at' | 'updated_at' | 'responses_count'>) {
    const newReq: AssistanceRequest = {
      ...data,
      id: 'req-' + Date.now(),
      responses_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.requests.unshift(newReq);
    return this.hydrateRequest(newReq);
  }

  async updateRequestStatus(id: string, status: AssistanceRequest['status']) {
    const req = this.requests.find((r) => r.id === id);
    if (!req) return null;
    req.status = status;
    req.updated_at = new Date().toISOString();
    return this.hydrateRequest(req);
  }

  async deleteRequest(id: string) {
    const index = this.requests.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.requests.splice(index, 1);
    this.responses = this.responses.filter((res) => res.request_id !== id);
    return true;
  }

  // Responses
  async getResponsesByRequestId(requestId: string) {
    const list = this.responses.filter((res) => res.request_id === requestId);
    return list.map((res) => this.hydrateResponse(res));
  }

  async getResponsesByHelperId(helperId: string) {
    const list = this.responses.filter((res) => res.helper_id === helperId);
    return list.map((res) => this.hydrateResponse(res));
  }

  async createResponse(data: Omit<AssistanceResponse, 'id' | 'created_at' | 'updated_at'>) {
    const newRes: AssistanceResponse = {
      ...data,
      id: 'res-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.responses.push(newRes);

    const req = this.requests.find((r) => r.id === data.request_id);
    if (req) {
      req.responses_count = (req.responses_count || 0) + 1;
    }

    return this.hydrateResponse(newRes);
  }

  async updateResponseStatus(id: string, status: AssistanceResponse['status']) {
    const res = this.responses.find((r) => r.id === id);
    if (!res) return null;
    res.status = status;
    res.updated_at = new Date().toISOString();

    // If accepted or completed, optionally update request status
    if (status === 'accepted') {
      const req = this.requests.find((r) => r.id === res.request_id);
      if (req && req.status === 'open') {
        req.status = 'in_progress';
      }
    } else if (status === 'completed') {
      const req = this.requests.find((r) => r.id === res.request_id);
      if (req) {
        req.status = 'resolved';
      }
    }

    return this.hydrateResponse(res);
  }

  // Stats & Dashboard
  async getImpactStats(): Promise<ImpactStats> {
    const totalRequests = this.requests.length;
    const resolvedRequests = this.requests.filter((r) => r.status === 'resolved').length;
    const activeRequests = this.requests.filter((r) => r.status === 'open' || r.status === 'in_progress').length;
    const helperSet = new Set(this.responses.map((r) => r.helper_id));
    const activeHelpers = Math.max(helperSet.size, 1);
    const resolutionRate = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;

    return {
      totalRequests,
      resolvedRequests,
      activeRequests,
      activeHelpers,
      totalCategories: this.categories.length,
      resolutionRate,
    };
  }

  async getUserDashboard(userId: string) {
    const myRequests = this.requests.filter((r) => r.user_id === userId).map((r) => this.hydrateRequest(r));
    const myOffers = this.responses.filter((r) => r.helper_id === userId).map((r) => this.hydrateResponse(r));

    return {
      myRequests,
      myOffers,
      stats: {
        totalRequested: myRequests.length,
        resolvedRequested: myRequests.filter((r) => r.status === 'resolved').length,
        totalOffered: myOffers.length,
        successfulHelps: myOffers.filter((o) => o.status === 'completed' || o.status === 'accepted').length,
      },
    };
  }

  private hydrateRequest(r: AssistanceRequest): AssistanceRequest {
    const category = this.categories.find((c) => c.id === r.category_id);
    const user = this.users.find((u) => u.id === r.user_id);
    return {
      ...r,
      category,
      author: user
        ? {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
            location: user.location,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
          }
        : undefined,
    };
  }

  private hydrateResponse(res: AssistanceResponse): AssistanceResponse {
    const helper = this.users.find((u) => u.id === res.helper_id);
    const request = this.requests.find((r) => r.id === res.request_id);
    return {
      ...res,
      helper: helper
        ? {
            id: helper.id,
            email: helper.email,
            full_name: helper.full_name,
            avatar_url: helper.avatar_url,
            location: helper.location,
            role: helper.role,
            created_at: helper.created_at,
            updated_at: helper.updated_at,
          }
        : undefined,
      request: request ? this.hydrateRequest(request) : undefined,
    };
  }
}

export const db = new DatabaseStore();
