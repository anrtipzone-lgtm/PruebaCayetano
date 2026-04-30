import type { Table } from "@tanstack/react-table"
import type { Dispatch, SetStateAction } from "react"
import type { Casa } from "./casaType"

export interface DashboardProps {
  casas: Casa[]
  table: Table<Casa>
  setGlobalFilter: Dispatch<SetStateAction<string>>
  onRefetch: () => void
}
