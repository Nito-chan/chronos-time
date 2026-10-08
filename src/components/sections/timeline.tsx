import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Heading, Subtitle, Label } from "@/components/ui/heading"
import { GlassPanel } from "@/components/ui/glass-panel"

const timelineEras = [
  {
    era: "PREHISTORY",
    period: "13.8 BYA — 3000 BCE",
    color: "bg-blue-500/20",
    textColor: "text-blue-400",
    events: [
      "Big Bang",
      "Formation of galaxies",
      " emergence of life",
      "Evolution of humans",
    ],
  },
  {
    era: "ANCIENT",
    period: "3000 BCE — 500 CE",
    color: "bg-purple-500/20",
    textColor: "text-purple-400",
    events: [
      "First civilizations",
      "Development of writing",
      "Classical empires",
      "Foundational philosophies",
    ],
  },
  {
    era: "MEDIEVAL",
    period: "500 CE — 1500 CE",
    color: "bg-amber-500/20",
    textColor: "text-amber-400",
    events: [
      "Feudal systems",
      "Islamic Golden Age",
      "Mongol Empire",
      "Renaissance begins",
    ],
  },
  {
    era: "MODERN",
    period: "1500 CE — Present",
    color: "bg-emerald-500/20",
    textColor: "text-emerald-400",
    events: [
      "Industrial Revolution",
      "World Wars",
      "Digital Age",
      "AI emergence",
    ],
  },
]

export function TimelineSection() {
  return (
    <Section id="timeline" size="lg" className="bg-[var(--color-surface)]/50">
      <Container size="default">
        <div className="flex flex-col items-center text-center mb-20">
          <Label>Eras</Label>
          <Heading as="h2" variant="heading" className="mt-4">
            The Complete Timeline
          </Heading>
          <Subtitle className="mt-4 max-w-2xl">
            From the birth of the universe to the age of synthetic
            consciousness. Every era documented with precision.
          </Subtitle>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {timelineEras.map((era) => (
            <GlassPanel key={era.era} variant="elevated" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-2 w-2 rounded-full ${era.color}`} />
                <span className={`text-xs font-semibold tracking-widest ${era.textColor}`}>
                  {era.era}
                </span>
              </div>

              <span className="text-xs text-muted-foreground">
                {era.period}
              </span>

              <ul className="mt-4 space-y-2">
                {era.events.map((event) => (
                  <li
                    key={event}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                    {event}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ))}
        </div>
      </Container>
    </Section>
  )
}
