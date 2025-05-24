"use client";
import { useEffect, useState } from "react";
import { Conversation, Metric, User } from "@/lib/types";
import { ConversationDisplay } from "@/components/conversation-display";
import MetricDisplay from "@/components/metric-display";
import AnnotateForm from "@/components/annotate-form";
import { getConversationById } from "@/app/actions/conversations";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { getMetricById } from "../actions/metrics";

interface AnnotationProps {
    conversationsId: string[];
    user: User;
}

export default function Annotation({conversationsId, user}: AnnotationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
    const metricId = searchParams.get("metricId");
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      conversationsId = [conversationId];
    }

    useEffect(() => {
      const fetchMetric = async () => {
          if (!metricId) {
            router.back()
            return;
          }
          const metric = await getMetricById(Number(metricId));
          if (!metric) {
            alert("Metric not found");
            router.back()
          }
          setSelectedMetric(metric);
      }
      fetchMetric();
    }, [])

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
    
    const onStopAnnotation = () => {
      router.back()
    }

    if (!currentConversation) {
        return <div className="text-center text-muted-foreground">Loading conversation...</div>
    }
    if (!selectedMetric) {
      alert("Metric not found");
      router.push("/metric");
    }

    return (
      <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Conversation {currentIndex + 1} of {conversationsId.length}
              </h2>
            </div>
            <Button variant={"destructive"} onClick={onStopAnnotation}>Stop Annotation</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-3 flex flex-col">
              <ConversationDisplay conversation={currentConversation} />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <MetricDisplay metric={selectedMetric!} />
              <AnnotateForm 
                userId={user.id}
                conversationId={currentConversation.id}
                metricId={selectedMetric!.id}
                handleNextConversation={handleNextConversation}
                isLastConversation={currentIndex === conversationsId.length - 1}
              />
            </div>
          </div>
      </div>
    );

}