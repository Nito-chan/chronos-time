import { cn } from "@/lib/utils"

interface MetricProps extends React.ComponentProps<"div"> {
  value: string
  label: string
  trend?: "up" | "down" | "neutral"
}

export function Metric({
  className,
  value,
  label,
  trend,
  ...props
}: MetricProps) {
  return (
    <div
      data-slot="metric"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <span className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
      {trend && (
        <span
          className={cn(
            "text-xs font-medium",
            trend === "up" && "text-[var(--color-accent-emerald)]",
            trend === "down" && "text-destructive",
            trend === "neutral" && "text-muted-foreground"
          )}
        >
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "neutral" && "→"}
        </span>
      )}
    </div>
  )
}
