"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Upload, File as FileIcon, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Message } from "@/lib/types"
import { createConversation } from "../actions/conversations"

interface FileWithPreview extends File {
  id: string
  preview?: string
  status: "pending" | "uploading" | "processing" | "completed" | "error"
  progress: number
  fileName?: string
  error?: string
}

export default function MultiFileUploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithPreview[] = acceptedFiles.map((file) => {
      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: Math.random().toString(36),
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        status: "pending" as const,
        progress: 0,
      })
      return fileWithPreview
    })
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "application/pdf": [".pdf"],
      "text/*": [".txt", ".csv", ".json"],
      "application/json": [".json"],
      "text/csv": [".csv"],
    },
  })

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const processFile = async (file: FileWithPreview): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check if the file is a JSON file by MIME type or extension
      const isJson =
        file.type === "application/json" ||
        file.name.toLowerCase().endsWith(".json")

      if (!isJson) {
        reject(new Error("Only JSON files are supported for processing."))
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string)
          resolve(JSON.stringify(parsed, null, 2))
        } catch (err) {
          reject(new Error("Invalid JSON file."))
        }
      }
      reader.onerror = () => {
        reject(reader.error)
      }
      reader.readAsText(file)
    })
  }

  const uploadAndProcessFiles = async () => {
    if (files.length === 0) return

    setIsProcessing(true)

    for (const file of files) {
      if (file.status !== "pending") continue

      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "processing" as const } : f)))

      // Process the file
      const result = await processFile(file)

      // Update status to uploading
      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "uploading" as const } : f)))

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress } : f)))
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      const messages: Message[] = JSON.parse(result).messages || []
      const fileName = file.name.replace(/\.[^/.]+$/, "") // Remove file extension for conversation ID
      console.log("Creating conversation with ID:", fileName, "and messages:", messages)
      const { success, error } = await createConversation(fileName, messages)

      if (!success) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                ...f,
                status: "error" as const,
                error: error 
              }
              : f,
          )
        )
      }

      // Update status to completed
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
              ...f,
              status: "completed" as const,
              fileName,
              progress: 100,
            }
            : f,
        ),
      )
    }
    setIsProcessing(false)
  }

  const clearAll = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }

  const getStatusIcon = (status: FileWithPreview["status"]) => {
    switch (status) {
      case "pending":
        return <FileIcon className="h-4 w-4 text-muted-foreground" />
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: FileWithPreview["status"]) => {
    const variants = {
      pending: "secondary",
      uploading: "default",
      processing: "default",
      completed: "default",
      error: "destructive",
    } as const

    const colors = {
      pending: "bg-gray-100 text-gray-800",
      uploading: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const completedFiles = files.filter((f) => f.status === "completed").length
  const totalFiles = files.length

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Multi-File Upload & Processing</h1>
          <p className="text-muted-foreground mt-2">Upload multiple files and process them automatically</p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Drag and drop files here or click to browse. Supports images, PDFs, CSV, JSON, and text files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-muted-foreground">Supports: Images, PDF, CSV, JSON, TXT files</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Files ({files.length})</CardTitle>
                <CardDescription>
                  {completedFiles > 0 && `${completedFiles}/${totalFiles} files processed`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={uploadAndProcessFiles}
                  disabled={isProcessing || files.every((f) => f.status !== "pending")}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Process Files
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {files.map((file, index) => (
                    <div key={file.id}>
                      <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{file.name}</p>
                              {getStatusBadge(file.status)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              disabled={file.status === "uploading" || file.status === "processing"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {(file.status === "uploading" || file.status === "processing") && (
                            <div className="space-y-1">
                              <Progress value={file.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {file.status === "uploading" ? "Uploading..." : "Processing..."}
                              </p>
                            </div>
                          )}

                          {file.status === "completed" && file.fileName && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                              {file.fileName}
                            </div>
                          )}

                          {file.status === "error" && file.error && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              Error: {file.error}
                            </div>
                          )}
                        </div>

                        {file.preview && (
                          <div className="flex-shrink-0">
                            <img
                              src={file.preview || "/placeholder.svg"}
                              alt={file.name}
                              className="h-16 w-16 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                      {index < files.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Processing Summary */}
        {completedFiles > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedFiles}</div>
                  <div className="text-sm text-green-800">Files Processed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {files.filter((f) => f.status === "uploading" || f.status === "processing").length}
                  </div>
                  <div className="text-sm text-blue-800">In Progress</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {files.filter((f) => f.status === "error").length}
                  </div>
                  <div className="text-sm text-red-800">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

