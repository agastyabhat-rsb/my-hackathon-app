'use client'

import { useState, useEffect } from "react"
import { db, auth } from "../firebase"
import {
  collection, addDoc, deleteDoc,
  doc, onSnapshot, query,
  orderBy, where, serverTimestamp
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

const CATEGORIES = ["Buy", "Sell", "Transfer", "Swap"]

const CATEGORY_COLORS = {
  Buy: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", color: "#10b981" },
  Sell: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "#ef4444" },
  Transfer: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", color: "#6366f1" },
  Swap: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", color: "#f59e0b" },
}

export default function Tracker() {
  const [transactions, setTransactions] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("All")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    coin: "", amount: "", price: "", wallet: "", category: "Buy", note: ""
  })

  async function fetchPrice(coinName) {
    if (!coinName) return
    try {
      const coinMap = {
        BTC: "bitcoin", ETH: "ethereum", SOL: "solana",
        BNB: "binancecoin", XRP: "ripple", ADA: "cardano",
        DOGE: "dogecoin", MATIC: "matic-network", DOT: "polkadot",
        AVAX: "avalanche-2", LINK: "chainlink", UNI: "uniswap",
        LTC: "litecoin", ATOM: "cosmos", NEAR: "near",
      }
      const id = coinMap[coinName.toUpperCase()]
      if (!id) return
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
      )
      const data = await res.json()
      const price = data[id]?.usd
      if (price) setForm(prev => ({ ...prev, price: price.toString() }))
    } catch (err) {
      console.log("Price fetch failed:", err)
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    )
    const unsub = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [user])

  async function addTransaction() {
    if (!form.coin || !form.amount) return
    await addDoc(collection(db, "transactions"), {
      ...form,
      uid: user.uid,
      author: user.displayName,
      createdAt: serverTimestamp(),
    })
    setForm({ coin: "", amount: "", price: "", wallet: "", category: "Buy", note: "" })
    setShowForm(false)
  }

  async function deleteTransaction(id) {
    await deleteDoc(doc(db, "transactions", id))
  }

  const filtered = transactions.filter(t => {
    const matchSearch =
      t.coin.toLowerCase().includes(search.toLowerCase()) ||
      t.wallet?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === "All" || t.category === filterCat
    return matchSearch && matchCat
  })

  const totalBuys = transactions.filter(t => t.category === "Buy").length
  const totalSells = transactions.filter(t => t.category === "Sell").length
  const totalValue = transactions
    .filter(t => t.category === "Buy")
    .reduce((sum, t) => sum + (parseFloat(t.price) || 0) * (parseFloat(t.amount) || 0), 0)

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "12px", outline: "none",
  }

  return (
    <div style={{ padding: "48px 32px", maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
        <div>
          <span className="tag-accent" style={{ display: "inline-flex", marginBottom: "12px" }}>
            FIRESTORE · LIVE
          </span>
          <h1 style={{
            fontSize: "40px", fontWeight: "700",
            color: "var(--text-primary)",
            letterSpacing: "-1px", marginBottom: "8px",
          }}>TX Tracker</h1>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px", color: "var(--text-muted)",
          }}>Your personal blockchain transaction log</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            background: showForm ? "transparent" : "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: "8px",
            color: showForm ? "var(--accent)" : "#000",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px", fontWeight: "600",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {showForm ? "cancel()" : "+ new_tx()"}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px", marginBottom: "32px",
      }}>
        {[
          { label: "TOTAL TXS", value: transactions.length, sub: "all time" },
          { label: "BUYS", value: totalBuys, sub: "transactions" },
          { label: "SELLS", value: totalSells, sub: "transactions" },
          { label: "TOTAL INVESTED", value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, sub: "from buys" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="card" style={{ padding: "20px" }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px", color: "var(--text-muted)",
              letterSpacing: "2px", marginBottom: "8px",
            }}>{label}</p>
            <p style={{
              fontSize: "22px", fontWeight: "700",
              color: "var(--text-primary)", marginBottom: "4px",
            }}>{value}</p>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px", color: "var(--accent)",
            }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px", color: "var(--accent)",
            letterSpacing: "1px", marginBottom: "20px",
          }}>NEW TRANSACTION</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>

            {/* Coin dropdown */}
            <div>
              <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>COIN *</label>
              <select
                value={form.coin}
                onChange={e => {
                  setForm({ ...form, coin: e.target.value })
                  fetchPrice(e.target.value)
                }}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">Select coin...</option>
                <option value="BTC">BTC — Bitcoin</option>
                <option value="ETH">ETH — Ethereum</option>
                <option value="SOL">SOL — Solana</option>
                <option value="BNB">BNB — BNB Chain</option>
                <option value="XRP">XRP — Ripple</option>
                <option value="ADA">ADA — Cardano</option>
                <option value="DOGE">DOGE — Dogecoin</option>
                <option value="MATIC">MATIC — Polygon</option>
                <option value="DOT">DOT — Polkadot</option>
                <option value="AVAX">AVAX — Avalanche</option>
                <option value="LINK">LINK — Chainlink</option>
                <option value="UNI">UNI — Uniswap</option>
                <option value="LTC">LTC — Litecoin</option>
                <option value="ATOM">ATOM — Cosmos</option>
                <option value="NEAR">NEAR — Near</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>AMOUNT *</label>
              <input
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.5"
                type="number"
                style={inputStyle}
              />
            </div>

            {/* Price — read only */}
            <div>
              <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                PRICE (USD) — auto
              </label>
              <input
                value={form.price}
                readOnly
                placeholder="auto-fills on coin select"
                style={{
                  ...inputStyle,
                  color: form.price ? "var(--accent)" : "var(--text-muted)",
                  cursor: "not-allowed",
                  opacity: 0.8,
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>CATEGORY</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Wallet */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>WALLET ADDRESS</label>
            <input
              value={form.wallet}
              onChange={e => setForm({ ...form, wallet: e.target.value })}
              placeholder="0x..."
              style={inputStyle}
            />
          </div>
                {/* Total Payable — read only */}
                <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                    TOTAL PAYABLE (USD) — auto
                </label>
                <input
                    value={
                    form.price && form.amount
                        ? `$${(parseFloat(form.price) * parseFloat(form.amount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                        : ""
                    }
                    readOnly
                    placeholder="fills after coin + amount"
                    style={{
                    ...inputStyle,
                    color: form.price && form.amount ? "var(--accent)" : "var(--text-muted)",
                    cursor: "not-allowed",
                    opacity: 0.8,
                    fontSize: "14px",
                    fontWeight: "600",
                    }}
                />
                </div>

          {/* Note */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>NOTE</label>
            <input
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              placeholder="Optional note..."
              style={inputStyle}
            />
          </div>

          <button
            onClick={addTransaction}
            disabled={!form.coin || !form.amount}
            style={{
              padding: "10px 24px",
              background: form.coin && form.amount ? "var(--accent)" : "var(--bg-primary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: form.coin && form.amount ? "#000" : "var(--text-muted)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px", fontWeight: "600",
              cursor: form.coin && form.amount ? "pointer" : "not-allowed",
            }}
          >
            log_transaction()
          </button>
        </div>
      )}

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search coin or wallet..."
          style={{ ...inputStyle, maxWidth: "280px" }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          {["All", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: `1px solid ${filterCat === cat ? (CATEGORY_COLORS[cat]?.border || "var(--accent-border)") : "var(--border)"}`,
                background: filterCat === cat ? (CATEGORY_COLORS[cat]?.bg || "var(--accent-soft)") : "transparent",
                color: filterCat === cat ? (CATEGORY_COLORS[cat]?.color || "var(--accent)") : "var(--text-muted)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "var(--text-muted)" }}>
          loading transactions...
        </p>
      ) : filtered.length === 0 ? (
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "var(--text-muted)" }}>
          {transactions.length === 0 ? "no transactions yet — log your first one above" : "no results found"}
        </p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {filtered.map(tx => {
            const cat = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Buy
            const total = tx.price && tx.amount
              ? (parseFloat(tx.price) * parseFloat(tx.amount)).toLocaleString(undefined, { maximumFractionDigits: 2 })
              : null
            return (
              <div key={tx.id} className="card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "4px",
                      background: cat.bg, border: `1px solid ${cat.border}`,
                      color: cat.color,
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px", fontWeight: "600", letterSpacing: "1px",
                    }}>{tx.category}</span>
                    <span style={{
                      fontSize: "15px", fontWeight: "700",
                      color: "var(--text-primary)",
                    }}>{tx.amount} {tx.coin}</span>
                    {total && (
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "12px", color: "var(--text-muted)",
                      }}>≈ ${total}</span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    style={{
                      background: "none", border: "none",
                      color: "var(--text-muted)", cursor: "pointer",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px", transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.target.style.color = "#ef4444"}
                    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                  >delete</button>
                </div>

                {tx.wallet && (
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px", color: "var(--text-muted)",
                    marginTop: "10px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{tx.wallet}</p>
                )}
                {tx.note && (
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px", color: "var(--text-secondary)",
                    marginTop: "6px",
                  }}>{tx.note}</p>
                )}
                <p style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px", color: "var(--text-muted)",
                  marginTop: "10px",
                }}>
                  {tx.createdAt?.toDate().toLocaleDateString()} · {tx.author}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}