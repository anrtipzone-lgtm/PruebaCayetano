"use client"

import Link from "next/link"
import { Home } from "lucide-react"

export default function Nav() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
              <Home className="h-6 w-6 text-primary" />
              <span>Gestión de Casas</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
