'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayoutClient from '@/app/_core/components/layout/AdminLayoutClient';
import { localDb } from '@/app/_core/db/localDb';
import type { Domain, Indicator, Evidence } from '@/app/_core/types';

const DOMAIN_META: Record<string, { icon: string; color: string; bg: string }> = {
  '1': { icon: '🏛️', color: 'var(--domain-1)', bg: 'var(--domain-1-bg)' },
  '2': { icon: '📚', color: 'var(--domain-2)', bg: 'var(--domain-2-bg)' },
  '3': { icon: '🎯', color: 'var(--domain-3)', bg: 'var(--domain-3-bg)' },
  '4': { icon: '🏫', color: 'var(--domain-4)', bg: 'var(--domain-4-bg)' },
};

export default function AdminDomainPage() {
  const params = useParams();
  const router = useRouter();
  const domainId = params.domainId as string;

  const [domain, setDomain] = useState<Domain | null>(null);
  const [indicators, setIndicators] = useState<(Indicator & { evidences_count: number })[]>([]);
  const [evidences, setEvidences] = useState<ReturnType<typeof localDb.getEvidencesByIndicator>>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const meta = DOMAIN_META[domainId] ?? DOMAIN_META['1'];

  const loadData = useCallback(() => {
    const dom = localDb.getDomainByOrderNum(parseInt(domainId));
    if (!dom) { setLoading(false); return; }

    setDomain(dom);

    const inds = localDb.getIndicatorsByDomain(dom.id).map(ind => ({
      ...ind,
      evidences_count: localDb.getEvidencesCountByIndicator(ind.id),
    }));
    setIndicators(inds);

    if (inds.length > 0) setSelectedIndicator(inds[0].id);
    setLoading(false);
  }, [domainId]);

  useEffect(() => {
    const adminId = sessionStorage.getItem('admin_id');
    if (!adminId) { router.push('/admin/login'); return; }
    loadData();
  }, [router, loadData]);

  useEffect(() => {
    if (selectedIndicator) {
      setEvidences(localDb.getEvidencesByIndicator(selectedIndicator));
    }
  }, [selectedIndicator]);

  const selectedInd = indicators.find(i => i.id === selectedIndicator);

  if (loading) {
    return (
      <AdminLayoutClient title="..." breadcrumb="المجالات">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
          <span className="spinner" style={{ borderColor: 'var(--border)', borderTopColor: meta.color, width: '32px', height: '32px' }} />
        </div>
      </AdminLayoutClient>
    );
  }

  return (
    <AdminLayoutClient
      title={domain?.name ?? 'المجال'}
      breadcrumb={`لوحة التحكم / المجالات / ${domain?.name ?? ''}`}
      actions={<Link href="/admin" className="btn btn-outline btn-sm">← رجوع</Link>}
    >
      {/* Domain Banner */}
      <div
        className="card animate-fade"
        style={{ padding: '24px 28px', marginBottom: '24px', borderTop: `3px solid ${meta.color}`, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
          {meta.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{domain?.name}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{domain?.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', padding: '12px 20px', background: meta.bg, borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: meta.color }}>{indicators.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>مؤشر</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {indicators.reduce((s, i) => s + i.evidences_count, 0)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>شاهد</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Indicators List */}
        <div className="card" style={{ padding: '4px' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div className="section-title" style={{ fontSize: '14px' }}><span>📌</span> المؤشرات</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px' }}>
            {indicators.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndicator(ind.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
                  borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'right',
                  width: '100%', fontFamily: 'inherit', fontSize: '13px', fontWeight: 500,
                  transition: 'all 0.2s',
                  background: selectedIndicator === ind.id ? meta.bg : 'transparent',
                  color: selectedIndicator === ind.id ? meta.color : 'var(--text-secondary)',
                  borderRight: selectedIndicator === ind.id ? `3px solid ${meta.color}` : '3px solid transparent',
                }}
              >
                <span style={{ flex: 1, lineHeight: '1.5' }}>{ind.name}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 700, minWidth: '22px', height: '22px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: ind.evidences_count > 0 ? meta.color : 'var(--bg)',
                  color: ind.evidences_count > 0 ? 'white' : 'var(--text-muted)',
                  border: `1px solid ${ind.evidences_count > 0 ? meta.color : 'var(--border)'}`,
                }}>
                  {ind.evidences_count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Evidences Panel */}
        <div>
          {selectedInd && (
            <>
              <div className="section-header">
                <div>
                  <h2 className="section-title"><span>📁</span> شواهد: {selectedInd.name}</h2>
                  {selectedInd.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedInd.description}</p>
                  )}
                </div>
              </div>

              {evidences.length === 0 ? (
                <div className="card">
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>لا توجد شواهد لهذا المؤشر</div>
                    <div className="empty-state-text">سيرفع المنسوبون الشواهد من خلال بوابتهم</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {evidences.map((ev) => (
                    <div key={ev.id} className="evidence-item animate-fade">
                      <div className="evidence-file-icon">
                        {ev.file_name?.endsWith('.pdf') ? '📄' : ev.file_name?.match(/\.(jpg|jpeg|png)$/i) ? '🖼️' : '📎'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{ev.name}</div>
                        {ev.description && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{ev.description}</div>
                        )}
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                          <span>👤 {ev.staff?.full_name ?? 'غير معروف'}</span>
                          <span>🗓 {new Date(ev.created_at).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                      {ev.file_url && ev.file_url !== '' && (
                        <a href={localDb.getFileUrl(ev.file_url)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                          📥 عرض
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayoutClient>
  );
}
