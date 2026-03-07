import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Hello from my API!",
    status: "working",
    items: ["React", "Next.js", "Tailwind", "Ethers.js"]
  })
}