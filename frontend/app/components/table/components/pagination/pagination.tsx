"use client"

import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Casa } from "@/app/types/casaType"

interface PaginationProps {
  table: Table<Casa>
  total: number
}

export default function Pagination({ table, total }: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground" role="status" aria-live="polite">
        {table.getRowModel().rows.length} de {total} registro(s)
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (table.getCanPreviousPage()) {
              table.previousPage()
              table.resetRowSelection()
            }
          }}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center gap-1 px-3 py-1.5 text-sm"
          aria-label="Ir a la página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div
          className="flex items-center justify-center min-w-[2.5rem] h-8 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-md"
          aria-current="page"
        >
          {table.getState().pagination.pageIndex + 1}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (table.getCanNextPage()) {
              table.nextPage()
              table.resetRowSelection()
            }
          }}
          disabled={!table.getCanNextPage()}
          className="flex items-center gap-1 px-3 py-1.5 text-sm"
          aria-label="Ir a la página siguiente"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
