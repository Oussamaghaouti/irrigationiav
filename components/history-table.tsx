"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HistoryTableProps {
  parameter: string
  dateRange?: { from: Date; to: Date } | null
  onApplyFilter?: (success: boolean) => void
  shouldFetch: boolean // Nouvelle prop pour contrôler quand effectuer la requête
}

export function HistoryTable({ parameter, dateRange, onApplyFilter, shouldFetch }: HistoryTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    // Ne pas effectuer la requête si shouldFetch est false
    if (!shouldFetch) return

    async function fetchHistoricalData() {
      try {
        setLoading(true)
        setError(null)

        // URL de base pour l'API ThingSpeak
        let url = `https://api.thingspeak.com/channels/2907633/feeds.json?api_key=LTA8AGP5GAQHA6E9&results=1000`

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

        // Transform data for the table
        const tableData = result.feeds.map((entry: any, index: number) => {
          const date = new Date(entry.created_at)
          return {
            id: index,
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            value: Number.parseFloat(entry[fieldMap[parameter]]) || 0,
            timestamp: date.getTime(), // Pour le tri
          }
        })

        // Trier par date (du plus récent au plus ancien)
        const sortedData = tableData.sort((a, b) => b.timestamp - a.timestamp)

        setData(sortedData)
        setPage(1) // Réinitialiser à la première page
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

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(data.length / pageSize)

  // Corriger les labels dans getValueLabel
  const getValueLabel = () => {
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
        return "Valeur"
    }
  }

  if (loading && shouldFetch) {
    return <div className="flex justify-center p-8">Chargement des données historiques...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (data.length === 0 && shouldFetch) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Aucune donnée disponible pour la période sélectionnée.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <p className="text-sm text-muted-foreground">{data.length} enregistrements au total</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Afficher</p>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number.parseInt(value))}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">par page</p>
          </div>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>{getValueLabel()}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.value.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  {shouldFetch
                    ? "Aucune donnée disponible"
                    : "Veuillez appliquer les filtres pour afficher les données"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > pageSize && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i

                if (pageNumber <= 0 || pageNumber > totalPages) return null

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink isActive={pageNumber === page} onClick={() => setPage(pageNumber)}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
