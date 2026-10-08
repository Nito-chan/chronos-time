import { cn } from "@/lib/utils"

interface ContainerProps extends React.ComponentProps<"div"> {
  size?: "narrow" | "default" | "wide" | "full"
}

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-6 md:px-8 lg:px-12",
        size === "narrow" && "max-w-[var(--content-narrow)]",
        size === "default" && "max-w-[var(--content-default)]",
        size === "wide" && "max-w-[var(--content-wide)]",
        size === "full" && "max-w-none",
        className
      )}
      {...props}
    />
  )
}
