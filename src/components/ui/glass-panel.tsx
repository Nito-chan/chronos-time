import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.ComponentProps<"div"> {
  variant?: "default" | "elevated" | "bordered"
}

export function GlassPanel({
  className,
  variant = "default",
  ...props
}: GlassPanelProps) {
  return (
    <div
      data-slot="glass-panel"
      className={cn(
        "rounded-xl backdrop-blur-xl",
        variant === "default" && "bg-white/[0.03] border border-white/[0.06]",
        variant === "elevated" &&
          "bg-white/[0.05] border border-white/[0.08] shadow-lg",
        variant === "bordered" &&
          "bg-transparent border border-white/[0.08]",
        className
      )}
      {...props}
    />
  )
}
