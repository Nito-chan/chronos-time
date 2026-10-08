import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Heading, Subtitle, Label } from "@/components/ui/heading"

const features = [
  {
    icon: "◈",
    title: "Timeline Engine",
    description:
      "Navigate through thousands of years of history with millisecond precision. Every era, every event, every moment at your fingertips.",
  },
  {
    icon: "◇",
    title: "Quantum Simulation",
    description:
      "Simulate alternate timelines and observe how different decisions reshape the course of history across multiple probability branches.",
  },
  {
    icon: "○",
    title: "Civilization Analytics",
    description:
      "Track the rise and fall of empires through real-time metrics. Population, technology, culture, and power visualized across time.",
  },
  {
    icon: "□",
    title: "Temporal API",
    description:
      "Integrate Chronos into your own applications. Access the complete timeline through our powerful, well-documented API.",
  },
  {
    icon: "△",
    title: "Neural Interface",
    description:
      "Connect directly to the timeline through an adaptive neural interface that learns how you explore and navigate through time.",
  },
  {
    icon: "☆",
    title: "Collaborative History",
    description:
      "Explore timelines with your team. Leave markers, annotations, and discoveries for others to find across the ages.",
  },
]

export function FeaturesSection() {
  return (
    <Section id="features" size="lg" className="bg-[var(--color-surface)]/50">
      <Container size="default">
        <div className="flex flex-col items-center text-center mb-20">
          <Label>Capabilities</Label>
          <Heading as="h2" variant="heading" className="mt-4">
            Everything You Need
          </Heading>
          <Subtitle className="mt-4 max-w-2xl">
            Chronos provides a complete toolkit for observing, simulating,
            and navigating the timeline of civilization.
          </Subtitle>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[var(--color-border-subtle)] md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-background p-8 transition-colors hover:bg-[var(--color-surface)] md:p-10"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-blue-subtle)] text-lg text-blue-400">
                {feature.icon}
              </span>
              <h3 className="mt-6 font-heading text-lg font-medium">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
