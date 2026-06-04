"use client"

import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "default" | "sm" | "lg"
}

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        size === "sm" && "h-4 w-6 border-[2px]",
        size === "default" && "h-6 w-9 border-[4px]",
        size === "lg" && "h-7 w-12 border-[4px]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-sm ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          size === "sm" && "size-3 data-[state=checked]:translate-x-2",
          size === "default" && "size-4 data-[state=checked]:translate-x-3",
          size === "lg" && "size-5 data-[state=checked]:translate-x-5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
