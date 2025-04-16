"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface HistoryChartProps {
  parameter: string
  dateRange?: { from: Date; to: Date } | null
  onApplyFilter?: (success: boolean) => void
  shouldFetch: boolean // Nouvelle prop pour contrôler quand effectuer la requête
}

export function HistoryChart({ parameter, dateRange, onApplyFilter, shouldFetch }: HistoryChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ne pas effectuer la requête si shouldFetch est false
    if (!shouldFetch) return

    async function fetchHistoricalData() {
      try {
        setLoading(true)
        setError(null)

        // URL de base pour l'API ThingSpeak
        let url = `https://api.thingspeak.com/channels/2907633/feeds.json?api_key=LTA8AGP5GAQHA6E9&results=50`

        // Si une plage de dates est spécifiée, l'utiliser pour filtrer les données
        if (dateRange && dateRange.from && dateRange.to) {
          // Formater les dates pour ThingSpeak (YYYY-MM-DD HH:MM:SS)
          const startDate = dateRange.from.toISOString().slice(0, 19)
          const endDate = new Date(dateRange.to.setHours(23, 59, 59)).toISOString().slice(0, 19)

          console.log("Fetching data from:", startDate, "to:", endDate)

          // Utiliser les paramètres start et end pour ThingSpeak
          url = `https://api.thingspeak.com/channels/2907633/feeds.json?api_key=LTA8AGP5GAQHA6E9&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}&results=1000`
        }

        console.log("Fetching URL:", url)

        // Fetch data from ThingSpeak
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const result = await response.json()
        console.log("API response:", result)

        if (!result.feeds || result.feeds.length === 0) {
          throw new Error("Aucune donnée historique disponible")
        }

        // Map field names to their indices in the ThingSpeak data
        const fieldMap: Record<string, string> = {
          temperature: "field1", // field1 is temperature
          airHumidity: "field2", // field2 is air humidity
          soilHumidity: "field3", // field3 is soil humidity
          precipitation: "field4", // field4 is precipitation
          pressure: "field6", // field6 is pressure
        }

        // Transform data for the chart - Maintenant avec date et heure
        const chartData = result.feeds.map((entry: any) => {
          const date = new Date(entry.created_at)
          return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            fullDateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            value: Number.parseFloat(entry[fieldMap[parameter]]) || 0,
          }
        })

        setData(chartData)
        if (onApplyFilter) {
          onApplyFilter(true)
        }
      } catch (err) {
        console.error("Error fetching historical data:", err)
        setError("Erreur lors de la récupération des données historiques.")
        if (onApplyFilter) {
          onApplyFilter(false)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [parameter, dateRange, onApplyFilter, shouldFetch])

  // Corriger les labels dans getYAxisLabel
  const getYAxisLabel = () => {
    switch (parameter) {
      case "temperature":
        return "Température (°C)"
      case "airHumidity":
        return "Humidité de l'Air (%)"
      case "soilHumidity":
        return "Humidité du Sol (%)"
      case "pressure":
        return "Pression (hPa)"
      case "precipitation":
        return "Précipitation (mm)"
      default:
        return ""
    }
  }

  // Corriger les couleurs dans getLineColor
  const getLineColor = () => {
    switch (parameter) {
      case "temperature":
        return "#ef4444"
      case "airHumidity":
        return "#1d4ed8" // Bleu plus foncé pour l'humidité de l'air
      case "soilHumidity":
        return "#3b82f6" // Bleu moyen pour l'humidité du sol
      case "pressure":
        return "#a855f7"
      case "precipitation":
        return "#0ea5e9"
      default:
        return "#3b82f6"
    }
  }

  if (loading && data.length === 0) {
    return <div className="flex justify-center p-8">Chargement des données historiques...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          contentStyle={{ color: "#000000" }}
          labelStyle={{ color: "#000000", fontWeight: "bold" }}
          formatter={(value: number) => [`${value}`, getYAxisLabel()]}
          labelFormatter={(label, payload) => {
            if (payload && payload.length > 0) {
              return `Date et heure: ${payload[0].payload.fullDateTime}`
            }
            return `Date: ${label}`
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="value" stroke={getLineColor()} name={getYAxisLabel()} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
