import { cn } from "@/lib/utils"

interface DividerProps extends React.ComponentProps<"hr"> {
  variant?: "default" | "subtle" | "gradient"
}

export function Divider({
  className,
  variant = "default",
  ...props
}: DividerProps) {
  return (
    <hr
      data-slot="divider"
      className={cn(
        "w-full border-0",
        variant === "default" && "h-px bg-[var(--color-border-default)]",
        variant === "subtle" && "h-px bg-[var(--color-border-subtle)]",
        variant === "gradient" &&
          "h-px bg-[var(--gradient-border)]",
        className
      )}
      {...props}
    />
  )
}
