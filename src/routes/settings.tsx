import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Key, Check, Trash2, Sun, Moon, Zap } from "lucide-react";
import { getGeminiKey, setGeminiKey, isDemoMode, setDemoMode } from "@/lib/agents";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Place AI" },
      { name: "description", content: "Configure your Gemini API key and appearance for Place AI." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [demoMode, setDemoModeLocal] = useState(isDemoMode());
  const envPresent = !!(import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  useEffect(() => {
    const k = getGeminiKey();
    if (k) setSaved(maskKey(k));
  }, []);

  const save = () => {
    setGeminiKey(key.trim());
    setSaved(key.trim() ? maskKey(key.trim()) : null);
    setKey("");
  };

  const clear = () => {
    setGeminiKey("");
    setSaved(envPresent ? maskKey(import.meta.env.VITE_GEMINI_API_KEY as string) : null);
    setKey("");
  };

  const toggleDemoMode = () => {
    const newValue = !demoMode;
    setDemoModeLocal(newValue);
    setDemoMode(newValue);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your Gemini API key, Demo Mode, and theme.</p>

      <section className="glass mt-8 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-glow/15 text-accent-glow"><Key className="h-5 w-5" /></span>
          <div>
            <h2 className="font-display text-lg font-semibold">Gemini API Key</h2>
            <p className="text-xs text-muted-foreground">Used by every agent. Stored locally in your browser.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <input
            type="password"
            placeholder="Paste your Gemini API key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent-glow"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={save}
              disabled={!key.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-accent-glow px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> Save key
            </button>
            <button
              onClick={clear}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-foreground/5"
            >
              <Trash2 className="h-4 w-4" /> Clear stored key
            </button>
          </div>

          <div className="rounded-xl border border-border bg-background/40 p-4 text-sm">
            <div className="font-semibold">Active key</div>
            <div className="mt-1 text-muted-foreground">
              {saved ? (
                <>Using <code className="rounded bg-foreground/10 px-1.5 py-0.5">{saved}</code> {envPresent && !getGeminiKey()?.startsWith(import.meta.env.VITE_GEMINI_API_KEY as string) === false ? " (from environment)" : " (from browser storage)"}</>
              ) : (
                <>No key configured. Get one at <a className="underline" href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>.</>
              )}
            </div>
            {envPresent && (
              <div className="mt-2 text-xs text-muted-foreground">A <code>VITE_GEMINI_API_KEY</code> environment variable is detected as a fallback.</div>
            )}
          </div>
        </div>
      </section>

      <section className="glass mt-6 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-500/15 text-yellow-600"><Zap className="h-5 w-5" /></span>
          <div>
            <h2 className="font-display text-lg font-semibold">Demo Mode</h2>
            <p className="text-xs text-muted-foreground">Generate realistic demo responses when Gemini is unavailable.</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={toggleDemoMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
              demoMode ? "bg-yellow-500" : "bg-foreground/10"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                demoMode ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium">{demoMode ? "Demo Mode ON" : "Demo Mode OFF"}</span>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-sm">
          <p className="text-muted-foreground">
            When enabled, Place AI generates realistic demo responses if the Gemini API becomes unavailable (quota exceeded, network error, etc.).
            This is useful for presentations and testing.
          </p>
        </div>
      </section>

      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">Appearance</h2>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={"inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm " + (theme === "light" ? "border-accent-glow bg-accent-glow/10" : "border-border")}
          ><Sun className="h-4 w-4" /> Light</button>
          <button
            onClick={() => setTheme("dark")}
            className={"inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm " + (theme === "dark" ? "border-accent-glow bg-accent-glow/10" : "border-border")}
          ><Moon className="h-4 w-4" /> Dark</button>
        </div>
      </section>
    </main>
  );
}

function maskKey(k: string) {
  if (k.length <= 8) return "•".repeat(k.length);
  return k.slice(0, 4) + "…" + k.slice(-4);
}
