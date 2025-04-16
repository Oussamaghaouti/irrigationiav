import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropletIcon, ThermometerIcon, PowerIcon } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "irrigation",
    message: "Irrigation déclenchée - Zone 1",
    timestamp: "Il y a 10 minutes",
    icon: <DropletIcon className="h-4 w-4" />,
    iconColor: "bg-blue-500",
  },
  {
    id: 2,
    type: "sensor",
    message: "Seuil d'humidité atteint - Zone 2",
    timestamp: "Il y a 25 minutes",
    icon: <ThermometerIcon className="h-4 w-4" />,
    iconColor: "bg-yellow-500",
  },
  {
    id: 3,
    type: "system",
    message: "Pompe activée",
    timestamp: "Il y a 30 minutes",
    icon: <PowerIcon className="h-4 w-4" />,
    iconColor: "bg-green-500",
  },
  {
    id: 4,
    type: "irrigation",
    message: "Irrigation terminée - Zone 1",
    timestamp: "Il y a 40 minutes",
    icon: <DropletIcon className="h-4 w-4" />,
    iconColor: "bg-blue-500",
  },
  {
    id: 5,
    type: "sensor",
    message: "Mise à jour des capteurs",
    timestamp: "Il y a 1 heure",
    icon: <ThermometerIcon className="h-4 w-4" />,
    iconColor: "bg-yellow-500",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <Avatar className="h-9 w-9 mr-4">
            <AvatarFallback className={`${activity.iconColor} text-white`}>{activity.icon}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{activity.message}</p>
            <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
