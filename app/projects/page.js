'use client'

import { useState, useEffect } from "react"

export default function Projects() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(data => { setPosts(data.slice(0, 12)); setLoading(false) })
  }, [])

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: "48px 32px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <span className="tag-accent" style={{ display: "inline-flex", marginBottom: "16px" }}>
          {filtered.length} RECORDS
        </span>
        <h1 style={{
          fontSize: "40px", fontWeight: "700",
          color: "var(--text-primary)",
          letterSpacing: "-1px", marginBottom: "8px",
        }}>Projects</h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px", color: "var(--text-muted)",
        }}>Fetched from JSONPlaceholder API</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "32px", position: "relative", maxWidth: "400px" }}>
        <span style={{
          position: "absolute", left: "14px", top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px", color: "var(--text-muted)",
        }}>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search projects..."
          style={{
            width: "100%", padding: "12px 16px 12px 36px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text-primary)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px", color: "var(--text-muted)",
        }}>
          fetching data...
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
        }}>
          {filtered.map(post => (
            <div key={post.id} className="card" style={{ padding: "24px" }}>
              <div style={{ marginBottom: "12px" }}>
                <span className="tag-accent">#{post.id}</span>
              </div>
              <h3 style={{
                fontSize: "14px", fontWeight: "600",
                color: "var(--text-primary)",
                marginBottom: "10px", lineHeight: "1.4",
              }}>{post.title}</h3>
              <p style={{
                fontSize: "12px", color: "var(--text-muted)",
                lineHeight: "1.7",
                fontFamily: "'IBM Plex Mono', monospace",
              }}>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}