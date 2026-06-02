import { useState, useRef } from "react";
import "./App.css";

/* ── Simulated AI output ──────────────────────────────────────── */
const buildOutput = (prompt) => [
  {
    key: "idea",
    icon: "💡",
    label: "Idea",
    value: `An AI-powered tool that turns a one-line founder thought into a complete, structured product vision — instantly. No templates. No consultants. Just clarity.`,
  },
  {
    key: "positioning",
    icon: "🎯",
    label: "Positioning",
    value: `For indie founders who think faster than they can plan. ${
      prompt || "Your product"
    } positions as the fastest path from vague idea to fundable concept.`,
  },
  {
    key: "user_persona",
    icon: "👤",
    label: "User Persona",
    value: `Solo founder, 26–38. Ships fast, has 3 ideas a week, struggles to pick one. Hates Notion templates. Pays for tools that save time. Trusts products that feel opinionated.`,
  },
  {
    key: "core_value",
    icon: "⚡",
    label: "Core Value",
    value: `From raw idea to structured product vision in under 60 seconds. The output/input ratio should feel like magic.`,
  },
  {
    key: "mvp_scope",
    icon: "🗺",
    label: "MVP Scope",
    value: [
      "Prompt input + one structured AI result card",
      "Save & revisit past generations",
      "One-click PDF export",
      "Auth (email / Google)",
    ],
  },
  {
    key: "monetization",
    icon: "💰",
    label: "Monetization",
    value: `Free tier (5 / mo) → Pro $29 / mo → Team $79 / mo. Lead with Pro — $29 is impulse-buy territory for founders. Hard paywall at 5 hits, no soft-lock.`,
  },
];

const SUGGESTIONS = [
  "AI fitness coach for beginners",
  "Crypto dashboard for solo traders",
  "No-code landing page builder",
];

/* ── Component ───────────────────────────────────────────────── */
export default function App() {
  const [prompt, setPrompt]           = useState("");
  const [sections, setSections]       = useState([]);
  const [visibleCount, setVisible]    = useState(0);
  const [generating, setGenerating]   = useState(false);
  const [done, setDone]               = useState(false);
  const resultRef                     = useRef(null);
  const inputRef                      = useRef(null);

  const generate = (override) => {
    const text = override ?? prompt;
    if (!text.trim() || generating) return;

    setPrompt(text);
    setSections([]);
    setVisible(0);
    setDone(false);
    setGenerating(true);

    const built = buildOutput(text);
    setSections(built);

    // Reveal sections one-by-one
    built.forEach((_, i) => {
      setTimeout(() => {
        setVisible(i + 1);
        if (i === built.length - 1) {
          setGenerating(false);
          setDone(true);
        }
      }, 500 + i * 620);
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 600);
  };

  const reset = () => {
    setSections([]);
    setVisible(0);
    setDone(false);
    setGenerating(false);
    setPrompt("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
      {/* Background layers */}
      <div className="bg-grid" />
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="noise" />

      <div className="page">

        {/* ── Nav ── */}
        <nav className="nav">
          <div className="nav-logo">
            <span className="nav-icon">⚡</span>
            <span className="nav-name">Launchify</span>
            <span className="nav-badge">BETA</span>
          </div>
          <div className="nav-links">
            <a className="nav-link" href="#">Pricing</a>
            <a className="nav-link" href="#">Docs</a>
            <button className="nav-cta">Get started →</button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-pill">⚡ AI Product Vision Generator</div>
          <h1 className="hero-h1">
            One prompt.<br />
            <em className="hero-em">Full product vision.</em>
          </h1>
          <p className="hero-sub">
            Positioning · Persona · Core value · MVP scope · Monetization
            <br />All from a single sentence.
          </p>
        </section>

        {/* ── Input zone ── */}
        <div className="input-zone">
          <div className={`input-glass ${generating ? "pulsing" : ""} ${done ? "settled" : ""}`}>
            <input
              ref={inputRef}
              className="main-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="Describe your idea in one sentence…"
            />
            <button
              className={`go-btn ${generating ? "loading" : ""}`}
              onClick={() => generate()}
              disabled={generating}
              aria-label="Generate"
            >
              {generating ? <span className="spinner" /> : "⚡"}
            </button>
          </div>

          {!sections.length && (
            <div className="suggestions">
              <span className="sug-label">Try:</span>
              {SUGGESTIONS.map((s) => (
                <button key={s} className="sug-chip" onClick={() => generate(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Result card ── */}
        {sections.length > 0 && (
          <div className="result-wrap" ref={resultRef}>
            <div className={`result-card ${done ? "done" : "running"}`}>

              {/* Card header */}
              <div className="rc-header">
                <div className="rc-header-left">
                  <span className="rc-title">Product Vision</span>
                  {generating && (
                    <span className="rc-status generating">
                      <span className="status-dot" /> Generating…
                    </span>
                  )}
                  {done && (
                    <span className="rc-status done">
                      <span className="check">✓</span> Complete
                    </span>
                  )}
                </div>
                <div className="rc-header-right">
                  {done && (
                    <>
                      <button className="rc-btn">↓ Export PDF</button>
                      <button className="rc-btn ghost" onClick={reset}>
                        New idea
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="rc-divider" />

              {/* Visible sections */}
              <div className="rc-sections">
                {sections.slice(0, visibleCount).map((s, i) => (
                  <div key={s.key} className="rc-row reveal">
                    <div className="rc-key">
                      <span className="rc-icon">{s.icon}</span>
                      <span className="rc-key-name">{s.label}</span>
                    </div>
                    <div className="rc-val">
                      {Array.isArray(s.value) ? (
                        <ul className="rc-list">
                          {s.value.map((v, j) => (
                            <li key={j}>{v}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{s.value}</p>
                      )}
                      {/* Blinking cursor on last active row */}
                      {i === visibleCount - 1 && generating && (
                        <span className="cursor" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Skeleton rows for upcoming sections */}
                {generating &&
                  sections.slice(visibleCount).map((s) => (
                    <div key={s.key} className="rc-row skeleton">
                      <div className="rc-key">
                        <span className="rc-icon dim">{s.icon}</span>
                        <span className="skel-bar w80" />
                      </div>
                      <div className="rc-val">
                        <span className="skel-bar w60" />
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="footer">
          <span className="footer-logo">⚡ Launchify</span>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Docs</a>
            <a>Telegram - @BALANCIAG0</a>
          </div>
        </footer>

      </div>
    </>
  );
}
