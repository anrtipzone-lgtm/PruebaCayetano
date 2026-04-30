import type { Casa, CasaFetch, TipoCasa } from "../types/casaType"

const API_BASE = "/api"

function normalizeArray(raw: unknown): Casa[] {
  if (Array.isArray(raw)) return raw as Casa[]
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>
    for (const key of ["items", "casas", "data", "results", "body"]) {
      if (Array.isArray(obj[key])) return obj[key] as Casa[]
      // API Gateway puede devolver body como string JSON
      if (key === "body" && typeof obj[key] === "string") {
        try {
          const parsed = JSON.parse(obj[key] as string)
          if (Array.isArray(parsed)) return parsed as Casa[]
        } catch { /* ignore */ }
      }
    }
  }
  throw new Error(`Formato de respuesta inesperado: ${JSON.stringify(raw).slice(0, 200)}`)
}

export async function GetAllCasas({
  page = 1,
  pageSize = 10,
  search = "",
}: {
  page?: number
  pageSize?: number
  search?: string
}): Promise<CasaFetch> {
  const res = await fetch(`${API_BASE}/casas`)
  if (!res.ok) throw new Error(`Error al obtener las casas (HTTP ${res.status})`)
  const raw = await res.json()
  const all = normalizeArray(raw)

  const filtered = search
    ? all.filter((c) =>
        Object.values(c).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      )
    : all

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, allData: all, total: filtered.length, page, pageSize }
}

export async function GetCasa(id: number): Promise<Casa> {
  const res = await fetch(`${API_BASE}/casas/${id}`)
  if (!res.ok) throw new Error(`Casa con id ${id} no encontrada`)
  return res.json()
}

export type CasaInput = Omit<Casa, "id" | "fechaPublicacion" | "activo">

export async function CreateCasa(data: CasaInput): Promise<Casa> {
  const res = await fetch(`${API_BASE}/casas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al crear la casa")
  return res.json()
}

export async function UpdateCasa(id: number, data: CasaInput): Promise<Casa> {
  const res = await fetch(`${API_BASE}/casas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al actualizar la casa")
  return res.json()
}

export async function DeleteCasa(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/casas/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Error al eliminar la casa")
}

export const TIPOS_CASA: TipoCasa[] = ["Casa", "Departamento", "Terreno", "Oficina"]
