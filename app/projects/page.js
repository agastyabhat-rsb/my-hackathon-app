'use client'

import { useState, useEffect } from "react"

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=12')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
  }, [])

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-gray-400 mb-6">Fetched from a real API</p>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md bg-gray-800 text-white rounded-lg px-4 py-3 mb-8 border border-gray-700 focus:outline-none focus:border-purple-500"
      />

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-4">{filtered.length} results</p>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(project => (
          <div key={project.id} className="bg-gray-800 rounded-lg p-6">
            <p className="text-purple-400 text-sm mb-2">#{project.id}</p>
            <h2 className="text-white font-bold mb-2">{project.title}</h2>
            <p className="text-gray-400 text-sm">{project.body}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-gray-600 text-center mt-12">No projects found.</p>
      )}
    </div>
  )
}