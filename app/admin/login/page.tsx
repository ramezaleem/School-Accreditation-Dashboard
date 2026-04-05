'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { localDb } from '@/app/_core/db/localDb';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX
    await new Promise(r => setTimeout(r, 600));

    const admin = localDb.checkAdminLogin(username, password);

    if (!admin) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      setLoading(false);
      return;
    }

    sessionStorage.setItem('admin_id', admin.id);
    sessionStorage.setItem('admin_username', admin.username);
    sessionStorage.setItem('admin_role', 'admin');
    router.push('/admin');
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🛡️</div>
          <div className="auth-school-name">لوحة التميز الرقمي</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            الإبتدائية الحادي عشر
          </div>
        </div>

        <h1 className="auth-page-title">دخول المسؤول</h1>
        <p className="auth-page-sub">لوحة إدارة الاعتماد المدرسي</p>

        {/* Hint */}
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          <span>💡</span>
          <span style={{ fontSize: '12px' }}>
            للتجربة: اسم المستخدم <strong>admin</strong> — كلمة المرور <strong>admin123</strong>
          </span>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-username">اسم المستخدم</label>
            <input
              id="admin-username"
              type="text"
              className="form-input"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">كلمة المرور</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : <span>→</span>}
            <span>{loading ? 'جارٍ الدخول...' : 'دخول'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
