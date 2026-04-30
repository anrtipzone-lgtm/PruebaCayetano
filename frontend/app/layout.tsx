import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/theme-provider"
import Sidebar from "./components/sidebar/sidebar"
import Header from "./components/header/header"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Gestión de Casas",
  description: "Sistema de gestión de propiedades inmobiliarias",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={montserrat.variable}>
        <ThemeProvider>
          <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <Header title="Propiedades" description="Gestiona el catálogo de propiedades" />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
