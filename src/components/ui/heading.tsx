import { cn } from "@/lib/utils"

interface HeadingProps extends React.ComponentProps<"h2"> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div"
  variant?: "display" | "heading" | "subheading" | "title"
}

export function Heading({
  className,
  as: Component = "h2",
  variant = "heading",
  ...props
}: HeadingProps) {
  return (
    <Component
      data-slot="heading"
      className={cn(
        "font-heading font-medium tracking-tight",
        variant === "display" &&
          "text-5xl leading-[1.05] md:text-6xl lg:text-7xl xl:text-8xl",
        variant === "heading" &&
          "text-3xl leading-[1.1] md:text-4xl lg:text-5xl",
        variant === "subheading" &&
          "text-xl leading-snug md:text-2xl lg:text-3xl",
        variant === "title" && "text-lg leading-snug md:text-xl",
        className
      )}
      {...props}
    />
  )
}

export function Subtitle({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="subtitle"
      className={cn(
        "text-base leading-relaxed text-muted-foreground md:text-lg",
        className
      )}
      {...props}
    />
  )
}

export function Label({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="label"
      className={cn(
        "inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
