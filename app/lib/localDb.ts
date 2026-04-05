// ═══════════════════════════════════════════════════
//  Local Database using localStorage
//  بديل مؤقت لـ Supabase للتطوير المحلي
// ═══════════════════════════════════════════════════

import type { Domain, Indicator, Staff, Evidence, Admin } from './supabase';

// ─── Seed Data ──────────────────────────────────────

const SEED_DOMAINS: Domain[] = [
  { id: 'd1', name: 'الإدارة المدرسية',    description: 'وثائق وقرارات وأنظمة إدارة المدرسة',        icon: '🏛️', color: '#1E40AF', bg_color: '#EFF6FF', order_num: 1, created_at: new Date().toISOString() },
  { id: 'd2', name: 'التعليم والتعلم',     description: 'الخطط الدراسية والأنشطة التربوية والتعليمية',  icon: '📚', color: '#059669', bg_color: '#ECFDF5', order_num: 2, created_at: new Date().toISOString() },
  { id: 'd3', name: 'نواتج التعلم',        description: 'نتائج التحصيل والأداء الأكاديمي للطلاب',       icon: '🎯', color: '#D97706', bg_color: '#FFFBEB', order_num: 3, created_at: new Date().toISOString() },
  { id: 'd4', name: 'البيئة المدرسية',     description: 'المرافق والموارد والبيئة التعليمية الآمنة',   icon: '🏫', color: '#7C3AED', bg_color: '#F5F3FF', order_num: 4, created_at: new Date().toISOString() },
];

const SEED_INDICATORS: Indicator[] = [
  // الإدارة المدرسية
  { id: 'i1-1', domain_id: 'd1', name: 'الخطة التشغيلية للمدرسة',        description: 'وثيقة الخطة التشغيلية السنوية للمدرسة', order_num: 1, created_at: new Date().toISOString() },
  { id: 'i1-2', domain_id: 'd1', name: 'محاضر اجتماعات مجلس المدرسة',    description: 'توثيق جلسات مجلس المدرسة وقراراته',        order_num: 2, created_at: new Date().toISOString() },
  { id: 'i1-3', domain_id: 'd1', name: 'الهيكل التنظيمي للمدرسة',        description: 'وثيقة الهيكل التنظيمي ولوائح التعيينات',    order_num: 3, created_at: new Date().toISOString() },
  { id: 'i1-4', domain_id: 'd1', name: 'تقارير المتابعة والإشراف',        description: 'تقارير المشرفين ومتابعة تنفيذ الخطط',        order_num: 4, created_at: new Date().toISOString() },
  { id: 'i1-5', domain_id: 'd1', name: 'توثيق قرارات الإدارة',           description: 'القرارات الإدارية والتعاميم الرسمية',          order_num: 5, created_at: new Date().toISOString() },
  // التعليم والتعلم
  { id: 'i2-1', domain_id: 'd2', name: 'الخطط الدراسية للمعلمين',        description: 'نماذج الخطط الدراسية اليومية والأسبوعية',    order_num: 1, created_at: new Date().toISOString() },
  { id: 'i2-2', domain_id: 'd2', name: 'الأنشطة الصفية واللاصفية',       description: 'توثيق الأنشطة التربوية والترفيهية',             order_num: 2, created_at: new Date().toISOString() },
  { id: 'i2-3', domain_id: 'd2', name: 'تقارير أداء المعلمين',           description: 'نتائج تقييم وملاحظة أداء المعلمين',             order_num: 3, created_at: new Date().toISOString() },
  { id: 'i2-4', domain_id: 'd2', name: 'وسائل التعليم والتقنية',         description: 'استخدام التقنية والوسائل التعليمية في الفصول', order_num: 4, created_at: new Date().toISOString() },
  // نواتج التعلم
  { id: 'i3-1', domain_id: 'd3', name: 'نتائج الاختبارات الدورية',       description: 'كشوف نتائج اختبارات الطلاب الدورية',           order_num: 1, created_at: new Date().toISOString() },
  { id: 'i3-2', domain_id: 'd3', name: 'مستوى التحصيل الدراسي',         description: 'إحصائيات وتحليل تحصيل الطلاب',                  order_num: 2, created_at: new Date().toISOString() },
  { id: 'i3-3', domain_id: 'd3', name: 'معدلات الغياب والحضور',          description: 'إحصائيات حضور الطلاب والمعلمين',                order_num: 3, created_at: new Date().toISOString() },
  // البيئة المدرسية
  { id: 'i4-1', domain_id: 'd4', name: 'صيانة المرافق المدرسية',         description: 'تقارير صيانة الفصول والمرافق',                  order_num: 1, created_at: new Date().toISOString() },
  { id: 'i4-2', domain_id: 'd4', name: 'توافر الموارد والأجهزة',         description: 'جرد الأجهزة والمعدات المتاحة',                  order_num: 2, created_at: new Date().toISOString() },
  { id: 'i4-3', domain_id: 'd4', name: 'بيئة التعلم الآمنة',            description: 'تقارير السلامة والبيئة المدرسية',                order_num: 3, created_at: new Date().toISOString() },
];

const SEED_STAFF: Staff[] = [
  { id: 's1', national_id: '1015285719', full_name: 'محمد أحمد العلوي',  role: 'معلم رياضيات', is_active: true, created_at: new Date().toISOString() },
  { id: 's2', national_id: '1023456789', full_name: 'فاطمة عبدالله',      role: 'معلمة لغة عربية', is_active: true, created_at: new Date().toISOString() },
  { id: 's3', national_id: '1034567890', full_name: 'خالد سعد المطيري',   role: 'معلم علوم',    is_active: true, created_at: new Date().toISOString() },
];

const SEED_ADMINS: Admin[] = [
  { id: 'a1', username: 'admin', created_at: new Date().toISOString() },
];

const ADMIN_PASSWORDS: Record<string, string> = {
  'admin': btoa('admin123'), // YWRtaW4xMjM= password: admin123
};

// ─── Storage Keys ─────────────────────────────────

const KEYS = {
  domains:    'ldb_domains',
  indicators: 'ldb_indicators',
  staff:      'ldb_staff',
  evidences:  'ldb_evidences',
  admins:     'ldb_admins',
};

// ─── Helpers ──────────────────────────────────────

function load<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try { return JSON.parse(raw); } catch { return seed; }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── DB API ───────────────────────────────────────

export const localDb = {

  // ── Domains ────────────────────────────────────
  getDomains(): Domain[] {
    return load<Domain>(KEYS.domains, SEED_DOMAINS).sort((a, b) => a.order_num - b.order_num);
  },

  getDomainByOrderNum(order: number): Domain | null {
    return this.getDomains().find(d => d.order_num === order) ?? null;
  },

  getDomainById(id: string): Domain | null {
    return this.getDomains().find(d => d.id === id) ?? null;
  },

  // ── Indicators ─────────────────────────────────
  getIndicators(): Indicator[] {
    return load<Indicator>(KEYS.indicators, SEED_INDICATORS);
  },

  getIndicatorsByDomain(domainId: string): Indicator[] {
    return this.getIndicators()
      .filter(i => i.domain_id === domainId)
      .sort((a, b) => a.order_num - b.order_num);
  },

  getIndicatorById(id: string): (Indicator & { domains?: Domain }) | null {
    const ind = this.getIndicators().find(i => i.id === id);
    if (!ind) return null;
    return { ...ind, domains: this.getDomainById(ind.domain_id) ?? undefined };
  },

  // ── Staff ──────────────────────────────────────
  getStaff(): Staff[] {
    return load<Staff>(KEYS.staff, SEED_STAFF);
  },

  getStaffByNationalId(nationalId: string): Staff | null {
    return this.getStaff().find(s => s.national_id === nationalId) ?? null;
  },

  getStaffById(id: string): Staff | null {
    return this.getStaff().find(s => s.id === id) ?? null;
  },

  getActiveStaffCount(): number {
    return this.getStaff().filter(s => s.is_active).length;
  },

  addStaff(data: Omit<Staff, 'id' | 'created_at'>): Staff {
    const list = this.getStaff();
    const newStaff: Staff = { ...data, id: uuid(), created_at: new Date().toISOString() };
    list.push(newStaff);
    save(KEYS.staff, list);
    return newStaff;
  },

  // ── Evidences ──────────────────────────────────
  getEvidences(): Evidence[] {
    return load<Evidence>(KEYS.evidences, []);
  },

  getEvidencesByIndicator(indicatorId: string): (Evidence & { staff?: Staff })[] {
    const evList = this.getEvidences().filter(e => e.indicator_id === indicatorId);
    return evList
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(ev => ({ ...ev, staff: this.getStaffById(ev.staff_id) ?? undefined }));
  },

  getRecentEvidences(limit = 5): (Evidence & { staff?: Staff; indicators?: Indicator & { domains?: Domain } })[] {
    return this.getEvidences()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
      .map(ev => ({
        ...ev,
        staff: this.getStaffById(ev.staff_id) ?? undefined,
        indicators: this.getIndicatorById(ev.indicator_id) ?? undefined,
      }));
  },

  getTotalEvidences(): number {
    return this.getEvidences().length;
  },

  getEvidencesByStaff(staffId: string): Evidence[] {
    return this.getEvidences().filter(e => e.staff_id === staffId);
  },

  getEvidencesCountByIndicator(indicatorId: string): number {
    return this.getEvidences().filter(e => e.indicator_id === indicatorId).length;
  },

  addEvidence(data: Omit<Evidence, 'id' | 'created_at'>): Evidence {
    const list = this.getEvidences();
    const newEv: Evidence = { ...data, id: uuid(), created_at: new Date().toISOString() };
    list.push(newEv);
    save(KEYS.evidences, list);
    return newEv;
  },

  // ── Admins ─────────────────────────────────────
  getAdmins(): Admin[] {
    return load<Admin>(KEYS.admins, SEED_ADMINS);
  },

  checkAdminLogin(username: string, password: string): Admin | null {
    const admins = this.getAdmins();
    const admin = admins.find(a => a.username === username);
    if (!admin) return null;
    const expectedHash = ADMIN_PASSWORDS[username];
    if (!expectedHash) return null;
    if (btoa(password) !== expectedHash) return null;
    return admin;
  },

  // ── Stats ──────────────────────────────────────
  getStats() {
    const domains    = this.getDomains();
    const indicators = this.getIndicators();
    const evidences  = this.getEvidences();
    const staff      = this.getStaff();

    return {
      domains:    domains.length,
      indicators: indicators.length,
      evidences:  evidences.length,
      staff:      staff.filter(s => s.is_active).length,
    };
  },

  getDomainsWithStats() {
    return this.getDomains().map(d => {
      const domIndicators = this.getIndicatorsByDomain(d.id);
      const evCount = domIndicators.reduce(
        (sum, ind) => sum + this.getEvidencesCountByIndicator(ind.id), 0
      );
      return { ...d, indicators_count: domIndicators.length, evidences_count: evCount };
    });
  },

  // File "upload" - stores as base64 in localStorage
  async uploadFile(file: File, staffId: string): Promise<{ url: string; name: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const key = `file_${staffId}_${Date.now()}`;
        try {
          localStorage.setItem(key, dataUrl);
          resolve({ url: `local://${key}`, name: file.name });
        } catch {
          // localStorage full - store reference only
          resolve({ url: '', name: file.name });
        }
      };
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsDataURL(file);
    });
  },

  getFileUrl(url: string): string {
    if (!url.startsWith('local://')) return url;
    const key = url.replace('local://', '');
    return localStorage.getItem(key) ?? '';
  },

  // ── Reset (for testing) ─────────────────────────
  reset() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
