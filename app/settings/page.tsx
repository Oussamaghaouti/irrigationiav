"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Settings {
  general: {
    systemName: string
    location: string
    autoIrrigation: boolean
    weatherIntegration: boolean
  }
  api: {
    channelId: string
    readApiKey: string
    writeApiKey: string
    apiEnabled: boolean
  }
  notifications: {
    email: string
    emailAlerts: boolean
    lowHumidityAlert: boolean
    systemStatusReports: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      systemName: "Système d'irrigation principal",
      location: "Zone vert",
      autoIrrigation: true,
      weatherIntegration: true
    },
    api: {
      channelId: "2907633",
      readApiKey: "LTA8AGP5GAQHA6E9",
      writeApiKey: "5VEAKRMZA8A1GM69",
      apiEnabled: true
    },
    notifications: {
      email: "",
      emailAlerts: true,
      lowHumidityAlert: true,
      systemStatusReports: true
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleInputChange = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = (section: keyof Settings) => {
    setIsSaving(true)
    
    // Simuler une requête API
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Succès",
        description: `Paramètres ${section} enregistrés avec succès`,
      })
      
      // Ici vous ajouteriez la logique réelle pour sauvegarder les paramètres
      // par exemple :
      // await saveSettingsToBackend(settings[section], section)
    }, 1000)
  }

  const testApiConnection = async () => {
    setIsSaving(true)
    try {
      // Simuler un test de connexion à l'API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Connexion réussie",
        description: "La connexion à l'API ThingSpeak fonctionne correctement",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la connexion à l'API ThingSpeak",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre système d'irrigation</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="api">API ThingSpeak</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Configurez les paramètres généraux de votre système d'irrigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-name">Nom du système</Label>
                <Input
                  id="system-name"
                  value={settings.general.systemName}
                  onChange={(e) => handleInputChange("general", "systemName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Emplacement</Label>
                <Input
                  id="location"
                  value={settings.general.location}
                  onChange={(e) => handleInputChange("general", "location", e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-irrigation">Irrigation automatique</Label>
                  <Switch
                    id="auto-irrigation"
                    checked={settings.general.autoIrrigation}
                    onCheckedChange={(checked) => handleInputChange("general", "autoIrrigation", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Activer l'irrigation automatique basée sur les seuils d'humidité
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weather-integration">Intégration météo</Label>
                  <Switch
                    id="weather-integration"
                    checked={settings.general.weatherIntegration}
                    onCheckedChange={(checked) => handleInputChange("general", "weatherIntegration", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ajuster l'irrigation en fonction des prévisions météorologiques
                </p>
              </div>

              <Button onClick={() => handleSave("general")} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Configuration API ThingSpeak</CardTitle>
              <CardDescription>Configurez les paramètres de connexion à l'API ThingSpeak</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="channel-id">ID du canal</Label>
                <Input
                  id="channel-id"
                  value={settings.api.channelId}
                  onChange={(e) => handleInputChange("api", "channelId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="read-api-key">Clé API de lecture</Label>
                <Input
                  id="read-api-key"
                  value={settings.api.readApiKey}
                  onChange={(e) => handleInputChange("api", "readApiKey", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="write-api-key">Clé API d'écriture</Label>
                <Input
                  id="write-api-key"
                  type="password"
                  value={settings.api.writeApiKey}
                  onChange={(e) => handleInputChange("api", "writeApiKey", e.target.value)}
                  placeholder="Entrez la clé API d'écriture"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-enabled">API activée</Label>
                  <Switch
                    id="api-enabled"
                    checked={settings.api.apiEnabled}
                    onCheckedChange={(checked) => handleInputChange("api", "apiEnabled", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Activer la connexion à l'API ThingSpeak</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={testApiConnection} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tester la connexion
                </Button>
                <Button onClick={() => handleSave("api")} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notification</CardTitle>
              <CardDescription>Configurez comment et quand vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.notifications.email}
                  onChange={(e) => handleInputChange("notifications", "email", e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts">Alertes par email</Label>
                  <Switch
                    id="email-alerts"
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) => handleInputChange("notifications", "emailAlerts", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Recevoir des alertes par email en cas de problème</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="low-humidity">Alerte d'humidité basse</Label>
                  <Switch
                    id="low-humidity"
                    checked={settings.notifications.lowHumidityAlert}
                    onCheckedChange={(checked) => handleInputChange("notifications", "lowHumidityAlert", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Être alerté lorsque l'humidité du sol est trop basse</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-status">Rapports de statut</Label>
                  <Switch
                    id="system-status"
                    checked={settings.notifications.systemStatusReports}
                    onCheckedChange={(checked) => handleInputChange("notifications", "systemStatusReports", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Recevoir des rapports quotidiens sur l'état du système</p>
              </div>

              <Button onClick={() => handleSave("notifications")} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
