'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { localDb } from '@/app/_core/db/localDb';
import type { Domain } from '@/app/_core/types';

const DOMAIN_META = [
  { icon: '🏛️', color: 'var(--domain-1)', bg: 'var(--domain-1-bg)', desc: 'الوثائق والقرارات والأنظمة المدرسية' },
  { icon: '📚', color: 'var(--domain-2)', bg: 'var(--domain-2-bg)', desc: 'الخطط الدراسية والأنشطة التربوية' },
  { icon: '🎯', color: 'var(--domain-3)', bg: 'var(--domain-3-bg)', desc: 'نتائج التحصيل والأداء الأكاديمي' },
  { icon: '🏫', color: 'var(--domain-4)', bg: 'var(--domain-4-bg)', desc: 'المرافق والموارد والبيئة التعليمية' },
];

export default function StaffDashboardPage() {
  const router = useRouter();
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [myEvidencesCount, setMyEvidencesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback((staffId: string) => {
    setDomains(localDb.getDomains());
    setMyEvidencesCount(localDb.getEvidencesByStaff(staffId).length);
    setLoading(false);
  }, []);

  useEffect(() => {
    const staffId = sessionStorage.getItem('staff_id');
    if (!staffId) { router.push('/staff/login'); return; }
    setStaffName(sessionStorage.getItem('staff_name') ?? '');
    setStaffRole(sessionStorage.getItem('staff_role') ?? '');
    loadData(staffId);
  }, [router, loadData]);

  function handleLogout() {
    sessionStorage.clear();
    router.push('/');
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <span className="spinner" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--green)', width: '36px', height: '36px' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', background: 'var(--green)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            🏫
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>لوحة التميز الرقمي</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>الإبتدائية الحادي عشر</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{staffName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{staffRole || 'منسوب'}</div>
          </div>
          <div style={{ width: '36px', height: '36px', background: 'var(--green-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'var(--green)', fontWeight: 700 }}>
            {staffName.charAt(0)}
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">خروج 🚪</button>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Welcome Banner */}
        <div
          className="animate-fade"
          style={{
            background: 'linear-gradient(135deg, var(--green) 0%, #047857 100%)',
            borderRadius: '20px', padding: '28px 32px', marginBottom: '32px',
            color: 'white', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ fontSize: '13px', opacity: 0.85, marginBottom: '6px' }}>🌟 مرحباً بك</div>
          <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>{staffName}</div>
          <div style={{ fontSize: '14px', opacity: 0.75, marginBottom: '20px' }}>{staffRole || 'منسوب'} — الإبتدائية الحادي عشر</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '10px 18px', fontSize: '13px' }}>
              <span style={{ fontSize: '20px', display: 'block', fontWeight: 800 }}>{myEvidencesCount}</span>
              شاهد مرفوع
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '10px 18px', fontSize: '13px' }}>
              <span style={{ fontSize: '20px', display: 'block', fontWeight: 800 }}>4</span>
              مجال متاح
            </div>
          </div>
        </div>

        {/* Domains */}
        <div className="section-header">
          <h2 className="section-title"><span>🗂️</span> اختر المجال لرفع الشواهد</h2>
        </div>

        <div className="domains-grid">
          {domains.map((domain, i) => {
            const meta = DOMAIN_META[i] ?? DOMAIN_META[0];
            return (
              <Link
                key={domain.id}
                href={`/staff/domains/${domain.id}`}
                className={`domain-card animate-fade stagger-${i + 1}`}
                style={{ '--domain-color': meta.color } as React.CSSProperties}
              >
                <div className="domain-card-icon" style={{ background: meta.bg, color: meta.color }}>{meta.icon}</div>
                <div className="domain-card-name">{domain.name}</div>
                <div className="domain-card-desc">{meta.desc}</div>
                <div className="domain-card-meta">
                  <span className="domain-card-count">رفع الشواهد</span>
                  <span className="domain-card-arrow">←</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
