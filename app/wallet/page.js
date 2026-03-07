'use client'

import { useState } from "react"
import { ethers } from "ethers"

export default function Wallet() {
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function connectWallet() {
    setLoading(true)
    setError("")

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError("MetaMask not found. Please install it.")
        return
      }

      // Ask MetaMask to connect — this triggers the popup
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Get wallet address
      const addr = await signer.getAddress()
      setAddress(addr)

      // Get wallet balance
      const bal = await provider.getBalance(addr)
      setBalance(ethers.formatEther(bal))

    } catch (err) {
      setError("Connection rejected or failed.")
    } finally {
      setLoading(false)
    }
  }

  function disconnectWallet() {
    setAddress("")
    setBalance("")
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Wallet</h1>
      <p className="text-gray-400 mb-8">Connect your MetaMask wallet</p>

      {/* Not connected */}
      {!address && (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 text-black font-bold px-6 py-3 rounded-lg"
        >
          {loading ? "Connecting..." : "Connect MetaMask"}
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 mt-4">{error}</p>
      )}

      {/* Connected */}
      {address && (
        <div className="bg-gray-800 rounded-lg p-6 max-w-md">
          <p className="text-green-400 font-bold mb-4">✓ Wallet Connected</p>

          <p className="text-gray-400 text-sm mb-1">Address</p>
          <p className="text-white font-mono text-sm mb-4 break-all">{address}</p>

          <p className="text-gray-400 text-sm mb-1">Balance</p>
          <p className="text-white font-bold text-xl mb-6">
            {parseFloat(balance).toFixed(4)} ETH
          </p>

          <button
            onClick={disconnectWallet}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}