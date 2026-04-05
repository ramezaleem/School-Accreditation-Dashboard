import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'بوابة المنسوبين - التميز الرقمي',
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
