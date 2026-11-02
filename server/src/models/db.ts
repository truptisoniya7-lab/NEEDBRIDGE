import path from 'path';
import fs from 'fs';
import { AssistanceRequest, AssistanceResponse, Category, ImpactStats, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../config/supabase';

// Standard System Categories
export const systemCategories: Omit<Category, 'id'>[] = [
  {
    name: 'Academic & Tutoring',
    slug: 'academic',
    description: 'Textbooks, course notes, tutoring, project guidance and study resources',
    icon: 'GraduationCap',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    name: 'Food & Essentials',
    slug: 'food',
    description: 'Emergency groceries, meals, pantry items and everyday necessities',
    icon: 'Utensils',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'Transportation',
    slug: 'transport',
    description: 'Rides, carpools, emergency travel help and vehicle assistance',
    icon: 'Car',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    name: 'Health & Wellness',
    slug: 'health',
    description: 'Medicine delivery, medical equipment, blood donor needs and wellness support',
    icon: 'HeartPulse',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    name: 'Household & Tools',
    slug: 'household',
    description: 'Furniture, appliances, repair tools and home living essentials',
    icon: 'Home',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    name: 'Tech & Gadgets',
    slug: 'tech',
    description: 'Laptop repairs, peripherals, software setup and technical guidance',
    icon: 'Laptop',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    name: 'Other Assistance',
    slug: 'other',
    description: 'General community support, volunteer requests and miscellaneous help',
    icon: 'HelpCircle',
    color: 'bg-slate-50 text-slate-700 border-slate-200',
  },
];

// Persistent SQLite Storage Engine
class PersistentDatabase {
  private db: any;

  constructor() {
    try {
      // Dynamic require of node:sqlite to support Node 22+
      const sqliteModule = require('node:sqlite');
      const dbDir = path.resolve(__dirname, '..', '..');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      const dbPath = path.join(dbDir, 'needbridge.db');
      this.db = new sqliteModule.DatabaseSync(dbPath);
      this.initTables();
      console.log('[Database] Connected to persistent SQLite database:', dbPath);
    } catch (err) {
      console.error('[Database] Failed to initialize SQLite, falling back to memory store:', err);
    }
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        avatar_url TEXT,
        bio TEXT,
        phone TEXT,
        location TEXT,
        role TEXT DEFAULT 'user',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category_id TEXT,
        user_id TEXT NOT NULL,
        urgency TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'open',
        location TEXT NOT NULL,
        contact_info TEXT,
        image_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS responses (
        id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL,
        helper_id TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        contact_phone TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
        FOREIGN KEY (helper_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Seed categories if empty
    const countStmt = this.db.prepare('SELECT COUNT(*) as cnt FROM categories;');
    const row = countStmt.get() as { cnt: number };
    if (row.cnt === 0) {
      const insertCat = this.db.prepare(
        'INSERT INTO categories (id, name, slug, description, icon, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);'
      );
      for (let i = 0; i < systemCategories.length; i++) {
        const cat = systemCategories[i];
        insertCat.run(
          `cat-${i + 1}`,
          cat.name,
          cat.slug,
          cat.description,
          cat.icon,
          cat.color,
          new Date().toISOString()
        );
      }
      console.log('[Database] Seeded 7 standard mutual aid categories.');
    }
  }

  // --- Real User Methods ---
  async findUserByEmail(email: string) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[Supabase Error] Falling back to SQLite:', err);
      }
    }
    const stmt = this.db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?);');
    const user = stmt.get(email.trim());
    return user || null;
  }

  async findUserById(id: string) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[Supabase Error] Falling back to SQLite:', err);
      }
    }
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?;');
    const user = stmt.get(id);
    return user || null;
  }

  async createUser(userData: {
    email: string;
    password_hash: string;
    full_name: string;
    role?: 'user' | 'volunteer' | 'admin';
  }) {
    const newUser: UserProfile & { password_hash: string } = {
      id: 'usr-' + Date.now(),
      email: userData.email.trim(),
      password_hash: userData.password_hash,
      full_name: userData.full_name.trim(),
      role: userData.role || 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('profiles').insert([newUser]);
      } catch (err) {
        console.warn('[Supabase Error] Unable to sync user creation:', err);
      }
    }

    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `);
    stmt.run(
      newUser.id,
      newUser.email,
      newUser.password_hash,
      newUser.full_name,
      newUser.role,
      newUser.created_at,
      newUser.updated_at
    );

    return newUser;
  }

  async updateUser(id: string, updates: Partial<UserProfile>) {
    const existing = await this.findUserById(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const stmt = this.db.prepare(`
      UPDATE users
      SET full_name = ?, bio = ?, phone = ?, location = ?, avatar_url = ?, updated_at = ?
      WHERE id = ?;
    `);
    stmt.run(
      merged.full_name,
      merged.bio || null,
      merged.phone || null,
      merged.location || null,
      merged.avatar_url || null,
      merged.updated_at,
      id
    );

    return merged;
  }

  // --- Real Category Methods ---
  async getCategories() {
    const stmt = this.db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM requests r WHERE r.category_id = c.id) as request_count
      FROM categories c
      ORDER BY c.name ASC;
    `);
    return stmt.all() as Category[];
  }

  async getCategoryById(id: string) {
    const stmt = this.db.prepare('SELECT * FROM categories WHERE id = ? OR slug = ?;');
    return stmt.get(id, id) as Category | null;
  }

  // --- Real Request Methods ---
  async getRequests(filters?: { category?: string; status?: string; urgency?: string; search?: string }) {
    let sql = 'SELECT * FROM requests WHERE 1=1';
    const params: any[] = [];

    if (filters?.category && filters.category !== 'all') {
      const cat = await this.getCategoryById(filters.category);
      if (cat) {
        sql += ' AND category_id = ?';
        params.push(cat.id);
      }
    }

    if (filters?.status && filters.status !== 'all') {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.urgency && filters.urgency !== 'all') {
      sql += ' AND urgency = ?';
      params.push(filters.urgency);
    }

    if (filters?.search && filters.search.trim()) {
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)';
      const term = `%${filters.search.toLowerCase().trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC;';

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as AssistanceRequest[];

    return rows.map((r) => this.hydrateRequest(r));
  }

  async getRequestById(id: string) {
    const stmt = this.db.prepare('SELECT * FROM requests WHERE id = ?;');
    const row = stmt.get(id) as AssistanceRequest | null;
    if (!row) return null;
    return this.hydrateRequest(row);
  }

  async createRequest(data: Omit<AssistanceRequest, 'id' | 'created_at' | 'updated_at' | 'responses_count'>) {
    const id = 'req-' + Date.now();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO requests (id, title, description, category_id, user_id, urgency, status, location, contact_info, image_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    stmt.run(
      id,
      data.title,
      data.description,
      data.category_id,
      data.user_id,
      data.urgency || 'medium',
      data.status || 'open',
      data.location,
      data.contact_info || null,
      data.image_url || null,
      now,
      now
    );

    const created = await this.getRequestById(id);
    return created!;
  }

  async updateRequestStatus(id: string, status: AssistanceRequest['status']) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare('UPDATE requests SET status = ?, updated_at = ? WHERE id = ?;');
    stmt.run(status, now, id);
    return this.getRequestById(id);
  }

  async deleteRequest(id: string) {
    const stmt = this.db.prepare('DELETE FROM requests WHERE id = ?;');
    stmt.run(id);
    const resStmt = this.db.prepare('DELETE FROM responses WHERE request_id = ?;');
    resStmt.run(id);
    return true;
  }

  // --- Real Responses (Assistance Offers) ---
  async getResponsesByRequestId(requestId: string) {
    const stmt = this.db.prepare('SELECT * FROM responses WHERE request_id = ? ORDER BY created_at DESC;');
    const rows = stmt.all(requestId) as AssistanceResponse[];
    return rows.map((res) => this.hydrateResponse(res));
  }

  async getResponsesByHelperId(helperId: string) {
    const stmt = this.db.prepare('SELECT * FROM responses WHERE helper_id = ? ORDER BY created_at DESC;');
    const rows = stmt.all(helperId) as AssistanceResponse[];
    return rows.map((res) => this.hydrateResponse(res));
  }

  async createResponse(data: Omit<AssistanceResponse, 'id' | 'created_at' | 'updated_at'>) {
    const id = 'res-' + Date.now();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO responses (id, request_id, helper_id, message, status, contact_phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `);
    stmt.run(
      id,
      data.request_id,
      data.helper_id,
      data.message,
      data.status || 'pending',
      data.contact_phone || null,
      now,
      now
    );

    const created = this.db.prepare('SELECT * FROM responses WHERE id = ?;').get(id) as AssistanceResponse;
    return this.hydrateResponse(created);
  }

  async updateResponseStatus(id: string, status: AssistanceResponse['status']) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare('UPDATE responses SET status = ?, updated_at = ? WHERE id = ?;');
    stmt.run(status, now, id);

    const res = this.db.prepare('SELECT * FROM responses WHERE id = ?;').get(id) as AssistanceResponse;
    if (!res) return null;

    if (status === 'accepted') {
      const req = await this.getRequestById(res.request_id);
      if (req && req.status === 'open') {
        await this.updateRequestStatus(res.request_id, 'in_progress');
      }
    } else if (status === 'completed') {
      await this.updateRequestStatus(res.request_id, 'resolved');
    }

    return this.hydrateResponse(res);
  }

  // --- Real Telemetry & Personal Dashboard Metrics ---
  async getImpactStats(): Promise<ImpactStats> {
    const totalRow = this.db.prepare('SELECT COUNT(*) as count FROM requests;').get() as { count: number };
    const resolvedRow = this.db
      .prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'resolved';")
      .get() as { count: number };
    const activeRow = this.db
      .prepare("SELECT COUNT(*) as count FROM requests WHERE status IN ('open', 'in_progress');")
      .get() as { count: number };
    const helpersRow = this.db
      .prepare('SELECT COUNT(DISTINCT helper_id) as count FROM responses;')
      .get() as { count: number };
    const categoriesRow = this.db.prepare('SELECT COUNT(*) as count FROM categories;').get() as { count: number };

    const totalRequests = totalRow?.count || 0;
    const resolvedRequests = resolvedRow?.count || 0;
    const activeRequests = activeRow?.count || 0;
    const activeHelpers = helpersRow?.count || 0;
    const totalCategories = categoriesRow?.count || 0;
    const resolutionRate = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;

    return {
      totalRequests,
      resolvedRequests,
      activeRequests,
      activeHelpers,
      totalCategories,
      resolutionRate,
    };
  }

  async getUserDashboard(userId: string) {
    const reqStmt = this.db.prepare('SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC;');
    const myRequestRows = reqStmt.all(userId) as AssistanceRequest[];
    const myRequests = myRequestRows.map((r) => this.hydrateRequest(r));

    const myOffers = await this.getResponsesByHelperId(userId);

    const totalRequested = myRequests.length;
    const resolvedRequested = myRequests.filter((r) => r.status === 'resolved').length;
    const totalOffered = myOffers.length;
    const successfulHelps = myOffers.filter((o) => o.status === 'completed' || o.status === 'accepted').length;

    return {
      myRequests,
      myOffers,
      stats: {
        totalRequested,
        resolvedRequested,
        totalOffered,
        successfulHelps,
      },
    };
  }

  private hydrateRequest(r: AssistanceRequest): AssistanceRequest {
    const catStmt = this.db.prepare('SELECT * FROM categories WHERE id = ?;');
    const category = catStmt.get(r.category_id) as Category | null;

    const userStmt = this.db.prepare('SELECT id, email, full_name, avatar_url, location, role, created_at, updated_at FROM users WHERE id = ?;');
    const author = userStmt.get(r.user_id) as UserProfile | null;

    const respCountStmt = this.db.prepare('SELECT COUNT(*) as count FROM responses WHERE request_id = ?;');
    const respCountRow = respCountStmt.get(r.id) as { count: number };

    return {
      ...r,
      category: category || undefined,
      author: author || undefined,
      responses_count: respCountRow?.count || 0,
    };
  }

  private hydrateResponse(res: AssistanceResponse): AssistanceResponse {
    const userStmt = this.db.prepare('SELECT id, email, full_name, avatar_url, location, role, created_at, updated_at FROM users WHERE id = ?;');
    const helper = userStmt.get(res.helper_id) as UserProfile | null;

    const reqStmt = this.db.prepare('SELECT * FROM requests WHERE id = ?;');
    const rawReq = reqStmt.get(res.request_id) as AssistanceRequest | null;
    const request = rawReq ? this.hydrateRequest(rawReq) : undefined;

    return {
      ...res,
      helper: helper || undefined,
      request,
    };
  }
}

export const db = new PersistentDatabase();
