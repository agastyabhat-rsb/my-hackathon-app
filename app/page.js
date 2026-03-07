'use client'

import { useState, useEffect } from "react"

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-4">My Hackathon App</h1>

      {data ? (
        <div className="bg-gray-800 rounded-lg p-6 max-w-md">
          <p className="text-gray-400 mb-2">{data.message}</p>
          <div className="flex gap-2 flex-wrap mt-4">
            {data.items.map(item => (
              <span key={item} className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Loading...</p>
      )}
    </div>
  )
}