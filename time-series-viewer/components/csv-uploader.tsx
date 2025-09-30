"use client"

import type React from "react"

import { useCallback } from "react"
import { Upload } from "lucide-react"
import { Card } from "@/components/ui/card"
import { parseCSV } from "@/lib/csv"
import { useTimeSeriesStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function CSVUploader() {
  const setRows = useTimeSeriesStore((state) => state.setRows)
  const { toast } = useToast()

  const handleFile = useCallback(
    async (file: File) => {
      try {
        const rows = await parseCSV(file)
        setRows(rows)
        toast({
          title: "CSV Loaded",
          description: `Successfully loaded ${rows.length} rows`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        })
      }
    },
    [setRows, toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type === "text/csv") {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  return (
    <Card
      className="border-2 border-dashed p-6 hover:border-primary/50 transition-colors cursor-pointer bg-[rgba(176,205,217,1)]"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <label className="flex flex-col items-center gap-2 cursor-pointer">
        <Upload className="w-8 h-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground text-center">Drop CSV file here or click to browse</span>
        <input type="file" accept=".csv" onChange={handleChange} className="sr-only" />
      </label>
    </Card>
  )
}
