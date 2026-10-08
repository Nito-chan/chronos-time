import { cn } from "@/lib/utils"

interface SectionProps extends React.ComponentProps<"section"> {
  size?: "sm" | "md" | "lg" | "xl"
  bleed?: boolean
}

export function Section({
  className,
  size = "md",
  bleed = false,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(
        "relative w-full",
        size === "sm" && "py-[var(--section-py-sm)]",
        size === "md" && "py-[var(--section-py-md)]",
        size === "lg" && "py-[var(--section-py-lg)]",
        size === "xl" && "py-[var(--section-py-xl)]",
        bleed && "overflow-hidden",
        className
      )}
      {...props}
    />
  )
}
