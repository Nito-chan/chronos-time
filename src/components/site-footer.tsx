import { Container } from "@/components/ui/container"
import { Divider } from "@/components/ui/divider"

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Dashboard", "Timeline", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Guides", "Status", "Support"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies", "Licenses"],
  },
]

export function SiteFooter() {
  return (
    <footer
      data-slot="site-footer"
      className="border-t border-[var(--color-border-subtle)]"
    >
      <Container size="wide" className="py-16 md:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <span className="font-heading text-sm font-medium tracking-widest text-primary">
              CHRONOS
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The operating system for time. Observe, simulate, and navigate through the timeline of civilization.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider variant="subtle" className="my-12" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Chronos. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">
              Twitter
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              LinkedIn
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Discord
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
