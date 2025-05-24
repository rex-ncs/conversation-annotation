"use client";
import { useEffect, useState } from "react";
import { Conversation, Metric, User } from "@/lib/types";
import { MetricSelection } from "@/app/annotate/metric-selection";
import { ConversationDisplay } from "@/components/conversation-display";
import MetricDisplay from "@/components/metric-display";
import AnnotateForm from "@/components/annotate-form";
import { getConversationById } from "@/app/actions/conversations";

interface AnnotationProps {
    metrics: Metric[];
    conversationsId: string[];
    user: User;
}

export default function Annotation({metrics, conversationsId, user}: AnnotationProps) {
    const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);


    useEffect(() => {
        const fetchConversation = async () => {
            if (!selectedMetric) return;
            const conversation = await getConversationById(conversationsId[currentIndex]);
            if (!conversation) return;
            setCurrentConversation(conversation);
        }
        fetchConversation();
    }, [currentIndex, conversationsId, selectedMetric]);

    const handleNextConversation = () => {
        if (currentIndex < conversationsId.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }
    const handlePreviousConversation = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const onStartAnnotation = async (metric: Metric) => {
        setSelectedMetric(metric);
    }

    if (!selectedMetric) {
        return (
            <MetricSelection availableMetrics={metrics} onStartAnnotation={onStartAnnotation}/>
        )
    }

    if (!currentConversation) {
        return <div className="text-center text-muted-foreground">Loading conversation...</div>
    }

    console.log(selectedMetric)

    return (
      <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Conversation {currentIndex + 1} of {conversationsId.length}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-3 flex flex-col">
              <ConversationDisplay conversation={currentConversation} />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <MetricDisplay metric={selectedMetric} />
              <AnnotateForm 
                userId={user.id}
                conversationId={currentConversation.id}
                metricId={selectedMetric.id}
                handleNextConversation={handleNextConversation}
                handlePreviousConversation={handlePreviousConversation}
              />
            </div>
          </div>
      </div>
    );

}