import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SiteHeaderProps extends React.ComponentProps<"header"> {
  variant?: "default" | "transparent"
}

export function SiteHeader({
  className,
  variant = "default",
  ...props
}: SiteHeaderProps) {
  return (
    <header
      data-slot="site-header"
      className={cn(
        "fixed top-0 right-0 left-0 z-50 h-16",
        variant === "default" && "border-b border-[var(--color-border-subtle)] bg-background/80 backdrop-blur-xl",
        variant === "transparent" && "bg-transparent",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-full max-w-[var(--grid-max-width)] items-center justify-between px-6 md:px-8 lg:px-12">
        <div className="flex items-center gap-8">
          <span className="font-heading text-sm font-medium tracking-widest text-primary">
            CHRONOS
          </span>
          <nav className="hidden items-center gap-6 md:flex">
            {["Story", "Features", "Dashboard", "Timeline"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="default" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
