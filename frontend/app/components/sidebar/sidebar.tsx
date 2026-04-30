"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Propiedades", href: "/", icon: Building2 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 h-screen bg-card border-r border-border shrink-0">
      <div className="flex items-center gap-2.5 px-6 h-14 border-b border-border">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary">
          <Home className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight">Gestión de Casas</span>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Menú
        </p>
        <nav className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">v0.1.0</p>
      </div>
    </aside>
  )
}
