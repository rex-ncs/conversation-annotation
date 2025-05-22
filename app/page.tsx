import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Conversation Annotation Tool</h1>
          <p className="text-muted-foreground mt-2">Login to your account</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
  
}
