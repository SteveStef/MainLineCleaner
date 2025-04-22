"use client"

import { useState, useRef } from "react"
import { ArrowUpDown } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

/**
 * RevenueData interface defines the structure of each revenue data point
 * @property month - The month name (e.g., 'January', 'February')
 * @property revenue - The gross revenue amount for that month
 */
export interface RevenueData {
  month: string
  revenue: number
}

/**
 * RevenueChartProps interface defines the props for the RevenueChart component
 * @property data - Array of revenue data objects
 * @property title - Optional title for the chart
 * @property description - Optional description for the chart
 * @property lineColor - Optional color for the line (defaults to rgb(59, 130, 246))
 * @property fillColor - Optional color for the area fill (defaults to rgba(59, 130, 246, 0.1))
 * @property showDataLabels - Optional flag to show data labels (defaults to false)
 * @property currencySymbol - Optional currency symbol (defaults to $)
 */
export interface RevenueChartProps {
  data: RevenueData[]
  title?: string
  description?: string
  lineColor?: string
  fillColor?: string
  showDataLabels?: boolean
  currencySymbol?: string
}

/**
 * RevenueChart component visualizes monthly gross revenue data using Chart.js
 */
export default function RevenueChart({
  data,
  title = "Monthly Gross Revenue",
  description = "Revenue trends by month",
  lineColor = "rgb(59, 130, 246)",
  fillColor = "rgba(59, 130, 246, 0.1)",
  showDataLabels = false,
  currencySymbol = "$",
}: RevenueChartProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")
  const chartRef = useRef<ChartJS>(null)

  // Process data to handle missing values and apply sorting if needed
  const processedData = [...data]
    .map((item) => ({
      month: item.month,
      revenue: item.revenue || 0, // Handle missing or null values
    }))
    .sort((a, b) => {
      if (sortOrder === "none") return 0
      return sortOrder === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue
    })

  // Calculate total revenue
  const totalRevenue = processedData.reduce((sum, item) => sum + item.revenue, 0)

  // Format currency for display
  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toLocaleString()}`
  }

  // Prepare data for Chart.js
  const chartData = {
    labels: processedData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue",
        data: processedData.map((item) => item.revenue),
        borderColor: lineColor,
        backgroundColor: fillColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: lineColor,
      },
    ],
  }

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        padding: 12,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Revenue: ${formatCurrency(context.parsed.y)}`,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: (value: any) => currencySymbol + value.toLocaleString(),
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  }

  // Add data labels if enabled
  if (showDataLabels) {
    chartOptions.plugins = {
      ...chartOptions.plugins,
      datalabels: {
        display: true,
        color: "#333",
        align: "top",
        formatter: (value: number) => formatCurrency(value),
        font: {
          weight: "bold",
          size: 12,
        },
      },
    }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("none")}>Default Order</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>Lowest to Highest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>Highest to Lowest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        {/* Chart container with aspect ratio */}
        <div className="w-full aspect-[16/9] min-h-[200px] max-h-[400px]">
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  )
}
