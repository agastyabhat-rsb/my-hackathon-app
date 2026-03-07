'use client'

import Link from "next/link"
import "./globals.css"
import { useState, useEffect, useRef } from "react"
import { auth } from "./firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleLogout() {
    await signOut(auth)
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/login")
  }

  return (
    <html lang="en">
      <body className="bg-gray-950">
        <nav className="flex gap-6 p-6 border-b border-gray-800 items-center">
          <Link href="/" className="text-white font-bold hover:text-green-400">Home</Link>
          <Link href="/about" className="text-white font-bold hover:text-blue-400">About</Link>
          <Link href="/projects" className="text-white font-bold hover:text-purple-400">Projects</Link>
          <Link href="/wallet" className="text-white font-bold hover:text-orange-400">Wallet</Link>

          {/* User Menu — top right */}
          {user && (
            <div className="ml-auto relative" ref={menuRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-9 h-9 rounded-full border-2 border-gray-600"
                />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-white font-bold text-sm">{user.displayName}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg text-sm font-bold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
        {children}
      </body>
    </html>
  )
}