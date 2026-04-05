'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { localDb } from '@/app/_core/db/localDb';

export default function StaffLoginPage() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (nationalId.length !== 10) {
      setError('رقم الهوية يجب أن يتكون من 10 أرقام');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const staff = localDb.getStaffByNationalId(nationalId);

    if (!staff) {
      setError('رقم الهوية غير مسجل كمنسوب، تواصل مع إدارة المدرسة');
      setLoading(false);
      return;
    }

    if (!staff.is_active) {
      setError('حسابك غير مفعّل، تواصل مع إدارة المدرسة');
      setLoading(false);
      return;
    }

    sessionStorage.setItem('staff_id', staff.id);
    sessionStorage.setItem('staff_name', staff.full_name);
    sessionStorage.setItem('staff_role', staff.role ?? '');
    sessionStorage.setItem('staff_national_id', staff.national_id);
    router.push('/staff');
  }

  return (
    <div className="auth-page">
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #0F172A 100%)',
        }}
      />

      <div className="auth-card animate-scale" style={{ position: 'relative', zIndex: 1 }}>
        <div className="auth-logo">
          <div
            className="auth-logo-icon"
            style={{ background: 'var(--green)', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}
          >
            👤
          </div>
          <div className="auth-school-name">بوابة المنسوبين</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            الإبتدائية الحادي عشر
          </div>
        </div>

        <h1 className="auth-page-title">دخول المنسوبين</h1>
        <p className="auth-page-sub">أدخل رقم هويتك الوطنية للدخول</p>

        {/* Info */}
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          <span>ℹ️</span>
          <span style={{ fontSize: '12px' }}>
            للتجربة استخدم: <strong>1015285719</strong>
          </span>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="national-id">رقم الهوية الوطنية</label>
            <div style={{ position: 'relative' }}>
              <input
                id="national-id"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                className="form-input"
                placeholder="1XXXXXXXXX"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                required
                style={{
                  paddingLeft: '48px', textAlign: 'center',
                  letterSpacing: '3px', fontSize: '20px',
                }}
              />
              <span
                style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '16px',
                  color: 'var(--text-muted)',
                }}
              >
                🪪
              </span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              {nationalId.length} / 10
            </div>
          </div>

          <button
            id="staff-login-btn"
            type="submit"
            className="btn btn-green btn-full btn-lg"
            disabled={loading || nationalId.length !== 10}
          >
            {loading ? <span className="spinner" /> : <span>→</span>}
            <span>{loading ? 'جارٍ الدخول...' : 'دخول'}</span>
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            إذا لم تتمكن من الدخول، تواصل مع إدارة المدرسة
          </p>
          <div style={{ marginTop: '12px' }}>
            <Link href="/" style={{ color: 'var(--green)', fontWeight: 600, fontSize: '13px' }}>
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
