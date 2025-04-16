"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CloudRainIcon, GaugeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PressurePrecipitationChartProps {
  apiKey: string
}

export function PressurePrecipitationChart({ apiKey }: PressurePrecipitationChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latestValues, setLatestValues] = useState({
    precipitation: 0,
    pressure: 0,
    lastUpdate: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch data from ThingSpeak using the provided API key
        const response = await fetch(
          `https://api.thingspeak.com/channels/2907633/feeds.json?api_key=${apiKey}&results=20`,
        )

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const result = await response.json()

        if (!result.feeds || result.feeds.length === 0) {
          throw new Error("Aucune donnée disponible")
        }

        // Transform data for the chart
        const chartData = result.feeds.map((entry: any) => {
          const date = new Date(entry.created_at)
          return {
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            fullDateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            precipitation: Number.parseFloat(entry.field4) || 0, // field4 is precipitation
            pressure: Number.parseFloat(entry.field6) || 0, // field6 is pressure
          }
        })

        // Get the latest values
        const latest = result.feeds[result.feeds.length - 1]
        setLatestValues({
          precipitation: Number.parseFloat(latest.field4) || 0,
          pressure: Number.parseFloat(latest.field6) || 0,
          lastUpdate: new Date(latest.created_at).toLocaleString(),
        })

        setData(chartData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Erreur lors de la récupération des données ThingSpeak.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling every minute
    const interval = setInterval(fetchData, 60000)

    return () => clearInterval(interval)
  }, [apiKey])

  // Fonction pour déterminer le statut de la pression atmosphérique
  const getPressureStatus = (pressure: number) => {
    if (pressure < 1000) return { label: "Basse", variant: "destructive" }
    if (pressure > 1030) return { label: "Haute", variant: "destructive" }
    if (pressure >= 1000 && pressure < 1010) return { label: "Légèrement basse", variant: "secondary" }
    if (pressure > 1020 && pressure <= 1030) return { label: "Légèrement haute", variant: "secondary" }
    return { label: "Normale", variant: "outline" }
  }

  // Fonction pour déterminer le statut des précipitations
  const getPrecipitationStatus = (precipitation: number) => {
    if (precipitation === 0) return { label: "Aucune", variant: "outline" }
    if (precipitation < 1) return { label: "Légère", variant: "secondary" }
    if (precipitation >= 1 && precipitation < 5) return { label: "Modérée", variant: "secondary" }
    if (precipitation >= 5) return { label: "Forte", variant: "destructive" }
    return { label: "Inconnue", variant: "secondary" }
  }

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const pressureStatus = getPressureStatus(latestValues.pressure)
  const precipitationStatus = getPrecipitationStatus(latestValues.precipitation)

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1 items-center">
              <div className="flex items-center gap-2">
                <CloudRainIcon className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Précipitation</p>
              </div>
              <p className="text-2xl font-bold">{latestValues.precipitation.toFixed(1)} mm</p>
              <Badge
                variant={
                  precipitationStatus.variant === "outline"
                    ? "outline"
                    : precipitationStatus.variant === "destructive"
                      ? "destructive"
                      : "secondary"
                }
                className={
                  precipitationStatus.variant === "outline"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900"
                    : ""
                }
              >
                {precipitationStatus.label}
              </Badge>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <div className="flex items-center gap-2">
                <GaugeIcon className="h-4 w-4 text-purple-500" />
                <p className="text-sm text-muted-foreground">Pression</p>
              </div>
              <p className="text-2xl font-bold">{latestValues.pressure.toFixed(0)} hPa</p>
              <Badge
                variant={
                  pressureStatus.variant === "outline"
                    ? "outline"
                    : pressureStatus.variant === "destructive"
                      ? "destructive"
                      : "secondary"
                }
                className={
                  pressureStatus.variant === "outline"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900"
                    : ""
                }
              >
                {pressureStatus.label}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Dernière mise à jour: {latestValues.lastUpdate}
          </p>
        </CardContent>
      </Card>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="precipitation" orientation="left" domain={[0, "auto"]} />
          <YAxis yAxisId="pressure" orientation="right" domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ color: "#000000" }}
            labelStyle={{ color: "#000000", fontWeight: "bold" }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return `Date et heure: ${payload[0].payload.fullDateTime}`
              }
              return `Heure: ${label}`
            }}
          />
          <Legend />
          <ReferenceLine yAxisId="pressure" y={1013} stroke="#a855f7" strokeDasharray="3 3" label="Pression normale" />
          <Line
            yAxisId="precipitation"
            type="monotone"
            dataKey="precipitation"
            stroke="#0ea5e9"
            name="Précipitation (mm)"
            activeDot={{ r: 8 }}
          />
          <Line yAxisId="pressure" type="monotone" dataKey="pressure" stroke="#a855f7" name="Pression (hPa)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
