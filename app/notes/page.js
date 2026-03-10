'use client'

import { useState, useEffect } from "react"
import { db, auth } from "../firebase"
import {
  collection, addDoc, deleteDoc,
  doc, onSnapshot, query,
  orderBy, serverTimestamp
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [text, setText] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  async function addNote() {
    if (!text.trim()) return
    await addDoc(collection(db, "notes"), {
      text,
      author: user?.displayName || "Anonymous",
      email: user?.email,
      createdAt: serverTimestamp(),
    })
    setText("")
  }

  async function deleteNote(id) {
    await deleteDoc(doc(db, "notes", id))
  }

  return (
    <div style={{ padding: "48px 32px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ marginBottom: "8px" }}>
        <span className="tag-accent">FIRESTORE</span>
      </div>
      <h1 style={{
        fontSize: "40px", fontWeight: "700",
        color: "var(--text-primary)",
        letterSpacing: "-1px", marginBottom: "8px", marginTop: "16px",
      }}>Notes</h1>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "12px", color: "var(--text-muted)",
        marginBottom: "40px",
      }}>Stored in Firebase Firestore — live updates in real time</p>

      {/* Input */}
      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a note..."
          rows={3}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            resize: "none",
            lineHeight: "1.7",
          }}
          onKeyDown={e => {
            if (e.key === "Enter" && e.metaKey) addNote()
          }}
        />
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: "16px",
          paddingTop: "16px", borderTop: "1px solid var(--border)",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px", color: "var(--text-muted)",
          }}>⌘ + Enter to save</span>
          <button
            onClick={addNote}
            disabled={!text.trim()}
            style={{
              padding: "8px 20px",
              background: text.trim() ? "var(--accent)" : "var(--bg-primary)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: text.trim() ? "#000" : "var(--text-muted)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px", fontWeight: "600",
              cursor: text.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            save_note()
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px", color: "var(--text-muted)",
        }}>fetching notes...</p>
      ) : notes.length === 0 ? (
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px", color: "var(--text-muted)",
        }}>no notes yet — write something above</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {notes.map(note => (
            <div key={note.id} className="card" style={{ padding: "20px 24px" }}>
              <p style={{
                fontSize: "13px", color: "var(--text-primary)",
                fontFamily: "'IBM Plex Mono', monospace",
                lineHeight: "1.7", marginBottom: "12px",
              }}>{note.text}</p>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px", color: "var(--text-muted)",
                }}>
                  {note.author} · {note.createdAt?.toDate().toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  style={{
                    background: "none", border: "none",
                    color: "var(--text-muted)", cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px", padding: "4px 8px",
                    borderRadius: "4px", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.target.style.color = "#ef4444"}
                  onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}