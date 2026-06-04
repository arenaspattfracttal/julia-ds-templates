# Julia DS Templates

Templates de pantallas Fracttal construidos con el Design System Julia.

**Stack:** React 19 · Tailwind CSS v4 · shadcn/ui · Vite · TypeScript

## Inicio rápido

```bash
npm install
npm run dev
```

## Estructura

```
templates/          # Un archivo por template
  TemplateGallery   # Galería de navegación (índice)
components/         # Componentes Julia DS (ui/ + theme-provider)
theme/              # Design tokens de color y espaciado
app/                # globals.css (Tailwind + shadcn)
lib/                # utils (cn)
hooks/              # Hooks compartidos
```

## Añadir un template

1. Crea `templates/NombreTemplate.tsx`
2. Regístralo en `templates/TemplateGallery.tsx`
