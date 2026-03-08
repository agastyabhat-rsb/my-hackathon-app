'use client'

import Link from "next/link"
import "./globals.css"
import { useState, useEffect, useRef } from "react"
import { auth } from "./firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter, usePathname } from "next/navigation"
import { ThemeProvider, useTheme } from "next-themes"

function NavBar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isLoginPage = pathname === "/login"

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  async function handleLogout() {
    await signOut(auth)
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/login")
  }

  if (isLoginPage) return null

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 32px", height: "60px",
      gap: "8px",
      backdropFilter: "blur(12px)",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginRight: "32px",
      }}>
        <div style={{
          width: "28px", height: "28px",
          background: "var(--accent)",
          borderRadius: "6px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px",
        }}>⬡</div>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "13px",
          fontWeight: "600",
          color: "var(--text-primary)",
          letterSpacing: "-0.3px",
        }}>chain_app</span>
      </div>

      {/* Nav Links */}
      {[
        { href: "/", label: "home" },
        { href: "/about", label: "about" },
        { href: "/projects", label: "projects" },
        { href: "/wallet", label: "wallet" },
      ].map(({ href, label }) => (
        <Link key={href} href={href} style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px",
          color: pathname === href ? "var(--accent)" : "var(--text-muted)",
          textDecoration: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          background: pathname === href ? "var(--accent-soft)" : "transparent",
          border: pathname === href ? "1px solid var(--accent-border)" : "1px solid transparent",
          transition: "all 0.15s",
          letterSpacing: "0.3px",
        }}
        onMouseEnter={e => {
          if (pathname !== href) e.target.style.color = "var(--text-primary)"
        }}
        onMouseLeave={e => {
          if (pathname !== href) e.target.style.color = "var(--text-muted)"
        }}
        >{label}</Link>
      ))}

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>

        {/* Block height — decorative */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: "var(--text-muted)",
          display: "flex", alignItems: "center", gap: "6px",
          padding: "4px 10px",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: "var(--bg-primary)",
        }}>
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 6px var(--accent)",
          }}/>
          ETH_MAINNET
        </div>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              width: "34px", height: "34px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-primary)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px",
              transition: "all 0.15s",
            }}
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        )}

        {/* Profile */}
        {user && (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "4px 10px 4px 4px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-primary)",
                cursor: "pointer",
              }}
            >
              <img src={user.photoURL} alt="pfp"
                style={{ width: "26px", height: "26px", borderRadius: "6px" }}
              />
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px", color: "var(--text-secondary)",
              }}>
                {user.displayName?.split(" ")[0].toLowerCase()}
              </span>
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)",
                width: "240px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-hover)",
                overflow: "hidden",
                zIndex: 100,
              }}>
                <div style={{
                  padding: "16px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", gap: "12px", alignItems: "center",
                }}>
                  <img src={user.photoURL} alt="pfp"
                    style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                      {user.displayName}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <div style={{ padding: "8px" }}>
                  <button onClick={handleLogout} style={{
                    width: "100%", textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    color: "#EF4444",
                    fontSize: "12px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.06)"}
                  onMouseLeave={e => e.target.style.background = "transparent"}
                  >
                    sign_out()
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NavBar />
          <main style={{ position: "relative", zIndex: 1 }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}