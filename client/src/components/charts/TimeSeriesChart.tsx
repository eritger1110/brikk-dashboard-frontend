import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  title: string;
  description?: string;
  valueLabel?: string;
  color?: string;
  type?: "line" | "area";
  height?: number;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
  formatTooltip?: (value: number) => string;
}

export default function TimeSeriesChart({
  data,
  title,
  description,
  valueLabel = "Value",
  color = "#0057FF",
  type = "area",
  height = 300,
  showLegend = true,
  formatValue,
  formatTooltip,
}: TimeSeriesChartProps) {

  const formatYAxis = (value: number) => {
    if (formatValue) return formatValue(value);
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const dataPoint = payload[0].payload;
    const value = payload[0].value;

    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground mb-1">
          {new Date(dataPoint.timestamp).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-sm text-muted-foreground">
          {valueLabel}: <span className="font-semibold text-foreground">{formatTooltip ? formatTooltip(value) : formatYAxis(value)}</span>
        </p>
        {dataPoint.label && <p className="text-xs text-muted-foreground mt-1">{dataPoint.label}</p>}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis tickFormatter={formatYAxis} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ paddingTop: "20px" }} />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
              name={valueLabel}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis tickFormatter={formatYAxis} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ paddingTop: "20px" }} />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              name={valueLabel}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
