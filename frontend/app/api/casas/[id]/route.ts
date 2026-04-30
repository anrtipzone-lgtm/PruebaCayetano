import type { NextRequest } from "next/server"

const API_BASE = "https://g3oak4ydna.execute-api.us-east-1.amazonaws.com/Prod"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const res = await fetch(`${API_BASE}/casas/${id}`)
  const data = await res.json()
  return Response.json(data, { status: res.status })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await request.json()
  const res = await fetch(`${API_BASE}/casas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return Response.json(data, { status: res.status })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const res = await fetch(`${API_BASE}/casas/${id}`, { method: "DELETE" })
  if (!res.ok) return new Response(null, { status: res.status })
  return new Response(null, { status: 204 })
}
