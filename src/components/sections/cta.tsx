import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Heading, Subtitle } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { GlassPanel } from "@/components/ui/glass-panel"

export function CTASection() {
  return (
    <Section size="lg">
      <Container size="narrow">
        <GlassPanel
          variant="elevated"
          className="relative overflow-hidden p-10 text-center md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-blue-subtle)] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <Heading as="h2" variant="heading">
              Ready to Explore
              <br />
              the Timeline?
            </Heading>
            <Subtitle className="mt-4 max-w-lg mx-auto">
              Join the organizations already using Chronos to observe,
              simulate, and navigate the complete history of civilization.
            </Subtitle>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-11 px-8 text-sm">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="h-11 px-8 text-sm">
                Schedule Demo
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              No credit card required. Free tier includes full timeline access.
            </p>
          </div>
        </GlassPanel>
      </Container>
    </Section>
  )
}
