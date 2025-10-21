import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { AccessProvider } from "@/components/AccessProvider";

export const metadata = { title: "SIPAKRT", description: "Community Dashboard" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#F4F6FB] text-slate-800">
        <AccessProvider>
          <Topbar />
          <div className="mx-auto max-w-7xl px-4 py-6 flex gap-6">
            <Sidebar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
          <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-slate-500">
            SIPAKRT – modern, fluid, minimalist.
          </footer>
        </AccessProvider>
      </body>
    </html>
  );
}
