"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Vérifier si l'écran de chargement a déjà été affiché
    const hasShownSplash = sessionStorage.getItem("hasShownSplash")

    if (hasShownSplash) {
      setShow(false)
      return
    }

    const timer = setTimeout(() => {
      setShow(false)
      // Marquer que l'écran de chargement a été affiché pour cette session
      sessionStorage.setItem("hasShownSplash", "true")
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative w-full h-full">
        <Image
          src="/images/loading-screen.jpg"
          alt="Automatisation de l'Irrigation des Espaces Verts à l'IAV"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div className="absolute bottom-10 flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <p className="mt-2 text-gray-600 font-medium">Chargement...</p>
      </div>
    </div>
  )
}
