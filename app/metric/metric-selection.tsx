"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, BarChart3 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Metric } from "@/lib/types"

interface MetricSelectionProps {
  availableMetrics: Metric[]
}

export function MetricSelection({ availableMetrics }: MetricSelectionProps) {
  const [selectedMetricId, setSelectedMetricId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleMetricChange = (value: string) => {
    setSelectedMetricId(value)
    setError(null)
  }

  const handleStartAnnotation = () => {
    if (!selectedMetricId) {
      setError("Please select a metric to grade")
      return
    }

    const selectedMetric = availableMetrics.find((metric) => metric.id === Number(selectedMetricId))
    if (selectedMetric) {
      router.push("/annotate?metricId=" + selectedMetric.id)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Select a Metric to Grade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <p className="text-muted-foreground mb-4">
              Choose which metric you want to evaluate for each conversation in this session.
            </p>

            <Select value={selectedMetricId} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Metrics</SelectLabel>
                  {availableMetrics.map((metric) => (
                    <SelectItem key={metric.id} value={metric.id.toString()}>
                      {metric.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {selectedMetricId && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-1">{availableMetrics.find((m) => m.id === Number(selectedMetricId))?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {availableMetrics.find((m) => m.id === Number(selectedMetricId))?.definition}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center pt-4 border-t">
            <Button onClick={handleStartAnnotation} disabled={!selectedMetricId}>
              Start Annotation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
