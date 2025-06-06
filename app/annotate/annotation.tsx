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
import { getUnannotatedConversationsForUserAndMetric } from "../actions/annotation";
import shuffleArray from "@/utils/shuffle";

interface AnnotationProps {
    user: User;
}

export default function Annotation({user}: AnnotationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
    const metricId = searchParams.get("metricId");
    const conversationId = searchParams.get("conversationId");

    if (!metricId) {
      return (
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold m-2">No Conversations Available</h1>
          <p className="text-muted-foreground">
            No metric provided. Please click on Start Annotation to begin.
          </p>
        </div>
      );
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
        const fetchConversations = async () => {
            if (!selectedMetric) return;
            if (conversationId) {
              const conversation = await getConversationById(conversationId!);
              if (!conversation) {
                alert("Conversation not found");
                router.back();
                return;
              }
              setConversations([conversation]);
              return;
            }
            const conversations = await getUnannotatedConversationsForUserAndMetric(user.id, selectedMetric.id);
            if (!conversations || conversations.length === 0) {
              return;
            }
            setConversations(shuffleArray(conversations));
        }
        fetchConversations();
    }, [conversationId, selectedMetric]);

    const handleNextConversation = () => {
        if (currentIndex < conversations.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }
    
    const onStopAnnotation = () => {
      router.back()
    }
    
    if (conversations.length === 0) {
      return (
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold m-2">No Conversations Available</h1>
          <p className="text-muted-foreground">
            There are no conversations available for annotation with the selected metric.
          </p>
        </div>
      );
    }

    const currentConversation = conversations[currentIndex];

    return (
      <>
      <div className="min-h-screen px-4">
        {/* Header with annotation count and stop button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">
            { conversationId ? 
              `Editing Conversation: ${currentConversation.id}` : 
              `Number of Annotation Left: ${conversations.length - currentIndex}`
            }
          </h2>
          <Button variant="destructive" onClick={onStopAnnotation}>Stop Annotation</Button>
        </div>
        <MetricDisplay metric={selectedMetric!} />
        <ConversationDisplay conversation={currentConversation} />
        <AnnotateForm 
          userId={user.id}
          conversationId={currentConversation.id}
          metricId={selectedMetric!.id}
          handleNextConversation={handleNextConversation}
          shouldFetchAnnotations={!!conversationId}
          isLastConversation={currentIndex === conversations.length - 1}
        />
      </div>
      </>
    );

}