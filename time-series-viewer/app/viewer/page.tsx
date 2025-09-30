"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CSVUploader } from "@/components/csv-uploader"
import { ChannelList } from "@/components/channel-list"
import { PlotGrid } from "@/components/plot-grid"
import { GlobalStats } from "@/components/global-stats"
import { RangeStats } from "@/components/range-stats"
import { Toaster } from "@/components/ui/toaster"
import { useTimeSeriesStore } from "@/lib/store"

export default function ViewerPage() {
  const router = useRouter()
  const rows = useTimeSeriesStore((state) => state.rows)

  useEffect(() => {
    if (rows.length === 0) {
      router.push("/")
    }
  }, [rows.length, router])

  const handleBackToUpload = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Time-Series Viewer</h1>
            <p className="text-muted-foreground">
              Visualize time-series channels with interactive overlays and zoom controls
            </p>
          </div>
          <Button onClick={handleBackToUpload} variant="outline" size="sm" className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-4">
            <CSVUploader />
            <ChannelList />
          </aside>

          {/* Main Content */}
          <main>
            <PlotGrid />
          </main>

          {/* Right Sidebar - Stats */}
          <aside className="space-y-4">
            <GlobalStats />
            <RangeStats />
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
