import { defineComponent } from "../types"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export const carouselEntry = defineComponent<{
  itemsPerView: string
  itemCount: string
  loop: boolean
  showArrows: boolean
  border: boolean
}>({
  id: "carousel",
  name: "Carousel",
  description: {
    en: "A carousel with motion and swipe built using Embla.",
    es: "Un carrusel con movimiento y deslizamiento construido con Embla.",
  },
  category: "Components",
  filePath: "components/ui/carousel.tsx",
  previewWidth: 400,
  controls: {
    itemsPerView: { type: "select",  options: ["1", "2", "3"], defaultValue: "1" },
    itemCount:    { type: "select",  options: ["3", "4", "5"], defaultValue: "5" },
    loop:         { type: "boolean", defaultValue: false },
    showArrows:   { type: "boolean", defaultValue: true },
    border:       { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { itemsPerView, itemCount, loop, showArrows, border } = props
    const count = Number(itemCount)
    const multi = itemsPerView !== "1"

    const optsObj: Record<string, unknown> = {}
    if (loop) optsObj.loop = true
    if (multi) optsObj.align = "start"
    const opts = Object.keys(optsObj).length > 0 ? optsObj : undefined

    const itemClass = itemsPerView === "2" ? "basis-1/2" : itemsPerView === "3" ? "basis-1/3" : undefined
    const numSize = multi ? "text-3xl" : "text-4xl"

    return (
      <div className="flex justify-center px-12">
        <Carousel
          key={`${loop}-${multi}-${border}`}
          {...(opts ? { opts } : {})}
          className={border ? "w-full border rounded-lg p-2" : "w-full"}
        >
          <CarouselContent>
            {Array.from({ length: count }, (_, i) => (
              <CarouselItem key={i} className={itemClass}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex h-[160px] items-center justify-center p-6">
                      <span className={cn(numSize, "font-semibold")}>{i + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {showArrows && <CarouselPrevious />}
          {showArrows && <CarouselNext />}
        </Carousel>
      </div>
    )
  },
  generateCode: (props) => {
    const { itemsPerView, itemCount, loop, showArrows, border } = props
    const count = Number(itemCount)
    const multi = itemsPerView !== "1"

    const optsLines: string[] = []
    if (loop) optsLines.push(`    loop: true,`)
    if (multi) optsLines.push(`    align: "start",`)

    const optsStr = optsLines.length > 0
      ? ` opts={{\n${optsLines.join("\n")}\n  }}`
      : ""
    const maxW = multi ? "max-w-sm" : "max-w-xs"
    const borderClass = border ? ` border rounded-lg p-2` : ""

    const itemClassAttr = itemsPerView === "2"
      ? ` className="md:basis-1/2"`
      : itemsPerView === "3"
        ? ` className="md:basis-1/2 lg:basis-1/3"`
        : ""

    const numSize = multi ? "3xl" : "4xl"

    const arrowLines = showArrows
      ? `\n      <CarouselPrevious />\n      <CarouselNext />`
      : ""

    const imports = [
      "Carousel", "CarouselContent", "CarouselItem",
      ...(showArrows ? ["CarouselPrevious", "CarouselNext"] : []),
    ].join(", ")

    return `import { ${imports} } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function Example() {
  return (
    <Carousel${optsStr} className="w-full ${maxW}${borderClass}">
      <CarouselContent>
        {Array.from({ length: ${count} }).map((_, index) => (
          <CarouselItem key={index}${itemClassAttr}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-${numSize} font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>${arrowLines}
    </Carousel>
  )
}`
  },
})
