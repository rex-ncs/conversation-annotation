"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { register } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    if (!name.trim()) {
        setError("Name is required")
        setIsSubmitting(false)
        return
    }

    const { success, error } = await register(name)
    if (!success && error) {
        setError(error)
        setIsSubmitting(false)
        return
    } 

    router.push("/")
    setError(null)
    setIsSubmitting(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Conversation Annotation Tool</h1>
          <p className="text-muted-foreground mt-2">Register to start annotating</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account with just your name</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid w-full items-center gap-2 mb-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
