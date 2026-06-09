"use client"

import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  Info,
  Trash2,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// ── Utilidad: card de demo ────────────────────────────────────────────────────

function DemoSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
        {label}
      </span>
      <div className="flex flex-wrap items-start gap-8">{children}</div>
    </div>
  )
}

function TriggerCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 items-start shrink-0">
      <span className="text-xs text-muted-foreground">Trigger</span>
      {children}
    </div>
  )
}

function PreviewCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="text-xs text-muted-foreground">Vista previa</span>
      {children}
    </div>
  )
}

// ── Tarjeta estática (simula el dialog abierto sin overlay) ──────────────────
// Usa helpers planos en lugar de primitivas Radix para evitar el error
// "DialogTitle must be used within Dialog" en las vistas estáticas.

function StaticDialog({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[400px] rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10 p-6 grid gap-6 shadow-lg">
      {children}
    </div>
  )
}

function StaticHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

function StaticTitle({ children }: { children: React.ReactNode }) {
  return <p className="font-heading leading-none font-medium">{children}</p>
}

function StaticDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

function StaticFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 1 · Confirmación simple
// ─────────────────────────────────────────────────────────────────────────────

function DialogConfirmacion() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar acción?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. ¿Estás seguro de que deseas
            continuar con los cambios?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Confirmar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StaticConfirmacion() {
  return (
    <StaticDialog>
      <StaticHeader>
        <StaticTitle>¿Confirmar acción?</StaticTitle>
        <StaticDesc>
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas
          continuar con los cambios?
        </StaticDesc>
      </StaticHeader>
      <StaticFooter>
        <Button variant="outline">Cancelar</Button>
        <Button>Confirmar</Button>
      </StaticFooter>
    </StaticDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2 · Con icono informativo
// ─────────────────────────────────────────────────────────────────────────────

function DialogIconoInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-full bg-info/10 mb-1">
            <Info className="size-5 text-info" />
          </div>
          <DialogTitle>Información del sistema</DialogTitle>
          <DialogDescription>
            Esta funcionalidad estará disponible a partir del próximo ciclo de
            actualización. No se requiere ninguna acción por tu parte.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Entendido</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StaticIconoInfo() {
  return (
    <StaticDialog>
      <StaticHeader>
        <div className="flex size-12 items-center justify-center rounded-full bg-info/10 mb-1">
          <Info className="size-5 text-info" />
        </div>
        <StaticTitle>Información del sistema</StaticTitle>
        <StaticDesc>
          Esta funcionalidad estará disponible a partir del próximo ciclo de
          actualización. No se requiere ninguna acción por tu parte.
        </StaticDesc>
      </StaticHeader>
      <StaticFooter>
        <Button>Entendido</Button>
      </StaticFooter>
    </StaticDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3 · Advertencia
// ─────────────────────────────────────────────────────────────────────────────

function DialogAdvertencia() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-full bg-warning/10 mb-1">
            <AlertTriangle className="size-5 text-warning" />
          </div>
          <DialogTitle>Advertencia</DialogTitle>
          <DialogDescription>
            Estás a punto de realizar un cambio que afectará múltiples registros
            vinculados. Revisa los detalles antes de continuar.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Continuar de todas formas</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StaticAdvertencia() {
  return (
    <StaticDialog>
      <StaticHeader>
        <div className="flex size-12 items-center justify-center rounded-full bg-warning/10 mb-1">
          <AlertTriangle className="size-5 text-warning" />
        </div>
        <StaticTitle>Advertencia</StaticTitle>
        <StaticDesc>
          Estás a punto de realizar un cambio que afectará múltiples registros
          vinculados. Revisa los detalles antes de continuar.
        </StaticDesc>
      </StaticHeader>
      <StaticFooter>
        <Button variant="outline">Cancelar</Button>
        <Button>Continuar de todas formas</Button>
      </StaticFooter>
    </StaticDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4 · Acción destructiva
// ─────────────────────────────────────────────────────────────────────────────

function DialogDestructivo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 mb-1">
            <Trash2 className="size-5 text-destructive" />
          </div>
          <DialogTitle>Eliminar activo</DialogTitle>
          <DialogDescription>
            Esta acción es permanente e irreversible. Se eliminará el activo
            junto con todo su historial, documentos y registros vinculados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StaticDestructivo() {
  return (
    <StaticDialog>
      <StaticHeader>
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 mb-1">
          <Trash2 className="size-5 text-destructive" />
        </div>
        <StaticTitle>Eliminar activo</StaticTitle>
        <StaticDesc>
          Esta acción es permanente e irreversible. Se eliminará el activo
          junto con todo su historial, documentos y registros vinculados.
        </StaticDesc>
      </StaticHeader>
      <StaticFooter>
        <Button variant="outline">Cancelar</Button>
        <Button variant="destructive">
          <Trash2 className="size-4" />
          Eliminar
        </Button>
      </StaticFooter>
    </StaticDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5 · Éxito / Notificación
// ─────────────────────────────────────────────────────────────────────────────

function DialogExito() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-full bg-success/10 mb-1">
            <CheckCircle2 className="size-5 text-success" />
          </div>
          <DialogTitle>¡Cambios guardados!</DialogTitle>
          <DialogDescription>
            Los datos han sido actualizados correctamente y sincronizados con
            el servidor. Puedes continuar trabajando.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full sm:w-auto">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StaticExito() {
  return (
    <StaticDialog>
      <StaticHeader>
        <div className="flex size-12 items-center justify-center rounded-full bg-success/10 mb-1">
          <CheckCircle2 className="size-5 text-success" />
        </div>
        <StaticTitle>¡Cambios guardados!</StaticTitle>
        <StaticDesc>
          Los datos han sido actualizados correctamente y sincronizados con
          el servidor. Puedes continuar trabajando.
        </StaticDesc>
      </StaticHeader>
      <StaticFooter>
        <Button className="w-full sm:w-auto">Cerrar</Button>
      </StaticFooter>
    </StaticDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6 · Formulario
// ─────────────────────────────────────────────────────────────────────────────

function DialogFormulario() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo festivo</DialogTitle>
          <DialogDescription>
            Completa los campos para añadir un día festivo al calendario
            laboral.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="festivo-nombre">Nombre</Label>
            <Input
              id="festivo-nombre"
              placeholder="Ej. Día de la Constitución"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="festivo-tipo">Tipo</Label>
              <Select>
                <SelectTrigger id="festivo-tipo" className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nacional">Nacional</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="festivo-recurrencia">Recurrencia</Label>
              <Select>
                <SelectTrigger id="festivo-recurrencia" className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anual">Anual</SelectItem>
                  <SelectItem value="unico">Único año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="festivo-desc">Descripción (opcional)</Label>
            <Textarea
              id="festivo-desc"
              placeholder="Describe el motivo del festivo…"
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled>
            <CalendarPlus className="size-4" />
            Añadir festivo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StaticFormulario() {
  return (
    <StaticDialog>
      <StaticHeader>
        <StaticTitle>Nuevo festivo</StaticTitle>
        <StaticDesc>
          Completa los campos para añadir un día festivo al calendario laboral.
        </StaticDesc>
      </StaticHeader>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre</Label>
          <Input placeholder="Ej. Día de la Constitución" readOnly />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Tipo</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nacional">Nacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Recurrencia</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Descripción (opcional)</Label>
          <Textarea placeholder="Describe el motivo del festivo…" className="resize-none" rows={2} readOnly />
        </div>
      </div>

      <Separator />

      <StaticFooter>
        <Button variant="outline">Cancelar</Button>
        <Button disabled>
          <CalendarPlus className="size-4" />
          Añadir festivo
        </Button>
      </StaticFooter>
    </StaticDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7 · Formulario con icono
// ─────────────────────────────────────────────────────────────────────────────

function DialogFormularioIcono() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 mb-1">
            <UserPlus className="size-5 text-primary" />
          </div>
          <DialogTitle>Invitar usuario</DialogTitle>
          <DialogDescription>
            Añade un nuevo miembro al equipo. Recibirá un correo con las
            instrucciones para acceder.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">Correo electrónico</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="nombre@empresa.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-rol">Rol</Label>
            <Select>
              <SelectTrigger id="invite-rol" className="w-full">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="viewer">Solo lectura</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-msg">Mensaje personalizado (opcional)</Label>
            <Textarea
              id="invite-msg"
              placeholder="Añade un mensaje de bienvenida…"
              className="resize-none"
              rows={2}
            />
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled>
            <UserPlus className="size-4" />
            Enviar invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StaticFormularioIcono() {
  return (
    <StaticDialog>
      <StaticHeader>
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 mb-1">
          <UserPlus className="size-5 text-primary" />
        </div>
        <StaticTitle>Invitar usuario</StaticTitle>
        <StaticDesc>
          Añade un nuevo miembro al equipo. Recibirá un correo con las
          instrucciones para acceder.
        </StaticDesc>
      </StaticHeader>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Correo electrónico</Label>
          <Input type="email" placeholder="nombre@empresa.com" readOnly />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Rol</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Mensaje personalizado (opcional)</Label>
          <Textarea placeholder="Añade un mensaje de bienvenida…" className="resize-none" rows={2} readOnly />
        </div>
      </div>

      <Separator />

      <StaticFooter>
        <Button variant="outline">Cancelar</Button>
        <Button disabled>
          <UserPlus className="size-4" />
          Enviar invitación
        </Button>
      </StaticFooter>
    </StaticDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Showcase principal
// ─────────────────────────────────────────────────────────────────────────────

export function DialogVariants() {
  return (
    <div className="flex-1 flex flex-col gap-10 items-center justify-start p-8 overflow-auto">

      {/* 1 · Confirmación simple */}
      <DemoSection label="Confirmación simple">
        <TriggerCol><DialogConfirmacion /></TriggerCol>
        <PreviewCol><StaticConfirmacion /></PreviewCol>
      </DemoSection>

      <Separator className="max-w-3xl w-full" />

      {/* 2 · Con icono informativo */}
      <DemoSection label="Con icono — info">
        <TriggerCol><DialogIconoInfo /></TriggerCol>
        <PreviewCol><StaticIconoInfo /></PreviewCol>
      </DemoSection>

      <Separator className="max-w-3xl w-full" />

      {/* 3 · Advertencia */}
      <DemoSection label="Con icono — warning">
        <TriggerCol><DialogAdvertencia /></TriggerCol>
        <PreviewCol><StaticAdvertencia /></PreviewCol>
      </DemoSection>

      <Separator className="max-w-3xl w-full" />

      {/* 4 · Acción destructiva */}
      <DemoSection label="Con icono — destructive">
        <TriggerCol><DialogDestructivo /></TriggerCol>
        <PreviewCol><StaticDestructivo /></PreviewCol>
      </DemoSection>

      <Separator className="max-w-3xl w-full" />

      {/* 5 · Éxito */}
      <DemoSection label="Con icono — success">
        <TriggerCol><DialogExito /></TriggerCol>
        <PreviewCol><StaticExito /></PreviewCol>
      </DemoSection>

      <Separator className="max-w-3xl w-full" />

      {/* 6 · Formulario */}
      <DemoSection label="Formulario">
        <TriggerCol><DialogFormulario /></TriggerCol>
        <PreviewCol><StaticFormulario /></PreviewCol>
      </DemoSection>

      <Separator className="max-w-3xl w-full" />

      {/* 7 · Formulario con icono */}
      <DemoSection label="Formulario con icono">
        <TriggerCol><DialogFormularioIcono /></TriggerCol>
        <PreviewCol><StaticFormularioIcono /></PreviewCol>
      </DemoSection>

    </div>
  )
}
