import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Clapperboard, LogOut, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Episodes", href: "/show" },
];

export function StreamHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, loading, logout } = useAuth();
  const { data: access } = trpc.episodes.access.useQuery();

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#080808]/82 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMenu}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#e50914] text-white shadow-[0_0_22px_rgba(229,9,20,.24)]">
            <Clapperboard className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-[-0.04em] text-white">OUR STORY</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${location === item.href ? "text-white" : "text-white/55 hover:text-white"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!loading && (user ? (
            <>
              <span className="max-w-28 truncate text-xs text-white/55">{user.name || "Signed in"}</span>
              <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : null)}
        </div>

        <button onClick={() => setOpen(value => !value)} className="grid h-9 w-9 place-items-center rounded-md text-white md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/8 bg-[#0b0b0b] px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} onClick={closeMenu} className="border-b border-white/7 py-3 text-sm text-white/75">
                {item.label}
              </Link>
            ))}
          </nav>
          {!loading && (user ? (
            <button onClick={() => { logout(); closeMenu(); }} className="mt-4 flex items-center gap-2 text-sm text-white/60"><LogOut className="h-4 w-4" /> Sign out</button>
          ) : null)}
        </div>
      ) : null}
    </header>
  );
}
