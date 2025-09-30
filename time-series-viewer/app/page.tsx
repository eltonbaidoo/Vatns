"use client"

import { CSVUploader } from "@/components/csv-uploader"
import { ChannelList } from "@/components/channel-list"
import { PlotGrid } from "@/components/plot-grid"
import { GlobalStats } from "@/components/global-stats"
import { RangeStats } from "@/components/range-stats"
import { Toaster } from "@/components/ui/toaster"

export default function TimeSeriesViewer() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Time-Series Viewer</h1>
          <p className="text-muted-foreground">
            Upload CSV data and visualize time-series channels with interactive overlays
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-4">
            <CSVUploader />
            <ChannelList />
            <GlobalStats />
            <RangeStats />
          </aside>

          {/* Main Content */}
          <main>
            <PlotGrid />
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
