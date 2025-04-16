"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    time: "00:00",
    fullDateTime: "21/04/2025 00:00",
    soilHumidity: 65,
    airHumidity: 45,
    temperature: 22,
    pressure: 1012,
  },
  {
    time: "03:00",
    fullDateTime: "21/04/2025 03:00",
    soilHumidity: 64,
    airHumidity: 47,
    temperature: 21,
    pressure: 1012,
  },
  {
    time: "06:00",
    fullDateTime: "21/04/2025 06:00",
    soilHumidity: 63,
    airHumidity: 48,
    temperature: 20,
    pressure: 1013,
  },
  {
    time: "09:00",
    fullDateTime: "21/04/2025 09:00",
    soilHumidity: 62,
    airHumidity: 46,
    temperature: 22,
    pressure: 1013,
  },
  {
    time: "12:00",
    fullDateTime: "21/04/2025 12:00",
    soilHumidity: 60,
    airHumidity: 44,
    temperature: 24,
    pressure: 1014,
  },
  {
    time: "15:00",
    fullDateTime: "21/04/2025 15:00",
    soilHumidity: 58,
    airHumidity: 42,
    temperature: 25,
    pressure: 1014,
  },
  {
    time: "18:00",
    fullDateTime: "21/04/2025 18:00",
    soilHumidity: 62,
    airHumidity: 43,
    temperature: 23,
    pressure: 1013,
  },
  {
    time: "21:00",
    fullDateTime: "21/04/2025 21:00",
    soilHumidity: 65,
    airHumidity: 44,
    temperature: 22,
    pressure: 1013,
  },
  {
    time: "24:00",
    fullDateTime: "22/04/2025 00:00",
    soilHumidity: 68,
    airHumidity: 45,
    temperature: 21,
    pressure: 1012,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="humidity" />
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
        <Line
          yAxisId="humidity"
          type="monotone"
          dataKey="soilHumidity"
          stroke="#3b82f6" // Bleu moyen pour l'humidité du sol
          name="Humidité du Sol (%)"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="humidity"
          type="monotone"
          dataKey="airHumidity"
          stroke="#1d4ed8" // Bleu plus foncé pour l'humidité de l'air
          name="Humidité de l'Air (%)"
        />
        <Line yAxisId="temperature" type="monotone" dataKey="temperature" stroke="#ef4444" name="Température (°C)" />
      </LineChart>
    </ResponsiveContainer>
  )
}
