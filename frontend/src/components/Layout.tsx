import { Link, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-md text-sm font-medium transition ${
      pathname === path
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Career Assistant</h1>
          <nav className="flex gap-2">
            <Link to="/" className={linkClass("/")}>
              Generate
            </Link>
            <Link to="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
