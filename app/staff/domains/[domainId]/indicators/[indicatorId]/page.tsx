'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { localDb } from '@/app/_core/db/localDb';
import type { Indicator } from '@/app/_core/types';

export default function EvidenceUploadPage() {
  const params = useParams();
  const router = useRouter();
  const domainId = params.domainId as string;
  const indicatorId = params.indicatorId as string;

  const [indicator, setIndicator] = useState<(Indicator & { domains?: { name: string } }) | null>(null);
  const [evidences, setEvidences] = useState<ReturnType<typeof localDb.getEvidencesByIndicator>>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(() => {
    const ind = localDb.getIndicatorById(indicatorId);
    if (ind) setIndicator(ind as typeof indicator);
    setEvidences(localDb.getEvidencesByIndicator(indicatorId));
    setLoading(false);
  }, [indicatorId]);

  useEffect(() => {
    const staffId = sessionStorage.getItem('staff_id');
    if (!staffId) { router.push('/staff/login'); return; }
    loadData();
  }, [router, loadData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('اسم الشاهد مطلوب'); return; }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const staffId = sessionStorage.getItem('staff_id')!;
      let fileUrl = '';
      let fileName = '';

      if (file) {
        const result = await localDb.uploadFile(file, staffId);
        fileUrl  = result.url;
        fileName = result.name;
      }

      localDb.addEvidence({
        indicator_id: indicatorId,
        staff_id: staffId,
        name: name.trim(),
        description: description.trim(),
        file_url: fileUrl,
        file_name: fileName,
      });

      setSuccess('✅ تم رفع الشاهد بنجاح!');
      setName('');
      setDescription('');
      setFile(null);
      setEvidences(localDb.getEvidencesByIndicator(indicatorId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الرفع');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function getFileIcon(fileName: string) {
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return '🖼️';
    if (fileName.match(/\.(doc|docx)$/i)) return '📝';
    if (fileName.match(/\.(xls|xlsx)$/i)) return '📊';
    return '📎';
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
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href={`/staff/domains/${domainId}`} className="btn btn-ghost btn-sm">→ رجوع</Link>
        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📌 {indicator?.name}</div>
      </div>

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Indicator Info */}
        <div className="card animate-fade" style={{ padding: '24px', marginBottom: '28px', borderRight: '4px solid var(--green)' }}>
          <div style={{ fontSize: '13px', color: 'var(--green)', fontWeight: 600, marginBottom: '6px' }}>المؤشر</div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{indicator?.name}</h1>
          {indicator?.description && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.6' }}>{indicator.description}</p>
          )}
        </div>

        {/* Upload Form */}
        <div className="card animate-fade" style={{ padding: '28px', marginBottom: '28px' }}>
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <h2 className="section-title"><span>📤</span> إضافة شاهد جديد</h2>
          </div>

          {error   && <div className="alert alert-error"   style={{ marginBottom: '16px' }}><span>⚠️</span><span>{error}</span></div>}
          {success && <div className="alert alert-success" style={{ marginBottom: '16px' }}><span>✅</span><span>{success}</span></div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="ev-name">اسم الشاهد <span style={{ color: '#DC2626' }}>*</span></label>
              <input id="ev-name" type="text" className="form-input" placeholder="مثال: محضر اجتماع مجلس المدرسة" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ev-desc">وصف الشاهد (اختياري)</label>
              <textarea id="ev-desc" className="form-input form-textarea" placeholder="أدخل وصفاً مختصراً..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">رفع ملف الشاهد (اختياري)</label>
              <div
                className={`upload-zone${dragOver ? ' dragover' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                {file ? (
                  <>
                    <div className="upload-zone-icon">{getFileIcon(file.name)}</div>
                    <div className="upload-zone-title">{file.name}</div>
                    <div className="upload-zone-sub">{(file.size / 1024 / 1024).toFixed(2)} MB — اضغط لتغيير الملف</div>
                  </>
                ) : (
                  <>
                    <div className="upload-zone-icon">📂</div>
                    <div className="upload-zone-title">اسحب الملف هنا أو اضغط للاختيار</div>
                    <div className="upload-zone-sub">PDF, Word, Excel, صور — حتى 20MB</div>
                  </>
                )}
              </div>
              {file && (
                <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: '6px', color: '#DC2626' }} onClick={() => setFile(null)}>
                  🗑️ إزالة الملف
                </button>
              )}
            </div>

            <button id="submit-evidence-btn" type="submit" className="btn btn-green btn-full btn-lg" disabled={uploading}>
              {uploading ? <span className="spinner" /> : <span>📤</span>}
              <span>{uploading ? 'جارٍ الرفع...' : 'رفع الشاهد'}</span>
            </button>
          </form>
        </div>

        {/* Evidences List */}
        <div className="section-header">
          <h2 className="section-title"><span>📁</span> الشواهد المرفوعة</h2>
          <span className="badge badge-green">{evidences.length} شاهد</span>
        </div>

        {evidences.length === 0 ? (
          <div className="card"><div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>لا توجد شواهد مرفوعة بعد</div>
            <div className="empty-state-text">ارفع أول شاهد باستخدام النموذج أعلاه</div>
          </div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {evidences.map((ev, i) => (
              <div key={ev.id} className={`evidence-item animate-fade stagger-${Math.min(i + 1, 5)}`}>
                <div className="evidence-file-icon">{ev.file_name ? getFileIcon(ev.file_name) : '📝'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{ev.name}</div>
                  {ev.description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{ev.description}</div>}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {ev.file_name && <span>📎 {ev.file_name}</span>}
                    <span>🗓 {new Date(ev.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                {ev.file_url && (
                  <button
                    onClick={() => {
                      const url = localDb.getFileUrl(ev.file_url);
                      if (url) { const a = document.createElement('a'); a.href = url; a.download = ev.file_name || 'file'; a.click(); }
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    📥 تحميل
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
