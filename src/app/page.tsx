import { Hero } from "@/components/hero/hero"
import { Genesis } from "@/components/scenes/genesis/genesis"
import { Discovery } from "@/components/scenes/discovery/discovery"
import { Civilization } from "@/components/scenes/civilization/civilization"

export default function ChronosPage() {
  return (
    <main className="flex-1">
      <Hero />
      <Genesis />
      <Discovery />
      <Civilization />
    </main>
  )
}
