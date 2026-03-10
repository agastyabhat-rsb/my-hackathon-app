'use client'

import { auth } from "../firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const ALLOWED_EMAILS = [
  "agastyabhat.2@gmail.com",
  "agamjot08@gmail.com",
  "bhatshhloka@gmail.com",
  "rupa23.bhat@gmail.com",
  "srikant.bhat@gmail.com"
]

export default function Login() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  async function handleGoogleLogin() {
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      if (!ALLOWED_EMAILS.includes(user.email)) {
        await auth.signOut()
        setError(`${user.email} is not authorized.`)
        setLoading(false)
        return
      }
      const token = await user.getIdToken()
      document.cookie = `auth-token=${token}; path=/`
      router.push("/")
    } catch (err) {
      setError("Authentication failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080A0F",
      display: "flex",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes gridMove {
          from { transform: translateY(0); }
          to { transform: translateY(40px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .anim-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .anim-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .anim-4 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .sign-btn {
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
        }
        .sign-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .sign-btn:hover::before { opacity: 1; }
        .sign-btn:hover { 
          border-color: rgba(255,255,255,0.2) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .sign-btn:active { transform: translateY(0); }
      `}</style>

      {/* Animated grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: "gridMove 8s linear infinite",
      }}/>

      {/* Scanline effect */}
      <div style={{
        position: "absolute",
        left: 0, right: 0,
        height: "120px",
        background: "linear-gradient(180deg, transparent, rgba(99,255,200,0.015), transparent)",
        animation: "scanline 6s linear infinite",
        pointerEvents: "none",
        zIndex: 1,
      }}/>

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "glow 4s ease-in-out infinite",
      }}/>

      {/* Corner decorations */}
      <div style={{
        position: "absolute", top: "24px", left: "24px",
        width: "40px", height: "40px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderLeft: "1px solid rgba(255,255,255,0.1)",
      }}/>
      <div style={{
        position: "absolute", top: "24px", right: "24px",
        width: "40px", height: "40px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderRight: "1px solid rgba(255,255,255,0.1)",
      }}/>
      <div style={{
        position: "absolute", bottom: "24px", left: "24px",
        width: "40px", height: "40px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        borderLeft: "1px solid rgba(255,255,255,0.1)",
      }}/>
      <div style={{
        position: "absolute", bottom: "24px", right: "24px",
        width: "40px", height: "40px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        borderRight: "1px solid rgba(255,255,255,0.1)",
      }}/>

      {/* Status bar top */}
      <div className="anim-1" style={{
        position: "absolute", top: "32px",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "8px",
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px", color: "rgba(255,255,255,0.2)",
        letterSpacing: "2px", textTransform: "uppercase",
        zIndex: 2,
      }}>
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "#10b981",
          boxShadow: "0 0 8px #10b981",
        }}/>
        SYSTEM ONLINE
      </div>

      {/* Main content */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>

          {/* Logo mark */}
          <div className="anim-1" style={{ marginBottom: "48px" }}>
            <div style={{
              width: "42px", height: "42px",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "32px",
              position: "relative",
            }}>
              <div style={{
                width: "14px", height: "14px",
                background: "#10b981",
                opacity: 0.9,
              }}/>
              {/* Corner dots */}
              {[[-4,-4],[-4,'auto'],['auto',-4],['auto','auto']].map(([t,r,b,l], i) => (
                <div key={i} style={{
                  position: "absolute",
                  width: "3px", height: "3px",
                  background: "rgba(255,255,255,0.3)",
                  top: i < 2 ? "-1.5px" : "auto",
                  bottom: i >= 2 ? "-1.5px" : "auto",
                  left: i % 2 === 0 ? "-1.5px" : "auto",
                  right: i % 2 === 1 ? "-1.5px" : "auto",
                }}/>
              ))}
            </div>

            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)",
              marginBottom: "32px",
              animation: "lineGrow 1s ease 0.5s both",
            }}/>
          </div>

          {/* Heading */}
          <div className="anim-2" style={{ marginBottom: "8px" }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "32px",
              fontWeight: "800",
              color: "#ffffff",
              lineHeight: "1.1",
              letterSpacing: "-1px",
              margin: 0,
            }}>
              Restricted<br/>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>Access</span>
            </h1>
          </div>

          <div className="anim-3" style={{ marginBottom: "48px" }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.5px",
              margin: 0,
            }}>
              Authorized personnel only
            </p>
          </div>

          {/* Button */}
          <div className="anim-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="sign-btn"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: loading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                fontSize: "13px",
                fontFamily: "'DM Mono', monospace",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-2.6-11.3-7l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
                  </svg>
                )}
                {loading ? "Authenticating..." : "Sign in with Google"}
              </div>
              {!loading && (
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "16px" }}>→</span>
              )}
            </button>

            {error && (
              <div style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
                fontFamily: "'DM Mono', monospace",
                fontSize: "11px",
                color: "#ef4444",
                letterSpacing: "0.5px",
              }}>
                ACCESS_DENIED: {error}
              </div>
            )}
          </div>

          {/* Bottom metadata */}
          <div className="anim-4" style={{
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.12)",
            letterSpacing: "1px",
          }}>
            <span>v1.0.0</span>
            <span>SECURE · ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}