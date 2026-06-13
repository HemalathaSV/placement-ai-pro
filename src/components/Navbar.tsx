import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { location } = useRouterState();
  const path = location.pathname;

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent-glow text-brand-foreground shadow-lg">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Place AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Agentic Placement Prep</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                path === l.to
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="ml-1 grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-foreground/5"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
