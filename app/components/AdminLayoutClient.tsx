'use client';

import { useState } from 'react';
import AdminSidebar from '@/app/components/AdminSidebar';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
}

export default function AdminLayoutClient({
  children,
  title,
  breadcrumb,
  actions,
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <div className="header-title">{title}</div>
            {breadcrumb && (
              <div className="header-breadcrumb">{breadcrumb}</div>
            )}
          </div>

          <div className="header-actions">
            {actions}
            <div className="header-avatar" title="المسؤول">م</div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
              className="mobile-menu-btn"
              aria-label="فتح القائمة"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
