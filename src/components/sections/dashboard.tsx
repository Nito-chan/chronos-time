import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Heading, Subtitle, Label } from "@/components/ui/heading"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Metric } from "@/components/ui/metric"
import { Divider } from "@/components/ui/divider"

const metrics = [
  { value: "13.8B", label: "Years of History" },
  { value: "42", label: "Civilizations Tracked" },
  { value: "1.2M", label: "Timeline Events" },
  { value: "99.97%", label: "Temporal Accuracy" },
]

const timelineEntries = [
  { year: "3000 BCE", event: "First written language emerges", type: "milestone" },
  { year: "1760", event: "Industrial Revolution begins", type: "milestone" },
  { year: "1945", event: "Information Age dawns", type: "milestone" },
  { year: "2024", event: "Chronos platform launched", type: "milestone" },
]

export function DashboardSection() {
  return (
    <Section id="dashboard" size="lg">
      <Container size="default">
        <div className="flex flex-col items-center text-center mb-20">
          <Label>Live Dashboard</Label>
          <Heading as="h2" variant="heading" className="mt-4">
            Civilization at a Glance
          </Heading>
          <Subtitle className="mt-4 max-w-2xl">
            Real-time metrics and monitoring for the complete timeline of
            human civilization.
          </Subtitle>
        </div>

        <GlassPanel variant="elevated" className="w-full overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                  Timeline Overview
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Real-time civilization metrics
                </p>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {metrics.map((metric) => (
                <Metric
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                />
              ))}
            </div>

            <Divider variant="default" className="my-8" />

            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                Recent Timeline Activity
              </span>
              <div className="mt-4 space-y-3">
                {timelineEntries.map((entry) => (
                  <div
                    key={entry.year}
                    className="flex items-center gap-4 rounded-lg bg-[var(--color-surface)] px-4 py-3"
                  >
                    <span className="font-mono text-xs text-blue-400 w-24 shrink-0">
                      {entry.year}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {entry.event}
                    </span>
                    <span className="ml-auto inline-flex items-center rounded-full border border-[var(--color-border-subtle)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {entry.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      </Container>
    </Section>
  )
}
