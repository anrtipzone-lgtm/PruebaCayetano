"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

interface SearchProps {
  value: string
  onChange: (value: string) => void
}

export default function Search({ value, onChange }: SearchProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar casas..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}
