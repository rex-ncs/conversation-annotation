"use client";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { createAnnotation, getAnnotation, updateAnnotation } from "@/app/actions/annotation";
import { Verdict } from "@/lib/generated/prisma";
import { redirect } from "next/navigation";

interface AnnotateFormProps {
    userId: number;
    conversationId: string;
    metricId: number;
    handleNextConversation: () => void;
    shouldFetchAnnotations: boolean;
    isLastConversation: boolean;
}

export default function AnnotateForm({
    userId,
    conversationId,
    metricId,
    handleNextConversation,
    shouldFetchAnnotations,
    isLastConversation
}: AnnotateFormProps){
    const [passed, setPassed] = useState<boolean | null>(null);
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const fetchAnnotations = async () => {
            if (!shouldFetchAnnotations) return;
            const annotation = await getAnnotation({ userId, conversationId, metricId });
            if (annotation) {
                setPassed(annotation.verdict === "pass");
                setComment(annotation.comments || "");
            }
        }
        fetchAnnotations();
    }, [shouldFetchAnnotations, userId, conversationId, metricId]);

    const validateForm = () => {
        if (passed === null) {
            alert("Please select an evaluation option.");
            setIsSubmitting(false);
            return false;
        }
        if (comment.trim() === "") {
            alert("Please add a comment.");
            setIsSubmitting(false);
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true)
        if (!validateForm()) {
            return;
        }
        const payload = {
            userId,
            conversationId,
            metricId,
            verdict: passed ? Verdict.pass : Verdict.fail,
            comments: comment
        }

        const { success, error } = (
            shouldFetchAnnotations 
            ? await updateAnnotation(payload) 
            : await createAnnotation(payload)
        )
        if (!success) {
            alert(error);
            setIsSubmitting(false);
            return;
        }
        if (isLastConversation) {
            alert("All conversations annotated successfully!");
            redirect("/dashboard")
        }
        handleNextConversation();
        setIsSubmitting(false);
        setPassed(null);
        setComment("");
    }

    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Evaluation (1/3 width) */}
          <div className="col-span-1">
            <h2 className="text-lg font-medium mb-4">Annotate Conversation</h2>
            <div className="space-y-2">
              <Label>Evaluation</Label>
              <RadioGroup
                value={passed === null ? "" : passed.toString()}
                onValueChange={(value) => setPassed(value === "true")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="pass" />
                  <Label htmlFor="pass" className="cursor-pointer">
                    Pass
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="fail" />
                  <Label htmlFor="fail" className="cursor-pointer">
                    Fail
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Comments (2/3 width) */}
          <div className="col-span-2">
            <div className="space-y-2">
              <Label htmlFor="comment">Comments</Label>
              <Textarea
                id="comment"
                placeholder="Add your comments about this conversation..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button - Full Width Below */}
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700"
            disabled={passed === null || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : isLastConversation ? "Submit & Finish" : "Submit & Continue"}
          </Button>
        </div>
      </form>
    )
}
