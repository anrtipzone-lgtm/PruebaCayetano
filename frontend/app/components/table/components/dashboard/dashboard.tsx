"use client"

import { useEffect, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CreateCasa, DeleteCasa, UpdateCasa, TIPOS_CASA, type CasaInput } from "@/app/services/casasService"
import type { TipoCasa } from "@/app/types/casaType"
import type { DashboardProps } from "@/app/types/dashboardType"

const MySwal = withReactContent(Swal)

export default function Dashboard({ casas, table, setGlobalFilter, onRefetch }: DashboardProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CasaInput>()

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"crear" | "editar">("crear")
  const [editingId, setEditingId] = useState<number | null>(null)

  const rowsSelected = table.getSelectedRowModel().rows
  const countSelected = rowsSelected.length

  useEffect(() => {
    reset()
  }, [table.getState().rowSelection, reset])

  const handleCloseModal = () => {
    setShowModal(false)
    reset()
    setEditingId(null)
  }

  const handleOpenCreate = () => {
    setModalMode("crear")
    setEditingId(null)
    reset()
    setShowModal(true)
  }

  const handleOpenEdit = () => {
    if (countSelected === 0) {
      MySwal.fire({ toast: true, position: "top-end", icon: "info", title: "Selecciona una fila para editar", showConfirmButton: false, timer: 1500 })
      return
    }
    if (countSelected > 1) {
      MySwal.fire({ toast: true, position: "top-end", icon: "info", title: "Selecciona solo una fila para editar", showConfirmButton: false, timer: 1500 })
      return
    }
    const selected = rowsSelected[0].original
    setModalMode("editar")
    setEditingId(selected.id)
    setValue("direccion", selected.direccion)
    setValue("distrito", selected.distrito)
    setValue("numeroHabitaciones", selected.numeroHabitaciones)
    setValue("tipoCasa", selected.tipoCasa)
    setValue("areaM2", selected.areaM2)
    setValue("precio", selected.precio)
    setValue("descripcion", selected.descripcion)
    setShowModal(true)
  }

  const handleDelete = () => {
    if (countSelected === 0) {
      MySwal.fire({ toast: true, position: "top-end", icon: "info", title: "Selecciona al menos una fila para eliminar", showConfirmButton: false, timer: 1500 })
      return
    }
    MySwal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminarán ${countSelected} casa(s). ¡No podrás revertir esto!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const idsToDelete = rowsSelected.map((r) => r.original.id)
        await Promise.all(idsToDelete.map((id) => DeleteCasa(id)))
        table.resetRowSelection()
        onRefetch()
        setGlobalFilter("")
        Swal.fire({ title: "Eliminado", text: `${countSelected} casa(s) eliminada(s).`, icon: "success" })
      }
    })
  }

  const onSubmit: SubmitHandler<CasaInput> = async (data) => {
    const parsed: CasaInput = {
      ...data,
      precio: Number(data.precio),
      numeroHabitaciones: Number(data.numeroHabitaciones),
      areaM2: Number(data.areaM2),
    }

    if (modalMode === "crear") {
      await CreateCasa(parsed)
      MySwal.fire({ toast: true, position: "top-end", icon: "success", title: "Casa creada correctamente", showConfirmButton: false, timer: 1500 })
    } else if (editingId !== null) {
      await UpdateCasa(editingId, parsed)
      MySwal.fire({ toast: true, position: "top-end", icon: "success", title: "Casa actualizada correctamente", showConfirmButton: false, timer: 1500 })
    }

    table.resetRowSelection()
    onRefetch()
    setGlobalFilter("")
    handleCloseModal()
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Casas</h2>
          <p className="text-sm text-muted-foreground">Gestiona el catálogo de propiedades</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleOpenCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva casa
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenEdit} className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalMode === "crear" ? "Nueva Casa" : "Editar Casa"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                {...register("descripcion", { required: "La descripción es requerida" })}
                placeholder="Ej: Casa amplia con jardín"
                aria-invalid={!!errors.descripcion}
              />
              {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  {...register("direccion", { required: "La dirección es requerida" })}
                  placeholder="Ej: Av. Arequipa 1234"
                  aria-invalid={!!errors.direccion}
                />
                {errors.direccion && <p className="text-xs text-destructive">{errors.direccion.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito</Label>
                <Input
                  id="distrito"
                  {...register("distrito", { required: "El distrito es requerido" })}
                  placeholder="Ej: Miraflores"
                  aria-invalid={!!errors.distrito}
                />
                {errors.distrito && <p className="text-xs text-destructive">{errors.distrito.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio (USD)</Label>
                <Input
                  id="precio"
                  type="number"
                  min="0"
                  {...register("precio", { required: "El precio es requerido", min: { value: 0, message: "Debe ser positivo" } })}
                  placeholder="Ej: 250000"
                  aria-invalid={!!errors.precio}
                />
                {errors.precio && <p className="text-xs text-destructive">{errors.precio.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaM2">Área (m²)</Label>
                <Input
                  id="areaM2"
                  type="number"
                  min="0"
                  {...register("areaM2", { required: "El área es requerida", min: { value: 0, message: "Debe ser positivo" } })}
                  placeholder="Ej: 180"
                  aria-invalid={!!errors.areaM2}
                />
                {errors.areaM2 && <p className="text-xs text-destructive">{errors.areaM2.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroHabitaciones">Habitaciones</Label>
                <Input
                  id="numeroHabitaciones"
                  type="number"
                  min="0"
                  {...register("numeroHabitaciones", { required: true, min: 0 })}
                  placeholder="Ej: 3"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={watch("tipoCasa")}
                  onValueChange={(v) => setValue("tipoCasa", v as TipoCasa)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_CASA.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {modalMode === "crear" ? "Crear" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
