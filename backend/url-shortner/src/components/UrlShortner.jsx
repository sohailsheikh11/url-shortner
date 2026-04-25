import { useState, useCallback } from "react";
import Navbar from "./NavBar";

const API = "http://localhost:3000/api/url/shorten";

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function CopyButton({ text, small = false }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: small ? "4px 10px" : "7px 14px",
        border: copied ? "0.5px solid #0F6E56" : "0.5px solid var(--color-border-secondary)",
        borderRadius: "var(--border-radius-md)",
        background: copied ? "#E1F5EE" : "transparent",
        color: copied ? "#0F6E56" : "var(--color-text-secondary)",
        fontSize: small ? 12 : 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function HistoryItem({ item, onRemove }) {
  const truncate = (str, n) => str.length > n ? str.slice(0, n) + "…" : str;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 14px",
      background: "var(--color-background-secondary)",
      borderRadius: "var(--border-radius-md)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <a
          href={item.short}
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            textDecoration: "none",
            display: "flex", alignItems: "center", gap: 4,
          }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
        >
          {item.short} <ExternalIcon />
        </a>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {truncate(item.original, 60)}
        </div>
      </div>
      <CopyButton text={item.short} small />
      <button
        onClick={() => onRemove(item.short)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--color-text-tertiary)", padding: 4,
          display: "flex", alignItems: "center",
          borderRadius: 4,
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-danger)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-tertiary)"}
        title="Remove"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default function URLShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

   const email = localStorage.getItem("email");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("snip_history_" + email) || "[]"); } catch { return []; }
  });

  const saveHistory = (list) => {
    setHistory(list);
    
    localStorage.setItem("snip_history_" + email, JSON.stringify(list));
  };

  const removeItem = (short) => {
    const updated = history.filter(h => h.short !== short);
    saveHistory(updated);
  };

  const shorten = useCallback(async () => {
    setError("");
    const trimmed = url.trim();
    if (!trimmed) { setError("Please enter a URL."); return; }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("snip_token");
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
        body: JSON.stringify({ longUrl: trimmed }),
      });

      
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        console.log("this is d", d);
        throw new Error(d.message || d.error || `Server error (${res.status})`);
      }
      const data = await res.json();

      console.log("this is the data", data);
      const short = `http://localhost:3000/${data.shortCode}`;
      if (!data.shortCode) throw new Error("No shortCode in response. Check your API.");
      setResult({ short, original: trimmed });
      const entry = { short, original: trimmed, time: Date.now() };
      const updated = [entry, ...history.filter(h => h.short !== short)].slice(0, 10);
      saveHistory(updated);
      setUrl("");
    } catch (err) {
      setError(err.message || "Failed to shorten URL.");
    } finally {
      setLoading(false);
    }
  }, [url, history]);

  const handleKeyDown = (e) => { if (e.key === "Enter") shorten(); };

  return (
    <>
    <Navbar activePage="dashboard"/>
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2.5rem 1.25rem", fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
        <div style={{
          width: 38, height: 38,
          background: "var(--color-text-primary)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--color-background-primary)",
        }}>
          <LinkIcon />
        </div>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1 }}>
            snip<span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}>.ly</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2 }}>paste long. get tiny.</div>
        </div>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          type="url"
          value={url}
          onChange={e => { setUrl(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder="https://your-very-long-url.com/goes/here"
          style={{
            flex: 1,
            height: 44,
            padding: "0 14px",
            border: error ? "0.5px solid var(--color-border-danger)" : "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-primary)",
            color: "var(--color-text-primary)",
            fontSize: 14,
            fontFamily: "'Sora', sans-serif",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={e => { e.target.style.borderColor = "var(--color-border-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.05)"; }}
          onBlur={e => { e.target.style.borderColor = error ? "var(--color-border-danger)" : "var(--color-border-secondary)"; e.target.style.boxShadow = "none"; }}
        />
        <button
          onClick={shorten}
          disabled={loading}
          style={{
            padding: "0 22px",
            height: 44,
            border: "none",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-text-primary)",
            color: "var(--color-background-primary)",
            fontFamily: "'Sora', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.15s, transform 0.1s",
            display: "flex", alignItems: "center", gap: 8,
          }}
          onMouseEnter={e => !loading && (e.currentTarget.style.opacity = "0.82")}
          onMouseLeave={e => e.currentTarget.style.opacity = loading ? "0.6" : "1"}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {loading && (
            <span style={{
              width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff", borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }} />
          )}
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "10px 14px",
          background: "var(--color-background-danger)",
          border: "0.5px solid var(--color-border-danger)",
          borderRadius: "var(--border-radius-md)",
          color: "var(--color-text-danger)",
          fontSize: 13,
          marginBottom: 12,
          animation: "slideDown 0.2s ease",
        }}>
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          animation: "fadeIn 0.25s ease",
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Shortened URL
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <a
              href={result.short}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--color-text-primary)",
                textDecoration: "none",
                flex: 1,
                wordBreak: "break-all",
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              {result.short}
            </a>
            <CopyButton text={result.short} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {result.original.length > 70 ? result.original.slice(0, 70) + "…" : result.original}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={{ height: "0.5px", background: "var(--color-border-tertiary)", marginBottom: "1.25rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>
              Recent links ({history.length})
            </span>
            <button
              onClick={() => saveHistory([])}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: "var(--color-text-tertiary)",
                fontFamily: "'Sora', sans-serif",
                padding: "2px 6px", borderRadius: 4,
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-tertiary)"}
            >
              Clear all
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map(item => (
              <HistoryItem key={item.short} item={item} onRemove={removeItem} />
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && !result && (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--color-text-tertiary)", fontSize: 13 }}>
          Your shortened links will appear here
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
    </>
  );
}