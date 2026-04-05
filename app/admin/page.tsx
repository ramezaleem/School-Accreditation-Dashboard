'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayoutClient from '@/app/_core/components/layout/AdminLayoutClient';
import { localDb } from '@/app/_core/db/localDb';
import type { Domain } from '@/app/_core/types';

const DOMAIN_META = [
  { icon: '🏛️', color: 'var(--domain-1)', bg: 'var(--domain-1-bg)' },
  { icon: '📚', color: 'var(--domain-2)', bg: 'var(--domain-2-bg)' },
  { icon: '🎯', color: 'var(--domain-3)', bg: 'var(--domain-3-bg)' },
  { icon: '🏫', color: 'var(--domain-4)', bg: 'var(--domain-4-bg)' },
];

interface DomainWithStats extends Domain {
  indicators_count: number;
  evidences_count: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<DomainWithStats[]>([]);
  const [stats, setStats] = useState({ domains: 0, indicators: 0, evidences: 0, staff: 0 });
  const [recentEvidences, setRecentEvidences] = useState<ReturnType<typeof localDb.getRecentEvidences>>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setStats(localDb.getStats());
    setDomains(localDb.getDomainsWithStats());
    setRecentEvidences(localDb.getRecentEvidences(5));
    setLoading(false);
  }, []);

  useEffect(() => {
    const adminId = sessionStorage.getItem('admin_id');
    if (!adminId) { router.push('/admin/login'); return; }
    loadData();
  }, [router, loadData]);

  const statsCards = [
    { label: 'المجالات',          value: stats.domains,    icon: '🗂️', color: 'var(--domain-1)', bg: 'var(--domain-1-bg)' },
    { label: 'المؤشرات',          value: stats.indicators, icon: '📌', color: 'var(--domain-3)', bg: 'var(--domain-3-bg)' },
    { label: 'الشواهد المرفوعة',  value: stats.evidences,  icon: '📁', color: 'var(--domain-2)', bg: 'var(--domain-2-bg)' },
    { label: 'المنسوبين الفاعلين', value: stats.staff,      icon: '👥', color: 'var(--domain-4)', bg: 'var(--domain-4-bg)' },
  ];

  if (loading) {
    return (
      <AdminLayoutClient title="لوحة التحكم" breadcrumb="نظرة عامة على الاعتماد المدرسي">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
          <span className="spinner" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)', width: '32px', height: '32px' }} />
          <span style={{ color: 'var(--text-muted)' }}>جارٍ التحميل...</span>
        </div>
      </AdminLayoutClient>
    );
  }

  return (
    <AdminLayoutClient title="لوحة التحكم" breadcrumb="نظرة عامة على الاعتماد المدرسي">
      {/* Stats */}
      <div className="stats-grid animate-fade">
        {statsCards.map((s, i) => (
          <div key={i} className={`stat-card stagger-${i + 1}`}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Domains */}
      <div className="section-header" style={{ marginTop: '32px' }}>
        <h2 className="section-title"><span>🗂️</span> المجالات الأربعة</h2>
      </div>

      <div className="domains-grid">
        {domains.map((domain, i) => {
          const meta = DOMAIN_META[i] ?? DOMAIN_META[0];
          return (
            <Link
              key={domain.id}
              href={`/admin/domains/${domain.order_num}`}
              className={`domain-card animate-fade stagger-${i + 1}`}
              style={{ '--domain-color': meta.color } as React.CSSProperties}
            >
              <div className="domain-card-icon" style={{ background: meta.bg, color: meta.color }}>
                {meta.icon}
              </div>
              <div className="domain-card-name">{domain.name}</div>
              <div className="domain-card-desc">{domain.description}</div>
              <div className="domain-card-meta">
                <span className="domain-card-count">{domain.indicators_count} مؤشر</span>
                <span className="badge" style={{ background: meta.bg, color: meta.color }}>
                  {domain.evidences_count} شاهد
                </span>
                <span className="domain-card-arrow">←</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Evidences */}
      <div className="section-header" style={{ marginTop: '36px' }}>
        <h2 className="section-title"><span>🕐</span> آخر الشواهد المرفوعة</h2>
        <Link href="/admin/evidences" className="btn btn-outline btn-sm">عرض الكل</Link>
      </div>

      {recentEvidences.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>لا توجد شواهد مرفوعة بعد</div>
            <div className="empty-state-text">سيظهر هنا الشواهد بعد رفعها من قِبل المنسوبين</div>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>اسم الشاهد</th>
                <th>المؤشر</th>
                <th>المجال</th>
                <th>المنسوب</th>
                <th>تاريخ الرفع</th>
              </tr>
            </thead>
            <tbody>
              {recentEvidences.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.name}</td>
                  <td>{ev.indicators?.name ?? '—'}</td>
                  <td><span className="badge badge-primary">{ev.indicators?.domains?.name ?? '—'}</span></td>
                  <td>{ev.staff?.full_name ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {new Date(ev.created_at).toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayoutClient>
  );
}
