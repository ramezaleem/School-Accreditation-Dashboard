'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const DOMAINS = [
  { id: '1', name: 'الإدارة المدرسية', icon: '🏛️', color: 'var(--domain-1)' },
  { id: '2', name: 'التعليم والتعلم', icon: '📚', color: 'var(--domain-2)' },
  { id: '3', name: 'نواتج التعلم', icon: '🎯', color: 'var(--domain-3)' },
  { id: '4', name: 'البيئة المدرسية', icon: '🏫', color: 'var(--domain-4)' },
];

const NAV_ITEMS = [
  { href: '/admin', label: 'لوحة التحكم', icon: '📊' },
  { href: '/admin/staff', label: 'إدارة المنسوبين', icon: '👥' },
  { href: '/admin/evidences', label: 'الشواهد والأدلة', icon: '📁' },
  { href: '/admin/reports', label: 'التقارير', icon: '📈' },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    sessionStorage.clear();
    router.push('/');
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 49, display: 'none',
          }}
          className="mobile-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        {/* Header / Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🏫</div>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">لوحة التميز الرقمي</span>
              <span className="sidebar-logo-sub">الإبتدائية الحادي عشر</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Main */}
          <div className="sidebar-section-label">الرئيسية</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Domains */}
          <div className="sidebar-section-label" style={{ marginTop: '8px' }}>المجالات</div>
          {DOMAINS.map((domain, i) => (
            <Link
              key={domain.id}
              href={`/admin/domains/${domain.id}`}
              className={`sidebar-link ${pathname.includes(`/admin/domains/${domain.id}`) ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{domain.icon}</span>
              <span style={{ flex: 1 }}>{domain.name}</span>
              <span
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: domain.color, flexShrink: 0,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            </Link>
          ))}

          {/* Settings */}
          <div className="sidebar-section-label" style={{ marginTop: '8px' }}>الإعدادات</div>
          <Link
            href="/admin/settings"
            className={`sidebar-link ${pathname === '/admin/settings' ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-link-icon">⚙️</span>
            <span>الإعدادات</span>
          </Link>
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}
          >
            <span className="sidebar-link-icon">🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
