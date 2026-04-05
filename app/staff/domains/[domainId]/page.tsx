'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { localDb } from '@/app/_core/db/localDb';
import type { Domain, Indicator } from '@/app/_core/types';

const DOMAIN_COLORS = [
  { color: 'var(--domain-1)', bg: 'var(--domain-1-bg)', icon: '🏛️' },
  { color: 'var(--domain-2)', bg: 'var(--domain-2-bg)', icon: '📚' },
  { color: 'var(--domain-3)', bg: 'var(--domain-3-bg)', icon: '🎯' },
  { color: 'var(--domain-4)', bg: 'var(--domain-4-bg)', icon: '🏫' },
];

export default function StaffDomainPage() {
  const params = useParams();
  const router = useRouter();
  const domainId = params.domainId as string;

  const [domain, setDomain] = useState<Domain | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const dom = localDb.getDomainById(domainId);
    if (dom) {
      setDomain(dom);
      setIndicators(localDb.getIndicatorsByDomain(domainId));
    }
    setLoading(false);
  }, [domainId]);

  useEffect(() => {
    const staffId = sessionStorage.getItem('staff_id');
    if (!staffId) { router.push('/staff/login'); return; }
    loadData();
  }, [router, loadData]);

  const colorIdx = (domain?.order_num ?? 1) - 1;
  const meta = DOMAIN_COLORS[colorIdx] ?? DOMAIN_COLORS[0];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <span className="spinner" style={{ borderColor: 'var(--border)', borderTopColor: meta.color, width: '36px', height: '36px' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/staff" className="btn btn-ghost btn-sm">→ رجوع</Link>
        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{meta.icon} {domain?.name}</div>
      </div>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 20px' }}>
        <div className="card animate-fade" style={{ padding: '24px', marginBottom: '28px', borderTop: `3px solid ${meta.color}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
            {meta.icon}
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800 }}>{domain?.name}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {domain?.description ?? 'اختر المؤشر لرفع الشواهد والأدلة'}
            </p>
          </div>
        </div>

        <div className="section-header">
          <h2 className="section-title"><span>📌</span> المؤشرات — اختر للرفع</h2>
          <span className="badge badge-gray">{indicators.length} مؤشر</span>
        </div>

        {indicators.length === 0 ? (
          <div className="card"><div className="empty-state">
            <div className="empty-state-icon">📌</div>
            <div style={{ fontWeight: 600 }}>لا توجد مؤشرات</div>
          </div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {indicators.map((ind, i) => (
              <Link
                key={ind.id}
                href={`/staff/domains/${domainId}/indicators/${ind.id}`}
                className={`indicator-card animate-fade stagger-${Math.min(i + 1, 5)}`}
              >
                <div className="indicator-icon" style={{ background: meta.bg, color: meta.color, fontWeight: 700 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{ind.name}</div>
                  {ind.description && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>{ind.description}</div>
                  )}
                </div>
                <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>←</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
