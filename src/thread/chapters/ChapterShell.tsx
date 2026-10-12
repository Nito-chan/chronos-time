"use client"

import { useEffect, useRef, type ReactNode } from "react"
import type { ChapterDef } from "../story"
import { cn } from "@/lib/utils"

/** Split headline so the emphasized phrase renders italic. */
function Headline({ def }: { def: ChapterDef }) {
  const { headline, headlineEmphasis } = def
  const i = headline.indexOf(headlineEmphasis)
  const parts =
    i >= 0
      ? [headline.slice(0, i), headline.slice(i, i + headlineEmphasis.length), headline.slice(i + headlineEmphasis.length)]
      : [headline, "", ""]
  // reveal line by line: split on sentence boundaries into ≤2 lines
  return (
    <span>
      {parts[0]}
      {parts[1] && <em className="font-normal italic">{parts[1]}</em>}
      {parts[2]}
    </span>
  )
}

interface ShellProps {
  def: ChapterDef
  index: number // 0-based chapter index
  children?: ReactNode // scene-specific DOM (shadow, gears, timestamps…)
  className?: string
}

/**
 * Asymmetric text block (5–6 cols of 12), alternating sides.
 * Headline lines rise with mask; body fades 0.3s after; label types in.
 */
export function ChapterShell({ def, index, children, className }: ShellProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-in", e!.isIntersecting),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const left = def.align === "left"

  return (
    <section
      ref={ref}
      id={`chronos-${def.id}`}
      data-chapter={index}
      aria-label={`${def.numeral} · ${def.label} · ${def.date}`}
      className={cn("relative", className)}
      style={{ minHeight: `${def.vh * 100}vh` }}
    >
      <span aria-hidden="true" className={cn("chapter-numeral", left ? "-right-[6vw] top-[8vh]" : "-left-[6vw] top-[8vh]")}>
        {def.numeral}
      </span>
      <div className="scrim" aria-hidden="true" />

      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="grid w-full grid-cols-12 gap-4 px-6 md:px-10">
          <div
            className={cn(
              "text-plane col-span-12 md:col-span-6",
              left ? "md:col-start-2" : "md:col-start-7"
            )}
          >
            <p className="t-label rv-type" style={{ color: "var(--pg-accent)" }}>
              {def.numeral} · {def.label} · {def.date}
            </p>
            <h2 className="t-display font-display mt-6">
              <span className="rv-mask">
                <span className="rv-line">
                  <Headline def={def} />
                </span>
              </span>
            </h2>
            <p className="t-body rv-fade mt-8" style={{ color: "var(--pg-ink2)" }}>
              {def.body}
            </p>
          </div>
        </div>
      </div>

      {children}
    </section>
  )
}
