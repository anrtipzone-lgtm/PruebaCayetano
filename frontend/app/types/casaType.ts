export type TipoCasa = "Casa" | "Departamento" | "Terreno" | "Oficina"

export interface Casa {
  id: number
  direccion: string
  distrito: string
  numeroHabitaciones: number
  tipoCasa: TipoCasa
  areaM2: number
  precio: number
  descripcion: string
  fechaPublicacion: string
  activo: boolean
}

export interface CasaFetch {
  data: Casa[]
  allData: Casa[]
  total: number
  page: number
  pageSize: number
}
