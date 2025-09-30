"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Upload, LineChart, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { parseCSV } from "@/lib/csv"
import { useTimeSeriesStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function UploadPage() {
  const router = useRouter()
  const { rows, setRows } = useTimeSeriesStore()
  const { toast } = useToast()

  const handleFile = async (file: File) => {
    try {
      const parsedRows = await parseCSV(file)
      setRows(parsedRows)
      toast({
        title: "CSV Loaded Successfully",
        description: `Loaded ${parsedRows.length} rows of time-series data`,
      })
      router.push("/viewer")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse CSV file. Please check the format.",
        variant: "destructive",
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === "text/csv") {
      handleFile(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleUseDemoData = () => {
    router.push("/viewer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LineChart className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-balance">Time-Series Viewer</h1>
          </div>
          <p className="text-lg text-muted-foreground text-balance">
            Upload your CSV data to visualize time-series channels with interactive overlays and zoom controls
          </p>
        </div>

        {/* Upload Card */}
        <Card
          className="border-2 border-dashed p-12 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
            </div>
            <input type="file" accept=".csv" onChange={handleChange} className="sr-only" />
          </label>
        </Card>

        {/* Demo Data Option */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button onClick={handleUseDemoData} variant="outline" size="lg" className="w-full gap-2 bg-transparent">
          <Zap className="w-4 h-4" />
          Continue with Demo Data
        </Button>
      </div>
      <Toaster />
    </div>
  )
}
