"use client"
import { PieChart as RechartsPC, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { BarChart as RechartsBC, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip } from "recharts"

interface ChartData {
  name: string
  value: number
}

interface PieChartProps {
  data: ChartData[]
}

interface BarChartProps {
  data: ChartData[]
  formatValue?: (value: number) => string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

export function PieChart({ data }: PieChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center">No data available</div>
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPC>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(value))
            }
          />
          <Legend />
        </RechartsPC>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChart({ data, formatValue }: BarChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center">No data available</div>
  }

  const formatter = formatValue || ((value: number) => value.toString())

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBC
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => formatter(value)} />
          <BarTooltip formatter={(value) => formatter(Number(value))} />
          <Bar dataKey="value" fill="#0088FE" />
        </RechartsBC>
      </ResponsiveContainer>
    </div>
  )
}

