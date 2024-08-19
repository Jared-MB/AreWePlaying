import { cn } from "@/core/utils"
import { quicksand } from "@/core/config"

import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          quicksand.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
