import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { theme, spacing, buildCssVariables } from "@/theme/tokens"
import { TemplateGallery } from "@/templates/TemplateGallery"

const themeStyles = buildCssVariables(
  theme.light as Record<string, string>,
  theme.dark as Record<string, string>,
)

const spacingVars = `:root{${Object.entries(spacing).map(([k, v]) => `--${k}:${v}`).join(";")}}`

export default function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <style dangerouslySetInnerHTML={{ __html: spacingVars }} />
      <ThemeProvider>
        <TooltipProvider delayDuration={400}>
          <TemplateGallery />
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}
