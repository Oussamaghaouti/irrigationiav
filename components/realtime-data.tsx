"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ThingSpeakData {
  field1?: number // Temperature
  field2?: number // Air Humidity (corrigé)
  field3?: number // Soil Humidity (corrigé)
  field4?: number // Precipitation
  field6?: number // Pressure
  created_at: string
}

interface RealtimeDataProps {
  apiKey: string
}

export function RealtimeData({ apiKey }: RealtimeDataProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latestValues, setLatestValues] = useState({
    soilHumidity: 0,
    temperature: 0,
    airHumidity: 0,
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

        // Transform data for the chart - corrected field mapping
        const chartData = result.feeds.map((entry: any) => {
          const date = new Date(entry.created_at)
          return {
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            fullDateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            temperature: Number.parseFloat(entry.field1) || 0, // field1 is temperature
            airHumidity: Number.parseFloat(entry.field2) || 0, // field2 is air humidity
            soilHumidity: Number.parseFloat(entry.field3) || 0, // field3 is soil humidity
            precipitation: Number.parseFloat(entry.field4) || 0, // field4 is precipitation
            pressure: Number.parseFloat(entry.field6) || 0, // field6 is pressure
          }
        })

        // Get the latest values for display
        const latest = result.feeds[result.feeds.length - 1]
        setLatestValues({
          temperature: Number.parseFloat(latest.field1) || 0, // field1 is temperature
          airHumidity: Number.parseFloat(latest.field2) || 0, // field2 is air humidity
          soilHumidity: Number.parseFloat(latest.field3) || 0, // field3 is soil humidity
          precipitation: Number.parseFloat(latest.field4) || 0, // field4 is precipitation
          pressure: Number.parseFloat(latest.field6) || 0, // field6 is pressure
          lastUpdate: new Date(latest.created_at).toLocaleString(),
        })

        setData(chartData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(
          "Erreur lors de la récupération des données ThingSpeak. Vérifiez votre connexion et les paramètres de l'API.",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling every minute
    const interval = setInterval(fetchData, 60000)

    return () => clearInterval(interval)
  }, [apiKey])

  // Modifier la fonction getStatusBadge pour mettre à jour les plages optimales
  const getStatusBadge = (value: number, type: string) => {
    let status = "warning"
    let label = "Attention"

    switch (type) {
      case "temperature":
        if (value >= 15 && value <= 22) {
          status = "success"
          label = "Optimal"
        } else if (value < 10 || value > 30) {
          status = "destructive"
          label = "Critique"
        }
        break
      case "airHumidity":
        if (value >= 50 && value <= 70) {
          status = "success"
          label = "Optimal"
        } else if (value < 40 || value > 80) {
          status = "destructive"
          label = "Critique"
        }
        break
      case "soilHumidity":
        if (value >= 20 && value <= 40) {
          status = "success"
          label = "Optimal"
        } else if (value < 15) {
          status = "destructive"
          label = "Sec"
        } else if (value > 50) {
          status = "destructive"
          label = "Saturé"
        }
        break
    }

    return (
      <Badge
        variant={status === "success" ? "outline" : status === "destructive" ? "destructive" : "secondary"}
        className={
          status === "success"
            ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900"
            : ""
        }
      >
        {label}
      </Badge>
    )
  }

  if (loading && data.length === 0) {
    return <div className="flex justify-center p-8">Chargement des données ThingSpeak...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-1 items-center">
              <p className="text-sm text-muted-foreground">Température</p>
              <p className="text-2xl font-bold">{latestValues.temperature.toFixed(1)}°C</p>
              {getStatusBadge(latestValues.temperature, "temperature")}
            </div>
            <div className="flex flex-col gap-1 items-center">
              <p className="text-sm text-muted-foreground">Humidité de l'Air</p>
              <p className="text-2xl font-bold">{latestValues.airHumidity.toFixed(1)}%</p>
              {getStatusBadge(latestValues.airHumidity, "airHumidity")}
            </div>
            <div className="flex flex-col gap-1 items-center">
              <p className="text-sm text-muted-foreground">Humidité du Sol</p>
              <p className="text-2xl font-bold">{latestValues.soilHumidity.toFixed(1)}%</p>
              {getStatusBadge(latestValues.soilHumidity, "soilHumidity")}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Dernière mise à jour: {latestValues.lastUpdate}
          </p>
        </CardContent>
      </Card>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="humidity" domain={[0, 100]} />
          <YAxis yAxisId="temperature" orientation="right" />
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
          <Line yAxisId="temperature" type="monotone" dataKey="temperature" stroke="#ef4444" name="Température (°C)" />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="airHumidity"
            stroke="#1d4ed8" // Bleu plus foncé pour l'humidité de l'air
            name="Humidité de l'Air (%)"
          />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="soilHumidity"
            stroke="#3b82f6" // Bleu moyen pour l'humidité du sol
            name="Humidité du Sol (%)"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
