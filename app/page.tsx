import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background Pattern */}
      <div className="landing-bg-pattern" />

      {/* Content */}
      <div className="landing-content animate-fade">
        {/* Badge */}
        <div className="landing-badge">
          <span>⭐</span>
          <span>منصة الاعتماد المدرسي</span>
        </div>

        {/* Title */}
        <h1 className="landing-title">
          لوحة{" "}
          <span className="landing-title-accent">التميز الرقمي</span>
          <br />
          للإبتدائية الحادي عشر
        </h1>

        {/* Subtitle */}
        <p className="landing-subtitle">
          منصة متكاملة لإدارة شواهد الاعتماد المدرسي وتوثيق الأدلة
          <br />
          عبر المجالات الأربعة بكل سهولة واحترافية
        </p>

        {/* Buttons */}
        <div className="landing-buttons">
          <Link href="/admin/login" className="landing-btn landing-btn-primary">
            <span>🛡️</span>
            <span>دخول المسؤول</span>
          </Link>

          <div
            className="landing-divider"
            style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}
          />

          <Link href="/staff/login" className="landing-btn landing-btn-green">
            <span>👤</span>
            <span>دخول المنسوبين</span>
          </Link>
        </div>

        {/* Domains Preview */}
        <div
          style={{
            marginTop: "48px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            maxWidth: "320px",
            margin: "48px auto 0",
          }}
        >
          {[
            { icon: "🏛️", name: "الإدارة المدرسية", color: "#3B82F6" },
            { icon: "📚", name: "التعليم والتعلم", color: "#10B981" },
            { icon: "🎯", name: "نواتج التعلم", color: "#F59E0B" },
            { icon: "🏫", name: "البيئة المدرسية", color: "#8B5CF6" },
          ].map((d, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
                animation: `fadeIn 0.4s ease both`,
                animationDelay: `${0.1 * i}s`,
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>
                {d.icon}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#94A3B8",
                  lineHeight: "1.4",
                }}
              >
                {d.name}
              </div>
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  background: d.color,
                  borderRadius: "2px",
                  margin: "6px auto 0",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} - الإبتدائية الحادي عشر</p>
      </div>
    </div>
  );
}
