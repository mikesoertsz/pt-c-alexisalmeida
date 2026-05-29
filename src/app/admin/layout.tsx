import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Schedule — Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-linen text-brand-black font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
