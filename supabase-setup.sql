-- ════════════════════════════════════════════════
--  لوحة التميز الرقمي - الإبتدائية الحادي عشر
--  Supabase Database Setup Script
-- ════════════════════════════════════════════════

-- 1. المجالات الأربعة
CREATE TABLE IF NOT EXISTS domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  bg_color TEXT,
  order_num INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. المؤشرات
CREATE TABLE IF NOT EXISTS indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_num INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. المنسوبون
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  national_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. الشواهد والأدلة
CREATE TABLE IF NOT EXISTS evidences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator_id UUID REFERENCES indicators(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT DEFAULT '',
  file_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. الأدمن
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════
-- Seed Data - البيانات الأساسية
-- ════════════════════════════════════════════════

-- المجالات الأربعة
INSERT INTO domains (name, description, icon, color, bg_color, order_num) VALUES
  ('الإدارة المدرسية',    'وثائق وقرارات وأنظمة إدارة المدرسة',          '🏛️', '#1E40AF', '#EFF6FF', 1),
  ('التعليم والتعلم',     'الخطط الدراسية والأنشطة التربوية والتعليمية',  '📚', '#059669', '#ECFDF5', 2),
  ('نواتج التعلم',        'نتائج التحصيل والأداء الأكاديمي للطلاب',       '🎯', '#D97706', '#FFFBEB', 3),
  ('البيئة المدرسية',     'المرافق والموارد والبيئة التعليمية الآمنة',    '🏫', '#7C3AED', '#F5F3FF', 4)
ON CONFLICT DO NOTHING;

-- مؤشرات المجال الأول - الإدارة المدرسية (سيتم إضافة الـ domain_id بعد الإدراج)
DO $$
DECLARE
  d1 UUID;
  d2 UUID;
  d3 UUID;
  d4 UUID;
BEGIN
  SELECT id INTO d1 FROM domains WHERE order_num = 1;
  SELECT id INTO d2 FROM domains WHERE order_num = 2;
  SELECT id INTO d3 FROM domains WHERE order_num = 3;
  SELECT id INTO d4 FROM domains WHERE order_num = 4;

  -- مؤشرات الإدارة المدرسية
  INSERT INTO indicators (domain_id, name, description, order_num) VALUES
    (d1, 'الخطة التشغيلية للمدرسة',          'وثيقة الخطة التشغيلية السنوية للمدرسة',             1),
    (d1, 'محاضر اجتماعات مجلس المدرسة',       'توثيق جلسات مجلس المدرسة وقراراته',                 2),
    (d1, 'الهيكل التنظيمي للمدرسة',           'وثيقة الهيكل التنظيمي ولوائح التعيينات',            3),
    (d1, 'تقارير المتابعة والإشراف',          'تقارير المشرفين ومتابعة تنفيذ الخطط',               4),
    (d1, 'توثيق قرارات الإدارة',              'القرارات الإدارية والتعاميم الرسمية',                5)
  ON CONFLICT DO NOTHING;

  -- مؤشرات التعليم والتعلم
  INSERT INTO indicators (domain_id, name, description, order_num) VALUES
    (d2, 'الخطط الدراسية للمعلمين',           'نماذج الخطط الدراسية اليومية والأسبوعية',           1),
    (d2, 'الأنشطة الصفية واللاصفية',          'توثيق الأنشطة التربوية والترفيهية',                 2),
    (d2, 'تقارير أداء المعلمين',              'نتائج تقييم وملاحظة أداء المعلمين',                 3),
    (d2, 'وسائل التعليم والتقنية',            'استخدام التقنية والوسائل التعليمية في الفصول',      4)
  ON CONFLICT DO NOTHING;

  -- مؤشرات نواتج التعلم
  INSERT INTO indicators (domain_id, name, description, order_num) VALUES
    (d3, 'نتائج الاختبارات الدورية',           'كشوف نتائج اختبارات الطلاب الدورية',                1),
    (d3, 'مستوى التحصيل الدراسي',             'إحصائيات وتحليل تحصيل الطلاب',                      2),
    (d3, 'معدلات الغياب والحضور',             'إحصائيات حضور الطلاب والمعلمين',                    3)
  ON CONFLICT DO NOTHING;

  -- مؤشرات البيئة المدرسية
  INSERT INTO indicators (domain_id, name, description, order_num) VALUES
    (d4, 'صيانة المرافق المدرسية',            'تقارير صيانة الفصول والمرافق',                      1),
    (d4, 'توافر الموارد والأجهزة',            'جرد الأجهزة والمعدات المتاحة',                      2),
    (d4, 'بيئة التعلم الآمنة',               'تقارير السلامة والبيئة المدرسية',                    3)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seed data inserted successfully';
END;
$$;

-- أدمن افتراضي (اسم المستخدم: admin / كلمة المرور: admin123 مُشفرة بـ base64)
-- admin123 as base64 = YWRtaW4xMjM=
INSERT INTO admins (username, password_hash) VALUES
  ('admin', 'YWRtaW4xMjM=')
ON CONFLICT (username) DO NOTHING;

-- ════════════════════════════════════════════════
-- Row Level Security (RLS) - الصلاحيات
-- ════════════════════════════════════════════════

-- تفعيل RLS
ALTER TABLE domains    ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff      ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins     ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة العامة للمجالات والمؤشرات
CREATE POLICY "Public read domains"    ON domains    FOR SELECT USING (true);
CREATE POLICY "Public read indicators" ON indicators FOR SELECT USING (true);
CREATE POLICY "Public read staff"      ON staff      FOR SELECT USING (true);
CREATE POLICY "Public read evidences"  ON evidences  FOR SELECT USING (true);
CREATE POLICY "Insert evidences"       ON evidences  FOR INSERT WITH CHECK (true);
CREATE POLICY "Read admins"            ON admins     FOR SELECT USING (true);

-- ════════════════════════════════════════════════
-- Supabase Storage Bucket
-- ════════════════════════════════════════════════
-- يجب إنشاء bucket باسم "evidences" من لوحة Supabase Storage
-- مع تفعيل "Public bucket" للوصول العام للملفات
