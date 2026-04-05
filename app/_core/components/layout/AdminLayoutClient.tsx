'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/app/_core/components/layout/AdminSidebar';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
}

export default function AdminLayoutClient({ children, title, breadcrumb, actions }: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <div className="dashboard-shell">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-content">
        <header className="top-header">
          {/* Hamburger — shown on mobile via CSS, hidden on desktop */}
          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-menu-btn"
            aria-label="فتح القائمة"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', flex: 1 }}>
            <div className="header-title">{title}</div>
            {breadcrumb && <div className="header-breadcrumb">{breadcrumb}</div>}
          </div>

          <div className="header-actions">
            {actions}
            <div className="header-avatar" title="المسؤول">م</div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
