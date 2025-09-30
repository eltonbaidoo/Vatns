"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText } from "lucide-react"
import type { DataPoint } from "@/app/page"

interface CSVUploaderProps {
  onDataUpload: (data: DataPoint[], columns: string[], fileName: string) => void
}

export function CSVUploader({ onDataUpload }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (csvText: string): { data: DataPoint[]; columns: string[] } => {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())

    const data: DataPoint[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      const row: DataPoint = {}

      headers.forEach((header, index) => {
        const value = values[index]?.trim()
        if (value !== undefined) {
          // Try to parse as number, otherwise keep as string
          const numValue = Number.parseFloat(value)
          row[header] = isNaN(numValue) ? value : numValue
        }
      })

      data.push(row)
    }

    return { data, columns: headers }
  }

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    setIsProcessing(true)

    try {
      const text = await file.text()
      const { data, columns } = parseCSV(text)

      if (data.length === 0) {
        alert("No data found in CSV file")
        return
      }

      onDataUpload(data, columns, file.name)
    } catch (error) {
      console.error("Error parsing CSV:", error)
      alert("Error parsing CSV file. Please check the format.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileText className="h-6 w-6" />
          Upload CSV Data
        </CardTitle>
        <CardDescription>Upload a CSV file to visualize your time-series data</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`relative p-8 text-center rounded-lg transition-colors ${
            isDragging ? "bg-blue-50 border-blue-300" : "bg-gray-50 hover:bg-gray-100"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />

          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">Drop your CSV file here</p>
            <p className="text-sm text-gray-500">or click to browse files</p>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="mt-4 bg-[#B0CDD9] hover:bg-[#9BB8C6] text-gray-800"
          >
            {isProcessing ? "Processing..." : "Choose File"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Expected format: CSV with headers including time column and numeric data columns</p>
          <p>Example columns: time (s), roll_deg, pitch_deg, yaw_deg, depth, etc.</p>
        </div>
      </CardContent>
    </Card>
  )
}
