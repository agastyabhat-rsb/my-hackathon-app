'use client'

import { useState } from "react"
import { BrowserProvider, formatEther } from "ethers"

export default function Wallet() {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function connectWallet() {
    setLoading(true)
    setError("")
    try {
      if (!window.ethereum) throw new Error("MetaMask not found")
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)
      setWallet({ address, balance: formatEther(balance) })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function disconnect() { setWallet(null) }

  return (
    <div style={{ padding: "48px 32px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ marginBottom: "8px" }}>
        <span className="tag-accent">WEB3</span>
      </div>
      <h1 style={{
        fontSize: "40px", fontWeight: "700",
        color: "var(--text-primary)",
        letterSpacing: "-1px", marginBottom: "8px", marginTop: "16px",
      }}>Wallet</h1>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "12px", color: "var(--text-muted)",
        marginBottom: "40px",
      }}>Connect your MetaMask wallet to view on-chain data</p>

      {!wallet ? (
        <div className="card" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🦊</div>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px", color: "var(--text-muted)",
            marginBottom: "24px",
          }}>MetaMask required to connect</p>
          <button
            onClick={connectWallet}
            disabled={loading}
            style={{
              padding: "12px 32px",
              background: "var(--accent)",
              border: "none",
              borderRadius: "8px",
              color: "#000",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "connecting..." : "connect_wallet()"}
          </button>
          {error && (
            <p style={{
              marginTop: "16px", fontSize: "11px",
              fontFamily: "'IBM Plex Mono', monospace",
              color: "#ef4444",
            }}>ERROR: {error}</p>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {/* Status */}
          <div className="card" style={{
            padding: "20px 24px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent)",
            }}/>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px", color: "var(--accent)", fontWeight: "600",
            }}>WALLET CONNECTED</span>
          </div>

          {/* Address */}
          <div className="card" style={{ padding: "24px" }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px", color: "var(--text-muted)",
              letterSpacing: "2px", marginBottom: "10px",
            }}>ADDRESS</p>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "13px", color: "var(--text-primary)",
              wordBreak: "break-all",
            }}>{wallet.address}</p>
          </div>

          {/* Balance */}
          <div className="card" style={{ padding: "24px" }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px", color: "var(--text-muted)",
              letterSpacing: "2px", marginBottom: "10px",
            }}>BALANCE</p>
            <p style={{
              fontSize: "36px", fontWeight: "700",
              color: "var(--text-primary)", letterSpacing: "-1px",
            }}>
              {parseFloat(wallet.balance).toFixed(4)}
              <span style={{
                fontSize: "16px", color: "var(--accent)",
                fontFamily: "'IBM Plex Mono', monospace",
                marginLeft: "8px",
              }}>ETH</span>
            </p>
          </div>

          {/* Disconnect */}
          <button
            onClick={disconnect}
            style={{
              padding: "12px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-muted)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = "#ef4444"
              e.target.style.color = "#ef4444"
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = "var(--border)"
              e.target.style.color = "var(--text-muted)"
            }}
          >
            disconnect()
          </button>
        </div>
      )}
    </div>
  )
}