"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HistoryTable } from "@/components/history-table"
import { HistoryChart } from "@/components/history-chart"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function HistoryPage() {
  // Utiliser des dates clonées pour éviter les problèmes de mutation
  const defaultStartDate = new Date(2025, 3, 1) // 1er avril 2025
  const defaultEndDate = new Date(2025, 3, 21) // 21 avril 2025

  const [startDate, setStartDate] = useState<Date>(new Date(defaultStartDate))
  const [endDate, setEndDate] = useState<Date>(new Date(defaultEndDate))
  const [parameter, setParameter] = useState("temperature")
  const [appliedStartDate, setAppliedStartDate] = useState<Date>(new Date(defaultStartDate))
  const [appliedEndDate, setAppliedEndDate] = useState<Date>(new Date(defaultEndDate))
  const [appliedParameter, setAppliedParameter] = useState("temperature")
  const [isApplying, setIsApplying] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false) // Nouvelle variable d'état

  // Préréglages de périodes
  const presets = [
    {
      name: "Dernière semaine",
      action: () => {
        const end = new Date()
        const start = subDays(end, 7)
        setStartDate(new Date(start))
        setEndDate(new Date(end))
      },
    },
    {
      name: "Dernier mois",
      action: () => {
        const end = new Date()
        const start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate())
        setStartDate(new Date(start))
        setEndDate(new Date(end))
      },
    },
    {
      name: "Avril 2025",
      action: () => {
        setStartDate(new Date(2025, 3, 1))
        setEndDate(new Date(2025, 3, 30))
      },
    },
    {
      name: "Mars 2025",
      action: () => {
        setStartDate(new Date(2025, 2, 1))
        setEndDate(new Date(2025, 2, 31))
      },
    },
  ]

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setStartDate(new Date(e.target.value))
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setEndDate(new Date(e.target.value))
    }
  }

  const handleApplyFilters = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une plage de dates complète",
        variant: "destructive",
      })
      return
    }

    if (startDate > endDate) {
      toast({
        title: "Erreur",
        description: "La date de début doit être antérieure à la date de fin",
        variant: "destructive",
      })
      return
    }

    setIsApplying(true)
    // Utiliser des clones pour éviter les problèmes de mutation
    setAppliedStartDate(new Date(startDate))
    setAppliedEndDate(new Date(endDate))
    setAppliedParameter(parameter)
    setShouldFetch(true) // Activer la récupération des données
  }

  const handleFilterApplied = (success: boolean) => {
    setIsApplying(false)
    if (success) {
      toast({
        title: "Filtres appliqués",
        description: "Les données ont été mises à jour avec les filtres sélectionnés",
      })
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer les filtres. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Historique des Données</h1>
        <p className="text-muted-foreground">
          Consultez l'historique des données collectées par le système d'irrigation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Sélectionnez une période et un paramètre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="start-date">Date de début</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={format(startDate, "yyyy-MM-dd")}
                  onChange={handleStartDateChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="end-date">Date de fin</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={format(endDate, "yyyy-MM-dd")}
                  onChange={handleEndDateChange}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {presets.map((preset, index) => (
                  <Button key={index} variant="outline" size="sm" onClick={preset.action}>
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Paramètre</p>
              <Select value={parameter} onValueChange={setParameter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un paramètre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Température</SelectItem>
                  <SelectItem value="airHumidity">Humidité de l'air</SelectItem>
                  <SelectItem value="soilHumidity">Humidité du sol</SelectItem>
                  <SelectItem value="pressure">Pression</SelectItem>
                  <SelectItem value="precipitation">Précipitation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Informations sur les données</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Données disponibles du 1er janvier au 21 avril 2025</p>
                <p>• Données brutes disponibles dans le tableau</p>
              </div>
            </div>

            <Button className="w-full" onClick={handleApplyFilters} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Application en cours...
                </>
              ) : (
                "Appliquer les filtres"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Visualisation des données</CardTitle>
            <CardDescription>
              {appliedParameter === "temperature" && "Historique de la température"}
              {appliedParameter === "soilHumidity" && "Historique de l'humidité du sol"}
              {appliedParameter === "airHumidity" && "Historique de l'humidité de l'air"}
              {appliedParameter === "pressure" && "Historique de la pression atmosphérique"}
              {appliedParameter === "precipitation" && "Historique des précipitations"}
              {shouldFetch && (
                <span className="block mt-1 text-xs">
                  Période: {format(appliedStartDate, "dd/MM/yyyy")} - {format(appliedEndDate, "dd/MM/yyyy")}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Graphique</TabsTrigger>
                <TabsTrigger value="table">Tableau</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <HistoryChart
                  parameter={appliedParameter}
                  dateRange={{ from: appliedStartDate, to: appliedEndDate }}
                  onApplyFilter={handleFilterApplied}
                  shouldFetch={shouldFetch}
                />
                {!shouldFetch && (
                  <div className="flex justify-center items-center h-[350px] border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">Veuillez appliquer les filtres pour afficher les données</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="table">
                <HistoryTable
                  parameter={appliedParameter}
                  dateRange={{ from: appliedStartDate, to: appliedEndDate }}
                  onApplyFilter={handleFilterApplied}
                  shouldFetch={shouldFetch}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
