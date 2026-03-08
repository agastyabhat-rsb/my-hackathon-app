'use client'

import { useState, useEffect } from "react"

export default function Home() {
  const [data, setData] = useState(null)
  const [blockNumber, setBlockNumber] = useState("19,847,231")

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div style={{ padding: "48px 32px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Hero */}
      <div style={{ marginBottom: "48px" }}>
        <div className="tag-accent" style={{ display: "inline-flex", marginBottom: "16px" }}>
          BLOCK #{blockNumber}
        </div>
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: "700",
          color: "var(--text-primary)",
          lineHeight: "1.1",
          letterSpacing: "-1px",
          marginBottom: "16px",
        }}>
          Decentralized<br />
          <span style={{ color: "var(--accent)" }}>Infrastructure</span>
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "13px",
          color: "var(--text-muted)",
          maxWidth: "480px",
          lineHeight: "1.8",
        }}>
          A Web3 application built on Ethereum. Connect your wallet, interact with smart contracts, and explore on-chain data.
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "48px",
      }}>
        {[
          { label: "NETWORK", value: "Ethereum", sub: "Mainnet" },
          { label: "STATUS", value: "Online", sub: "99.9% uptime" },
          { label: "CHAIN_ID", value: "0x1", sub: "EIP-155" },
          { label: "CONSENSUS", value: "PoS", sub: "Post-merge" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="card" style={{ padding: "20px" }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: "var(--text-muted)",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}>{label}</p>
            <p style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}>{value}</p>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              color: "var(--accent)",
            }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* API Data */}
      {data && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "20px",
          }}>
            <h2 style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "13px", fontWeight: "600",
              color: "var(--text-primary)",
              letterSpacing: "0.5px",
            }}>api_response.json</h2>
            <span className="tag-accent">LIVE</span>
          </div>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px", color: "var(--text-secondary)",
            marginBottom: "16px",
          }}>{data.message}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.items.map(item => (
              <span key={item} className="tag-accent">{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}