"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { login } from "@/app/actions/auth"

export function LoginForm() {
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim()) {
      const { success, error } = await login(name)
      if (!success) alert(error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your name to start annotating conversations</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4 mb-3">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            Start Annotating
          </Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
