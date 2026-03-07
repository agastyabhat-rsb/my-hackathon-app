'use client'

import { auth } from "../firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

// ✅ Add your allowed emails here
const ALLOWED_EMAILS = [
  "agastyabhat.2@gmail.com",
  "agamjot08@gmail.com",
  "bhatshhloka@gmail.com"
  // add more as needed
]

export default function Login() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleGoogleLogin() {
    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      // Check if email is allowed
      if (!ALLOWED_EMAILS.includes(user.email)) {
        await auth.signOut()
        setError(`Access denied. ${user.email} is not allowed.`)
        setLoading(false)
        return
      }

      const token = await user.getIdToken()
      document.cookie = `auth-token=${token}; path=/`
      router.push("/")

    } catch (err) {
      setError("Login failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-400 mb-8 text-sm">Sign in to access the app</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:bg-gray-700 text-gray-900 font-bold py-3 rounded-lg"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-2.6-11.3-7l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  )
}