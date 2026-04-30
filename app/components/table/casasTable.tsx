"use client"

import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Casa, CasaFetch } from "@/app/types/casaType"
import { GetAllCasas } from "@/app/services/casasService"
import Dashboard from "./components/dashboard/dashboard"
import Pagination from "./components/pagination/pagination"
import Search from "./components/search/search"
import Stats from "./components/stats/stats"

export default function CasasTable() {
  const [casaFetch, setCasaFetch] = useState<CasaFetch>({ data: [], allData: [], total: 0, page: 1, pageSize: 10 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize])

  const fetchCasas = async ({ page = pageIndex + 1, search = globalFilter } = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await GetAllCasas({ page, pageSize, search })
      setCasaFetch(result)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setError(msg)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = useMemo<ColumnDef<Casa>[]>(
    () => [
      {
        id: "select",
        accessorKey: "",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Seleccionar todas las filas"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            disabled={!row.getCanSelect()}
            aria-label="Seleccionar fila"
          />
        ),
      },
      {
        id: "descripcion",
        accessorKey: "descripcion",
        header: "Descripción",
        cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
      },
      {
        id: "direccion",
        accessorKey: "direccion",
        header: "Dirección",
        cell: (info) => {
          const row = info.row.original
          return (
            <span className="text-muted-foreground">
              {info.getValue() as string}{row.distrito ? `, ${row.distrito}` : ""}
            </span>
          )
        },
      },
      {
        id: "precio",
        accessorKey: "precio",
        header: "Precio",
        cell: (info) => (
          <span className="font-semibold text-green-700">
            ${(info.getValue() as number).toLocaleString("es-PE")}
          </span>
        ),
      },
      {
        id: "numeroHabitaciones",
        accessorKey: "numeroHabitaciones",
        header: "Hab.",
        cell: (info) => <span className="text-center block">{info.getValue() as number}</span>,
      },
      {
        id: "areaM2",
        accessorKey: "areaM2",
        header: "Área (m²)",
        cell: (info) => `${info.getValue()} m²`,
      },
      {
        id: "tipoCasa",
        accessorKey: "tipoCasa",
        header: "Tipo",
        cell: (info) => <span className="capitalize">{info.getValue() as string}</span>,
      },
      {
        id: "activo",
        accessorKey: "activo",
        header: "Estado",
        cell: (info) => {
          const activo = info.getValue() as boolean
          return (
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}>
              {activo ? "Activo" : "Inactivo"}
            </span>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: casaFetch.data,
    columns,
    pageCount: Math.ceil(casaFetch.total / pageSize),
    autoResetPageIndex: false,
    state: { globalFilter, rowSelection, sorting, pagination },
    enableRowSelection: true,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return
      const newPage = updater(table.getState().pagination)
      setPagination(updater)
      fetchCasas({ page: newPage.pageIndex + 1 })
      setGlobalFilter("")
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  useEffect(() => {
    fetchCasas({ page: 1 })
  }, [])

  const handleSearch = (value: string) => {
    setGlobalFilter(value)
    setPagination({ pageIndex: 0, pageSize })
    fetchCasas({ page: 1, search: value })
    table.resetRowSelection()
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-8">
      <div className="space-y-6">
        <Stats casas={casaFetch.allData} />

        <Dashboard
          casas={casaFetch.data}
          table={table}
          setGlobalFilter={setGlobalFilter}
          onRefetch={() => fetchCasas({ page: pageIndex + 1 })}
        />

        <div className="space-y-4">
          <Search value={globalFilter ?? ""} onChange={handleSearch} />

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              <strong>Error al cargar datos:</strong> {error}
            </div>
          )}

          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm text-muted-foreground">Cargando...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort()
                        const sortDirection = header.column.getIsSorted()
                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className={cn("select-none", canSort && "cursor-pointer hover:bg-muted/50")}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center space-x-2">
                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                {canSort && (
                                  <div className="flex flex-col">
                                    <ChevronUp className={cn("h-3 w-3", sortDirection === "asc" ? "text-foreground" : "text-muted-foreground")} />
                                    <ChevronDown className={cn("h-3 w-3 -mt-1", sortDirection === "desc" ? "text-foreground" : "text-muted-foreground")} />
                                  </div>
                                )}
                              </div>
                            )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                        No se encontraron casas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className={cn("hover:bg-muted/50", row.getIsSelected() && "bg-muted")}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <Pagination table={table} total={casaFetch.total} />
        </div>
      </div>
    </div>
  )
}
