"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Save,
  ClipboardCheck,
  Clock,
  RotateCcw,
  AlertTriangle,
  Bell,
  Info,
  PlayCircle,
  ClipboardList,
  ExternalLink,
  ChevronsUp,
  ClipboardClock,
  LayoutGrid,
  ListChecks,
  Wrench,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { translations } from "../i18n"
import { useViewer } from "../viewer-context"

// ─── Auxiliares de layout ─────────────────────────────────────────────────────

/** Fila etiqueta → valor en las tarjetas de info */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 px-2 py-1.5 rounded-sm odd:bg-muted/60 even:bg-background">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-none">
        {label}
      </span>
      <span className="text-sm text-foreground leading-snug">
        {value}
      </span>
    </div>
  )
}

/** Tarjeta de sección con borde, ícono y título */
function SectionCard({
  icon,
  title,
  children,
  headerRight,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  headerRight?: React.ReactNode
}) {
  return (
    <div className="border border-border rounded-lg bg-background flex flex-col gap-2 p-4 w-full shrink-0">
      {/* Encabezado */}
      <div className="flex items-center justify-between h-6">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-foreground leading-normal">
            {title}
          </span>
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  )
}

/** Botón de enlace — acción secundaria dentro de una sección */
function LinkPill({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`w-full gap-1.5 ${className ?? ""}`}
    >
      {children}
    </Button>
  )
}

// ─── Drawer Tarea ─────────────────────────────────────────────────────────────

export function DrawerTarea() {
  const t = translations[useViewer().lang]
  const [activeTab, setActiveTab]           = useState("general")
  const [failedAsset, setFailedAsset]       = useState(true)
  const [outOfService, setOutOfService]     = useState(false)
  const [findingFound, setFindingFound]     = useState(true)

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground">

      {/* ── Toolbar + Tabs ──────────────────────────────────── */}
      <div className="shrink-0 flex flex-col gap-3 p-3 bg-background border-b border-border">

        {/* Título */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center min-w-0 gap-1">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft />
            </Button>
            <span className="text-sm font-semibold text-foreground truncate leading-normal">
              Mantenimiento del rodamiento, general, junto al arranque, bujías metálicas
            </span>
          </div>
          <Button size="icon-sm" disabled>
            <Save />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="general"><LayoutGrid className="size-3.5" />{t.drawer.tabGeneral}</TabsTrigger>
            <TabsTrigger value="subtareas"><ListChecks className="size-3.5" />{t.drawer.tabSubtasks}</TabsTrigger>
            <TabsTrigger value="recursos" badge={3}><Wrench className="size-3.5" />{t.drawer.tabResources}</TabsTrigger>
            <TabsTrigger value="adjuntos" badge={3}><Paperclip className="size-3.5" />{t.drawer.tabAttachments}</TabsTrigger>
          </TabsList>
        </Tabs>

      </div>

      {/* ── Contenido scrollable ────────────────────────────── */}
      <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
        <div className="flex flex-col gap-3 p-3">

          {/* Solicitud de trabajo */}
          <SectionCard
            icon={<ClipboardList className="size-4 text-foreground" />}
            title={t.drawer.secWorkRequest}
          >
            <div className="flex flex-col gap-0">
              <InfoRow
                label={t.drawer.description}
                value="Mantenimiento del rodamiento, general, junto al arranque, bujías metálicas, y el motor 29034045, se encuentra en el seguro"
              />
              <InfoRow label={t.drawer.group}          value="Lorem ipsum" />
              <InfoRow label={t.drawer.classification1} value="Clasificación de muestra" />
              <InfoRow label={t.drawer.classification2} value="Clasificación de muestra" />
            </div>
            <LinkPill>
              {t.drawer.requestNo} 459535226
              <ExternalLink className="size-3.5 shrink-0" />
            </LinkPill>
          </SectionCard>

          {/* Tarea */}
          <SectionCard
            icon={<ClipboardCheck className="size-4 text-foreground" />}
            title={t.drawer.secTask}
          >
            <div className="flex flex-col gap-0">
              <InfoRow
                label={t.drawer.description}
                value="Mantenimiento del rodamiento, general, junto al arranque, bujías metálicas, y el motor 29034045, se encuentra en el seguro"
              />
              <InfoRow label={t.drawer.taskType}      value="Mantenimiento" />
              <InfoRow label={t.drawer.scheduledDate} value="2026-05-05" />
              <InfoRow
                label={t.drawer.priority}
                value={
                  <span className="flex items-center gap-1 text-destructive font-medium">
                    <ChevronsUp className="size-3.5 shrink-0" />
                    {t.drawer.veryHigh}
                  </span>
                }
              />
              <InfoRow label={t.drawer.classification1} value="Clasificación de muestra" />
              <InfoRow label={t.drawer.classification2} value="Clasificación de muestra" />
            </div>
            <LinkPill>
              2 {t.drawer.validations}
              <ExternalLink className="size-3.5 shrink-0" />
            </LinkPill>
          </SectionCard>

          {/* Tiempo */}
          <SectionCard
            icon={<Clock className="size-4 text-foreground" />}
            title={t.drawer.secTime}
          >
            <div className="flex flex-col gap-0">
              <InfoRow label={t.drawer.estimatedDuration} value="00:10:00" />
              <InfoRow label={t.drawer.startDate}          value="2026-05-05" />
              <InfoRow label={t.drawer.endDate}            value="2026-05-06" />
              <InfoRow label={t.drawer.executionTime}      value="00:00:00" />
              <InfoRow label={t.drawer.downtime}           value="00:00:00" />
            </div>
          </SectionCard>

          {/* Activador */}
          <SectionCard
            icon={<RotateCcw className="size-4 text-foreground" />}
            title={t.drawer.secTrigger}
          >
            <div className="flex flex-col gap-0">
              <InfoRow label={t.drawer.scheduledTask} value="Sin programar" />
              <InfoRow label={t.drawer.eventDate}     value="10-12-2023" />
            </div>
          </SectionCard>

          {/* Información de fallas */}
          <SectionCard
            icon={<AlertTriangle className="size-4 text-foreground" />}
            title={t.drawer.secFailureInfo}
          >
            <div className="flex flex-col gap-2">

              {/* Checkbox: Falló el activo */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="failed-asset"
                    checked={failedAsset}
                    onCheckedChange={(v) => setFailedAsset(!!v)}
                  />
                  <Label htmlFor="failed-asset" className="font-normal cursor-pointer">
                    {t.drawer.failedAsset}
                  </Label>
                </div>

                {/* Sub-campos condicionales */}
                {failedAsset && (
                <div className="flex flex-col gap-2">

                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium text-foreground">{t.drawer.failureType}</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t.drawer.selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mecanica">Mecánica</SelectItem>
                        <SelectItem value="electrica">Eléctrica</SelectItem>
                        <SelectItem value="operacional">Operacional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium text-foreground">{t.drawer.failureCauses}</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t.drawer.selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desgaste">Desgaste</SelectItem>
                        <SelectItem value="corrosion">Corrosión</SelectItem>
                        <SelectItem value="fatiga">Fatiga del material</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium text-foreground">{t.drawer.detectionMethod}</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t.drawer.selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Inspección visual</SelectItem>
                        <SelectItem value="sensor">Sensor</SelectItem>
                        <SelectItem value="reporte">Reporte de operador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium text-foreground">{t.drawer.severity}</label>
                    <Select defaultValue="media">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium text-foreground">{t.drawer.damageToOthers}</label>
                    <Select defaultValue="ninguno">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ninguno">Ninguno</SelectItem>
                        <SelectItem value="parcial">Daño parcial</SelectItem>
                        <SelectItem value="total">Daño total</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium text-foreground">{t.drawer.interruptionTime}</label>
                    <Input defaultValue="00:00:00" />
                  </div>

                </div>
                )}
              </div>

              {/* Checkbox: Activo fuera de servicio */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="out-of-service"
                  checked={outOfService}
                  onCheckedChange={(v) => setOutOfService(!!v)}
                />
                <Label htmlFor="out-of-service" className="font-normal cursor-pointer">
                  {t.drawer.outOfService}
                </Label>
              </div>

            </div>
          </SectionCard>

          {/* Hallazgos */}
          <SectionCard
            icon={<Bell className="size-4 text-foreground" />}
            title={t.drawer.secFindings}
            headerRight={<Info className="size-4 text-muted-foreground" />}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="finding"
                  checked={findingFound}
                  onCheckedChange={(v) => setFindingFound(!!v)}
                />
                <Label htmlFor="finding" className="font-normal cursor-pointer">
                  {t.drawer.findingIdentified}
                </Label>
              </div>

              {findingFound && (
                <div className="flex gap-3">
                  <LinkPill className="flex-1 w-auto">
                    {t.drawer.unplannedTask}
                  </LinkPill>
                  <LinkPill className="flex-1 w-auto">
                    {t.drawer.workRequest}
                  </LinkPill>
                </div>
              )}
            </div>
          </SectionCard>

        </div>
      </ScrollArea>

      {/* ── Footer fijo ─────────────────────────────────────── */}
      <div className="shrink-0 bg-background border-t border-border">
        <div className="flex gap-3 p-3">
          <Button size="lg" className="flex-1">
            <PlayCircle className="size-5" />
            {t.drawer.start}
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <ClipboardClock className="size-5" />
            {t.drawer.records}
          </Button>
        </div>
      </div>

    </div>
  )
}
