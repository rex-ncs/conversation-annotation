"use client";

import { useState } from "react";
import { Metric, Conversation} from "@/lib/types";
import { MetricSelection } from "@/components/metric-selection";
import AnnotateConversationForm from "@/components/annotate-conversation-form";

interface AnnotationBodyProps {
    metrics : Metric[]
    conversations: Conversation[]
}

export default function AnnotationBody({ metrics, conversations }: AnnotationBodyProps) {
    const [selectedMetric, setSelectedMetric] = useState<Metric>();
    const onStartAnnotation = (metric: Metric) => {
        setSelectedMetric(metric);
    }
    const onEndAnnotation = () => {
        setSelectedMetric(undefined);
    }
    
    return (
        selectedMetric ? (
            <AnnotateConversationForm selectedMetric={selectedMetric} conversations={conversations}/>
        ) : (
            <MetricSelection availableMetrics={metrics} onStartAnnotation={onStartAnnotation} />
        )
    );
}