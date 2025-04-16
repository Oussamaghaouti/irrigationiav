"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropletIcon, ThermometerIcon, CloudIcon, CloudRainIcon, GaugeIcon, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RealtimeData } from "@/components/realtime-data"
import { PumpControl } from "@/components/pump-control"
import { PressurePrecipitationChart } from "@/components/pressure-precipitation-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherAlert } from "@/components/weather-alert"

// ThingSpeak API keys
const READ_API_KEY = "LTA8AGP5GAQHA6E9"
const WRITE_API_KEY = "5VEAKRMZA8A1GM69"

export default function MonitoringPage() {
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("")
  const [latestData, setLatestData] = useState({
    soilHumidity: 0,
    temperature: 0,
    airHumidity: 0,
    precipitation: 0,
    pressure: 0,
  })

  async function fetchLatestData() {
    try {
      setLoading(true)
      // Fetch the latest entry from ThingSpeak
      const response = await fetch(
        `https://api.thingspeak.com/channels/2907633/feeds/last.json?api_key=${READ_API_KEY}`,
      )

      if (response.ok) {
        const data = await response.json()
        setLatestData({
          temperature: Number.parseFloat(data.field1) || 0, // field1 is temperature
          airHumidity: Number.parseFloat(data.field2) || 0, // field2 is air humidity
          soilHumidity: Number.parseFloat(data.field3) || 0, // field3 is soil humidity
          precipitation: Number.parseFloat(data.field4) || 0, // field4 is precipitation
          pressure: Number.parseFloat(data.field6) || 0, // field6 is pressure
        })
        setLastUpdate(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error("Error fetching latest data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.thingspeak.com/channels/2907633/feeds/last.json?api_key=${READ_API_KEY}`,
      )

      if (response.ok) {
        const data = await response.json()
        setLatestData({
          temperature: Number.parseFloat(data.field1) || 0, // field1 is temperature
          airHumidity: Number.parseFloat(data.field2) || 0, // field2 is air humidity
          soilHumidity: Number.parseFloat(data.field3) || 0, // field3 is soil humidity
          precipitation: Number.parseFloat(data.field4) || 0, // field4 is precipitation
          pressure: Number.parseFloat(data.field6) || 0, // field6 is pressure
        })
        setLastUpdate(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestData()

    // Update time every minute
    const interval = setInterval(() => {
      fetchLatestData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Surveillance en Temps Réel</h1>
          <p className="text-muted-foreground">Dernière mise à jour: {loading ? "Chargement..." : lastUpdate}</p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      {/* Alertes météo */}
      <WeatherAlert
        temperature={latestData.temperature}
        airHumidity={latestData.airHumidity}
        soilHumidity={latestData.soilHumidity}
        precipitation={latestData.precipitation}
        pressure={latestData.pressure}
      />

      {/* Cartes d'indicateurs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Température</CardTitle>
            <ThermometerIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.temperature.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">Optimal: 15-22°C</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidité de l'Air</CardTitle>
            <CloudIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.airHumidity.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Optimal: 50-70%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidité du Sol</CardTitle>
            <DropletIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.soilHumidity.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Optimal: 20-40%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Précipitation</CardTitle>
            <CloudRainIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.precipitation.toFixed(1)} mm</div>
            <p className="text-xs text-muted-foreground">Dernières 24h</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pression</CardTitle>
            <GaugeIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.pressure.toFixed(0)} hPa</div>
            <p className="text-xs text-muted-foreground">Stable</p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour les graphiques et le contrôle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Visualisation et Contrôle
          </CardTitle>
          <CardDescription>Données en temps réel et contrôle du système d'irrigation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature-humidity" className="space-y-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="temperature-humidity">Température & Humidité</TabsTrigger>
              <TabsTrigger value="precipitation-pressure">Précipitation & Pression</TabsTrigger>
              <TabsTrigger value="pump-control">Contrôle de la Pompe</TabsTrigger>
            </TabsList>

            <TabsContent value="temperature-humidity" className="space-y-4">
              <RealtimeData apiKey={READ_API_KEY} />
            </TabsContent>

            <TabsContent value="precipitation-pressure" className="space-y-4">
              <PressurePrecipitationChart apiKey={READ_API_KEY} />
            </TabsContent>

            <TabsContent value="pump-control" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <PumpControl readApiKey={READ_API_KEY} writeApiKey={WRITE_API_KEY} />

                <Card>
                  <CardHeader>
                    <CardTitle>Conditions d'Irrigation</CardTitle>
                    <CardDescription>Paramètres actuels et seuils d'activation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Seuils d'activation automatique</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Température:</span>
                          <span>&gt; 16.3°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Humidité de l'air:</span>
                          <span>&lt; 62.4%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Humidité du sol:</span>
                          <span>&lt; 33.6%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Précipitation:</span>
                          <span>&lt; 2.2mm</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Logique d'activation</h3>
                      <p className="text-xs text-muted-foreground">
                        La pompe s'active automatiquement lorsque la température est supérieure à 16.3°C, les
                        précipitations sont inférieures à 2.2mm, l'humidité de l'air est inférieure à 62.4 et l'humidité du sol est inférieure à 33.6%.
                      </p>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs">
                        <span className="font-medium">Note:</span> Ces paramètres sont configurés dans le
                        microcontrôleur ESP32 et peuvent être ajustés selon les besoins spécifiques de vos espaces
                        verts.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
