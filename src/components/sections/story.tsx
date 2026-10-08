import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Heading, Subtitle, Label } from "@/components/ui/heading"

const eras = [
  {
    year: "13.8 BYA",
    title: "The Beginning",
    description:
      "The universe springs into existence from a single point of infinite density. Time itself begins its journey.",
  },
  {
    year: "3000 BCE",
    title: "Ancient Civilization",
    description:
      "Humanity's first great leap. Writing, architecture, and astronomy emerge from the dawn of culture.",
  },
  {
    year: "1760",
    title: "Industrial Revolution",
    description:
      "Steam and steel redefine civilization. The rhythm of industry reshapes the human experience forever.",
  },
  {
    year: "1990",
    title: "Information Age",
    description:
      "Knowledge becomes infinite. The world connects through invisible networks of light and data.",
  },
  {
    year: "2042",
    title: "Synthetic Consciousness",
    description:
      "Intelligence transcends biology. A global neural network awakens across the planet.",
  },
]

export function StorySection() {
  return (
    <Section id="story" size="lg">
      <Container size="default">
        <div className="flex flex-col items-center text-center mb-20">
          <Label>The Timeline</Label>
          <Heading as="h2" variant="heading" className="mt-4">
            A Journey Through Time
          </Heading>
          <Subtitle className="mt-4 max-w-2xl">
            Every era is a chapter in the story of civilization. Chronos
            lets you observe them all from a single vantage point.
          </Subtitle>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-transparent md:left-1/2 md:-translate-x-px" />

          <div className="space-y-16 md:space-y-24">
            {eras.map((era, index) => (
              <div
                key={era.title}
                className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-12"
              >
                <div
                  className={`flex flex-col ${
                    index % 2 === 0
                      ? "md:text-right md:items-end"
                      : "md:col-start-2"
                  }`}
                >
                  <span className="font-mono text-xs font-medium tracking-widest text-blue-400">
                    {era.year}
                  </span>
                  <h3 className="mt-2 font-heading text-xl font-medium md:text-2xl">
                    {era.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {era.description}
                  </p>
                </div>

                <div
                  className={`absolute left-3 top-1 flex h-3 w-3 items-center justify-center md:left-1/2 md:-translate-x-1/2 ${
                    index % 2 === 0 ? "md:top-1" : "md:top-1"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full border-2 ${
                      index === eras.length - 1
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-blue-500 bg-blue-500/20"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
