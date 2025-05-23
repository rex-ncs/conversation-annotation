"use client";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

export default function AnnotateForm(){
    const [passed, setPassed] = useState<boolean | null>(null);
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = () => {}

    return (
        <Card>
        <CardHeader>
            <CardTitle>Annotate Conversation</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Evaluation</Label>
                <RadioGroup
                value={passed === null ? undefined : passed.toString()}
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
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={passed === null || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit & Continue"}
            </Button>
            </CardFooter>
        </form>
        </Card>
    )
}
