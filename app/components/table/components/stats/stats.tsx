import { Building2, CheckCircle2, DollarSign, Maximize2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Casa } from "@/app/types/casaType"

interface StatsProps {
  casas: Casa[]
}

export default function Stats({ casas }: StatsProps) {
  const total = casas.length
  const activas = casas.filter((c) => c.activo).length
  const precioPromedio = total > 0 ? casas.reduce((sum, c) => sum + c.precio, 0) / total : 0
  const areaPromedio = total > 0 ? casas.reduce((sum, c) => sum + c.areaM2, 0) / total : 0

  const items = [
    {
      title: "Total propiedades",
      value: total.toString(),
      description: "Registradas en el sistema",
      icon: Building2,
    },
    {
      title: "Activas",
      value: activas.toString(),
      description: `${total > 0 ? Math.round((activas / total) * 100) : 0}% del total`,
      icon: CheckCircle2,
    },
    {
      title: "Precio promedio",
      value: `$${Math.round(precioPromedio).toLocaleString("es-PE")}`,
      description: "En dólares americanos",
      icon: DollarSign,
    },
    {
      title: "Área promedio",
      value: `${Math.round(areaPromedio)} m²`,
      description: "Por propiedad",
      icon: Maximize2,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map(({ title, value, description, icon: Icon }) => (
        <Card key={title} className="gap-3 py-5">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
