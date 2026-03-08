export default function About() {
  return (
    <div style={{ padding: "48px 32px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "8px" }}>
        <span className="tag-accent">ABOUT</span>
      </div>
      <h1 style={{
        fontSize: "40px", fontWeight: "700",
        color: "var(--text-primary)",
        letterSpacing: "-1px", marginBottom: "16px", marginTop: "16px",
      }}>
        About this app
      </h1>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "13px", color: "var(--text-muted)",
        lineHeight: "1.9", marginBottom: "48px",
      }}>
        A full-stack Web3 application built with Next.js, Firebase, Ethers.js and Tailwind CSS.
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
        {[
          { label: "FRAMEWORK", value: "Next.js 16 — App Router", desc: "File-based routing, server components, API routes" },
          { label: "STYLING", value: "Tailwind CSS v4", desc: "Utility-first CSS with custom design tokens" },
          { label: "AUTH", value: "Firebase Auth", desc: "Google OAuth with email whitelist protection" },
          { label: "WEB3", value: "Ethers.js", desc: "MetaMask wallet connection and on-chain data" },
          { label: "DEPLOYMENT", value: "Vercel", desc: "Auto-deploy from GitHub with edge functions" },
        ].map(({ label, value, desc }) => (
          <div key={label} className="card" style={{
            padding: "20px 24px",
            display: "flex", alignItems: "center", gap: "24px",
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px", color: "var(--text-muted)",
              letterSpacing: "2px", minWidth: "100px",
            }}>{label}</span>
            <div>
              <p style={{
                fontSize: "14px", fontWeight: "600",
                color: "var(--text-primary)", marginBottom: "2px",
              }}>{value}</p>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px", color: "var(--text-muted)",
              }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}