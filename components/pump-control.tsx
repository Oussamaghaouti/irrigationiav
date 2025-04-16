"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Power, Droplet, Settings2, AlertCircle,Info  } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ChannelData {
  field1?: string  // Température
  field2?: string  // Humidité air
  field3?: string  // Humidité sol
  field4?: string  // Précipitation
  field5?: string  // État pompe
  field6?: string  // Pression
  field7?: string  // Mode (0=auto, 1=manuel)
  created_at?: string
}

interface PumpControlProps {
  readApiKey: string
  writeApiKey: string
}

export function PumpControl({ readApiKey, writeApiKey }: PumpControlProps) {
  const [channelData, setChannelData] = useState<ChannelData>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
const [activeTab, setActiveTab] = useState<string>(channelData.field7 === "1" ? "manual" : "auto")
  // Références pour la gestion des modes
  const modeChangeInProgress = useRef(false)
  const checkInterval = useRef<NodeJS.Timeout | null>(null)
useEffect(() => {
  if (channelData.field7 !== undefined) {
    setActiveTab(channelData.field7 === "1" ? "manual" : "auto")
  }
}, [channelData.field7])
  // Récupération complète des données
  const fetchChannelData = async () => {
    try {
      setLoading(true)
      setError(null)

      const timestamp = new Date().getTime()
      const response = await fetch(
        `https://api.thingspeak.com/channels/2907633/feeds/last.json?api_key=${readApiKey}&t=${timestamp}`
      )

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

      const data = await response.json()
      setChannelData(data)

      // Vérification du mode si changement en cours
      if (modeChangeInProgress.current) {
        const currentMode = data.field7 !== undefined ? Number(data.field7) : 0
        const expectedMode = activeTab === "auto" ? 0 : 1
        
        if (currentMode === expectedMode) {
          modeChangeInProgress.current = false
          if (checkInterval.current) {
            clearInterval(checkInterval.current)
            checkInterval.current = null
          }
          toast({
            title: "Succès",
            description: `Mode ${expectedMode === 0 ? "manuel" : "automatique"} adopté`,
          })
        }
      }

      return data
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
      setError("Impossible de récupérer les données. Veuillez réessayer.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Mise à jour des données avec tous les champs
  const updateThingSpeak = async (updates: Partial<ChannelData>) => {
    try {
      setUpdating(true)
      setError(null)

      // Récupérer les valeurs actuelles
      const currentData = await fetchChannelData()
      
      // Préparer les paramètres avec toutes les valeurs
      const params = new URLSearchParams({
        api_key: writeApiKey,
        ...currentData,
        ...updates,
        created_at: new Date().toISOString()
      })

      // Envoyer la mise à jour
      const response = await fetch(`https://api.thingspeak.com/update?${params}`, {
        method: "POST"
      })

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

      const result = await response.text()
      if (Number(result) <= 0) throw new Error("Échec de la mise à jour")

      // Actualiser les données après un court délai
      setTimeout(fetchChannelData, 2000)
      return true
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      setError("Échec de la mise à jour. Veuillez réessayer.")
      toast({
        title: "Erreur",
        description: "La mise à jour a échoué",
        variant: "destructive",
      })
      return false
    } finally {
      setUpdating(false)
    }
  }

  // Gestion du changement de mode
  const handleModeChange = async (value: string) => {
    const newMode = value === "auto" ? 0 : 1
    setActiveTab(value)
    
    if (Number(channelData.field7) !== newMode) {
      modeChangeInProgress.current = true
      const success = await updateThingSpeak({ field7: newMode.toString() })
      
      if (success) {
        // Vérification périodique du changement
        checkInterval.current = setInterval(fetchChannelData, 5000)
        setTimeout(() => {
          if (modeChangeInProgress.current && checkInterval.current) {
            clearInterval(checkInterval.current)
            modeChangeInProgress.current = false
            toast({
              title: "Avertissement",
              description: "Le changement de mode a pris trop de temps",
              variant: "destructive",
            })
          }
        }, 30000)
      } else {
        modeChangeInProgress.current = false
        setActiveTab(newMode === 0 ? "auto" : "manual")
      }
    }
  }

  // Gestion de l'état de la pompe
  const handlePumpToggle = async () => {
    const newState = channelData.field5 === "1" ? "0" : "1"
    await updateThingSpeak({ field5: newState })
  }

  // Initialisation et intervalle de rafraîchissement
  useEffect(() => {
    fetchChannelData()

    const interval = setInterval(fetchChannelData, 30000)
    return () => {
      clearInterval(interval)
      if (checkInterval.current) clearInterval(checkInterval.current)
    }
  }, [readApiKey])

  // Calcul des états dérivés
  const pumpState = channelData.field5 === "1"
  const isAutoMode = channelData.field7 === "0"
  const lastUpdate = channelData.created_at ? new Date(channelData.created_at).toLocaleString() : ""

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Contrôle de la Pompe
        </CardTitle>
        <CardDescription>
          Système d'irrigation - Mode {isAutoMode ? "automatique" : "manuel"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* État actuel */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">État actuel</h3>
              <p className="text-xs text-muted-foreground">
                {loading ? "Chargement..." : `Dernière mise à jour: ${lastUpdate}`}
              </p>
              {modeChangeInProgress.current && (
                <p className="text-xs text-amber-500">Changement de mode en cours...</p>
              )}
            </div>

            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Badge
                variant={pumpState ? "default" : "outline"}
                className={pumpState ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {pumpState ? "ACTIVÉE" : "DÉSACTIVÉE"}
              </Badge>
            )}
          </div>

          {/* Affichage des erreurs */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Ajoutez cette nouvelle section pour la note d'information */}
<div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
  <div className="flex items-start gap-3">
    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
    <div>
      <p className="font-medium">Note importante :</p>
      <p className="mt-1">
        En cas d'erreur, cela peut être dû au délai de synchronisation de ThingSpeak.
        Veuillez patienter 10-15 secondes puis réessayer l'opération.
      </p>
    </div>
  </div>
</div>
          

          {/* Sélection du mode */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Mode de fonctionnement</h3>
            <Tabs 
              value={activeTab} 
              onValueChange={handleModeChange}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="auto" 
                  disabled={updating || modeChangeInProgress.current}
                >
                  Automatique
                </TabsTrigger>
                <TabsTrigger 
                  value="manual" 
                  disabled={updating || modeChangeInProgress.current}
                >
                  Manuel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="auto" className="mt-2">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-start gap-4">
                    <Settings2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm">
                        Le système contrôle automatiquement la pompe en fonction des conditions.
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Humidité sol: {channelData.field3 || 'N/A'}%</div>
                        <div>Température: {channelData.field1 || 'N/A'}°C</div>
                        <div>Humidité air: {channelData.field2 || 'N/A'}%</div>
                        <div>Précipitation: {channelData.field4 || 'N/A'}mm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-2">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <Power className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm">Contrôle manuel de la pompe.</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Les conditions actuelles ne sont pas prises en compte.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="pump-toggle" className="text-sm font-medium">
                        État de la pompe
                      </Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="pump-toggle"
                          checked={pumpState}
                          onCheckedChange={handlePumpToggle}
                          disabled={updating || isAutoMode || modeChangeInProgress.current}
                        />
                        <span className="text-sm">{pumpState ? "Activée" : "Désactivée"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          {isAutoMode ? "Le système gère automatiquement la pompe" : "Contrôle manuel adopté"}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchChannelData()} 
          disabled={loading || updating}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            "Actualiser"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
