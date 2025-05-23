import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Metric }  from "@/lib/types"

interface MetricDisplayProps {
    metric: Metric
}

export default function MetricDisplay({ metric }: MetricDisplayProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                Conversation Metrics
                {metric && <Badge variant="outline">{metric.name}</Badge>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div>
                        <div className="font-medium">{metric.name}</div>
                        <div className="text-sm text-muted-foreground">{metric.definition}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
  )
}