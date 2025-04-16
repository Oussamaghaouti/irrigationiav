import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropletIcon,
  LeafIcon,
  BrainCircuitIcon,
  Target,
  ListChecks,
  Users,
  Layers,
  SatelliteDishIcon,
  DrillIcon as DroneIcon,
  SunIcon,
  DatabaseIcon,
  GlobeIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-6 md:p-8">
        <div className="absolute right-0 top-0 opacity-20">
          <SatelliteDishIcon className="h-64 w-64 rotate-12 text-green-500" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <Badge className="mb-4 bg-green-500 hover:bg-green-600">Projet IoT 2024-2025</Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            Système intelligent d'irrigation automatique des espaces verts
          </h1>
          <p className="text-muted-foreground md:text-lg">
            Une solution innovante basée sur les capteurs IoT et l'analyse d'images drones et satellitaires pour une
            gestion durable et économe des ressources en eau.
          </p>
        </div>
      </div>

      {/* Context Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5 text-green-500" />
            Contexte et justification
          </CardTitle>
          <CardDescription>Pourquoi ce projet est important</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Face aux défis liés à la rareté des ressources en eau et à la nécessité d'une gestion durable des
                espaces verts, il devient impératif d'optimiser les pratiques d'irrigation. Le gazon, en particulier,
                consomme une grande quantité d'eau et nécessite un suivi rigoureux.
              </p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Dans ce cadre, nous proposons un système intelligent d'irrigation automatique, combinant les
                technologies IoT, l'énergie solaire, le web et l'analyse d'images drones et satellaires, pour une
                agriculture innovante, économe en eau et respectueuse de l'environnement.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <DropletIcon className="h-8 w-8 text-blue-500" />
                  <h3 className="text-sm font-medium">Économie d'eau</h3>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <SunIcon className="h-8 w-8 text-yellow-500" />
                  <h3 className="text-sm font-medium">Énergie solaire</h3>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <DroneIcon className="h-8 w-8 text-purple-500" />
                  <h3 className="text-sm font-medium">Imagerie drone</h3>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <BrainCircuitIcon className="h-8 w-8 text-green-500" />
                  <h3 className="text-sm font-medium">Intelligence artificielle</h3>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectives and Phases */}
      <Tabs defaultValue="objectives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="objectives">Objectifs</TabsTrigger>
          <TabsTrigger value="phases">Phases du projet</TabsTrigger>
          <TabsTrigger value="outcomes">Retombées attendues</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-500" />
                Objectifs du projet
              </CardTitle>
              <CardDescription>Ce que nous visons à accomplir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <ListChecks className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm">
                    Réduire le gaspillage d'eau et le sur-arrosage par une irrigation ciblée et intelligente.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <ListChecks className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm">
                    Mettre en place un système d'irrigation autonome, automatisé et économe en énergie.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <ListChecks className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm">Assurer un suivi en temps réel des paramètres climatiques et du sol.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <ListChecks className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm">
                    Analyser les données collectées pour optimiser la prise de décision (arrosage intelligent).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <ListChecks className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm">
                    Utiliser les images drones ou satellitaires et l'intelligence artificielle avec des outils SIG.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <ListChecks className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm">
                    Sensibiliser à l'importance d'une agriculture durable appuyée sur les technologies modernes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" />
                Phases du projet
              </CardTitle>
              <CardDescription>Comment nous allons réaliser ce projet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Phase 1: Mise en place du système de collecte et de contrôle
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <ListChecks className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm">
                      Utilisation d'un ensemble de capteurs IoT: humidité du sol, température et humidité de l'air,
                      pression atmosphérique, capteur de pluie.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <ListChecks className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm">Contrôle de l'irrigation à l'aide d'une pompe reliée à un relais.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <ListChecks className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm">Alimentation du système par énergie solaire pour garantir son autonomie.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <ListChecks className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm">
                      Activation automatique de l'irrigation selon les seuils détectés par les capteurs.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">
                  Phase 2: Traitement des données et supervision via interface web
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <DatabaseIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm">
                      Transmission des données capteurs vers une base de données en temps réel (ThingSpeak).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <GlobeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm">
                      Création d'une interface web intuitive permettant le suivi, l'analyse et le contrôle du système
                      d'irrigation.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <BrainCircuitIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm">
                      Développement d'algorithmes simples d'aide à la décision basés sur les données environnementales.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Extension innovante: apport de l'imagerie drone et de l'IA</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-800">
                      <DroneIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-sm">Acquisition d'images aériennes par drone ou satellite des espaces verts.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-800">
                      <SatelliteDishIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-sm">
                      Traitement de ces images par des outils SIG pour calcul des indices spectraux (comme le NDVI).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-800">
                      <BrainCircuitIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-sm">
                      Croisement des données issues des capteurs IoT avec les résultats d'analyse d'image pour une
                      stratégie d'irrigation personnalisée.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LeafIcon className="h-5 w-5 text-green-500" />
                Retombées attendues
              </CardTitle>
              <CardDescription>Les impacts positifs de notre projet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <DropletIcon className="h-8 w-8 text-blue-500" />
                  <h3 className="text-sm font-medium">Amélioration de la gestion de l'eau</h3>
                  <p className="text-xs text-muted-foreground">Dans les espaces verts urbains</p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <SunIcon className="h-8 w-8 text-yellow-500" />
                  <h3 className="text-sm font-medium">Réduction des coûts</h3>
                  <p className="text-xs text-muted-foreground">Et des efforts liés à l'entretien des gazons</p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <SatelliteDishIcon className="h-8 w-8 text-purple-500" />
                  <h3 className="text-sm font-medium">Valorisation topographique</h3>
                  <p className="text-xs text-muted-foreground">Par l'usage d'images géoréférencées</p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
                  <BrainCircuitIcon className="h-8 w-8 text-green-500" />
                  <h3 className="text-sm font-medium">Promotion SIG–IoT–IA</h3>
                  <p className="text-xs text-muted-foreground">Dans des solutions concrètes d'irrigation</p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center md:col-span-2">
                  <GlobeIcon className="h-8 w-8 text-green-500" />
                  <h3 className="text-sm font-medium">Contribution à la transition écologique</h3>
                  <p className="text-xs text-muted-foreground">
                    Démonstration de l'apport des étudiants topographes à l'agriculture intelligente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Notre équipe
          </CardTitle>
          <CardDescription>Les porteurs du projet 2024-2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-green-100 text-green-800">MK</AvatarFallback>
              </Avatar>
              <h3 className="text-base font-medium">Meryem Kessou</h3>
              <p className="text-xs text-muted-foreground">0658548256</p>
              <Badge variant="outline" className="mt-2">
                Porteur du projet
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-blue-100 text-blue-800">OL</AvatarFallback>
              </Avatar>
              <h3 className="text-base font-medium">Oussama Lghaouti</h3>
              <p className="text-xs text-muted-foreground">0610121566</p>
              <Badge variant="outline" className="mt-2">
                Porteur du projet
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-purple-100 text-purple-800">OE</AvatarFallback>
              </Avatar>
              <h3 className="text-base font-medium">Oumayma Essayedi</h3>
              <p className="text-xs text-muted-foreground">0663013021</p>
              <Badge variant="outline" className="mt-2">
                Porteur du projet
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-3">Conclusion</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Ce projet représente une solution innovante, transversale et durable, qui mêle topographie, électronique,
              SIG, informatique et écologie. Il s'inscrit pleinement dans la dynamique de l'agriculture intelligente et
              de la gestion raisonnée des ressources naturelles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
