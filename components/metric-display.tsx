import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Metric }  from "@/lib/types"

interface MetricDisplayProps {
    metric: Metric
}

export default function MetricDisplay({ metric }: MetricDisplayProps){
    return (
      <div className="mb-4 p-3 bg-white rounded-lg border">
        <div className="flex items-center gap-4">
          <h2 className="font-medium">Conversation Metrics</h2>
          <Badge variant="outline">{metric.name}</Badge>
          <span className="text-sm text-gray-600">
            {metric.definition}
          </span>
        </div>
      </div>
  )
}