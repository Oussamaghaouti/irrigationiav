"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CloudRainIcon, ThermometerIcon, CloudIcon, AlertTriangleIcon } from "lucide-react"
import type { JSX } from "react"

interface WeatherAlertProps {
  temperature: number
  airHumidity: number
  soilHumidity: number
  precipitation: number
  pressure: number
}

export function WeatherAlert({ temperature, airHumidity, soilHumidity, precipitation, pressure }: WeatherAlertProps) {
  const [alerts, setAlerts] = useState<{ type: string; title: string; description: string; icon: JSX.Element }[]>([])

  useEffect(() => {
    const newAlerts = []

    // Vérifier les conditions d'alerte
    if (temperature > 22) {
      newAlerts.push({
        type: "temperature",
        title: "Alerte de température élevée",
        description: `La température actuelle est de ${temperature.toFixed(1)}°C, ce qui est au-dessus du seuil recommandé.`,
        icon: <ThermometerIcon className="h-4 w-4 text-red-500" />,
      })
    } else if (temperature < 15) {
      newAlerts.push({
        type: "temperature",
        title: "Alerte de température basse",
        description: `La température actuelle est de ${temperature.toFixed(1)}°C, ce qui est en dessous du seuil recommandé.`,
        icon: <ThermometerIcon className="h-4 w-4 text-blue-500" />,
      })
    }

    if (airHumidity < 50) {
      newAlerts.push({
        type: "airHumidity",
        title: "Alerte d'humidité de l'air basse",
        description: `L'humidité de l'air est de ${airHumidity.toFixed(1)}%, ce qui est en dessous de la plage optimale.`,
        icon: <CloudIcon className="h-4 w-4 text-amber-500" />,
      })
    } else if (airHumidity > 70) {
      newAlerts.push({
        type: "airHumidity",
        title: "Alerte d'humidité de l'air élevée",
        description: `L'humidité de l'air est de ${airHumidity.toFixed(1)}%, ce qui est au-dessus de la plage optimale.`,
        icon: <CloudIcon className="h-4 w-4 text-amber-500" />,
      })
    }

    if (soilHumidity < 20) {
      newAlerts.push({
        type: "soilHumidity",
        title: "Alerte d'humidité du sol basse",
        description: `L'humidité du sol est de ${soilHumidity.toFixed(1)}%, ce qui indique un besoin d'irrigation.`,
        icon: <CloudIcon className="h-4 w-4 text-amber-500" />,
      })
    } else if (soilHumidity > 40) {
      newAlerts.push({
        type: "soilHumidity",
        title: "Alerte d'humidité du sol élevée",
        description: `L'humidité du sol est de ${soilHumidity.toFixed(1)}%, ce qui peut indiquer un excès d'irrigation.`,
        icon: <CloudIcon className="h-4 w-4 text-amber-500" />,
      })
    }

    if (precipitation > 5) {
      newAlerts.push({
        type: "precipitation",
        title: "Alerte de précipitations",
        description: `Les précipitations actuelles sont de ${precipitation.toFixed(1)}mm, ce qui peut affecter l'irrigation.`,
        icon: <CloudRainIcon className="h-4 w-4 text-blue-500" />,
      })
    }

    if (pressure < 1000) {
      newAlerts.push({
        type: "pressure",
        title: "Alerte de basse pression",
        description: `La pression atmosphérique est de ${pressure.toFixed(0)}hPa, ce qui peut indiquer un changement météorologique.`,
        icon: <AlertTriangleIcon className="h-4 w-4 text-amber-500" />,
      })
    }

    setAlerts(newAlerts)
  }, [temperature, airHumidity, soilHumidity, precipitation, pressure])

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <Alert key={index} variant="default" className="bg-amber-50 dark:bg-amber-950/30">
          <div className="flex items-center gap-2">
            {alert.icon}
            <AlertTitle>{alert.title}</AlertTitle>
          </div>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
