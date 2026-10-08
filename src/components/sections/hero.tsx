import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Heading, Subtitle, Label } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <Section size="xl" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-blue-subtle)] to-transparent pointer-events-none" />

      <Container size="default" className="relative">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
          <Label>Introducing Chronos</Label>

          <Heading as="h1" variant="display">
            The Operating System
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              For Time
            </span>
          </Heading>

          <Subtitle className="max-w-2xl">
            Observe civilizations rise and fall. Simulate alternative
            histories. Navigate the complete timeline of human existence
            from a single, unified interface.
          </Subtitle>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="h-11 px-6 text-sm">
              Enter the Timeline
            </Button>
            <Button variant="outline" size="lg" className="h-11 px-6 text-sm">
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Real-time data</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Quantum simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Temporal API</span>
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border-default)] to-transparent" />
    </Section>
  )
}
