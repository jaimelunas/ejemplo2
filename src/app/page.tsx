"use client"
import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings, Copy, Info, Save, Edit, ChevronDown, ChevronUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Usuario = {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  pagado: boolean;
  referenciaNequi: string;
  numeros: string[];
}

export default function AplicacionRifaMejorada() {
  const [numerosDisponibles, setNumerosDisponibles] = useState(
    Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'))
  )
  const [numerosSeleccionados, setNumerosSeleccionados] = useState<string[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioActual, setUsuarioActual] = useState<Omit<Usuario, 'id' | 'numeros'>>({
    nombre: '',
    telefono: '',
    email: '',
    pagado: false,
    referenciaNequi: ''
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarTablaUsuarios, setMostrarTablaUsuarios] = useState(false)
  const tablaRef = useRef<HTMLTableElement>(null)
  const [informacionRifa, setInformacionRifa] = useState(`Grand Prize: $500,000
Precio: $10,000
Fecha: October 15, 2024
Loteria: Bogota
Otros premios: They will be informed in a timely manner`)
  const [informacionTemporal, setInformacionTemporal] = useState(informacionRifa)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [tituloRifa, setTituloRifa] = useState("El Pato Ganador")
  const [tituloTemporal, setTituloTemporal] = useState(tituloRifa)
  const [dialogoTituloAbierto, setDialogoTituloAbierto] = useState(false)
  const [terminos, setTerminos] = useState("Términos y condiciones de la rifa...")
  const [terminosTemporal, setTerminosTemporal] = useState(terminos)
  const [dialogoTerminosAbierto, setDialogoTerminosAbierto] = useState(false)
  const [terminosExpandidos, setTerminosExpandidos] = useState(false)

  const seleccionarNumero = (numero: string) => {
    if (numerosSeleccionados.length < 2 && !numerosSeleccionados.includes(numero)) {
      const nuevosNumerosSeleccionados = [...numerosSeleccionados, numero]
      setNumerosSeleccionados(nuevosNumerosSeleccionados)
      setNumerosDisponibles(numerosDisponibles.filter(n => n !== numero))
      if (nuevosNumerosSeleccionados.length === 2) {
        setMostrarFormulario(true)
      }
    }
  }

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    if (numerosSeleccionados.length === 2) {
      setUsuarios([...usuarios, { ...usuarioActual, id: Date.now(), numeros: numerosSeleccionados }])
      setUsuarioActual({ nombre: '', telefono: '', email: '', pagado: false, referenciaNequi: '' })
      setNumerosSeleccionados([])
      setMostrarFormulario(false)
      setMostrarTablaUsuarios(false)
    }
  }

  const cancelarFormulario = () => {
    setNumerosDisponibles([...numerosDisponibles, ...numerosSeleccionados].sort())
    setNumerosSeleccionados([])
    setMostrarFormulario(false)
    setUsuarioActual({ nombre: '', telefono: '', email: '', pagado: false, referenciaNequi: '' })
  }

  const eliminarUsuario = (userId: number) => {
    const usuarioAEliminar = usuarios.find(usuario => usuario.id === userId)
    if (usuarioAEliminar) {
      setNumerosDisponibles([...numerosDisponibles, ...usuarioAEliminar.numeros].sort())
      setUsuarios(usuarios.filter(usuario => usuario.id !== userId))
    }
  }

  const esNumeroNoDisponible = (numero: string) => {
    return !numerosDisponibles.includes(numero) || numerosSeleccionados.includes(numero)
  }

  const seleccionarTabla = () => {
    if (tablaRef.current) {
      const range = document.createRange()
      range.selectNodeContents(tablaRef.current)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  const guardarInformacion = () => {
    setInformacionRifa(informacionTemporal)
    setDialogoAbierto(false)
  }

  const guardarTitulo = () => {
    setTituloRifa(tituloTemporal)
    setDialogoTituloAbierto(false)
  }

  const guardarTerminos = () => {
    setTerminos(terminosTemporal)
    setDialogoTerminosAbierto(false)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{tituloRifa}</h1>
        <Button onClick={() => setMostrarTablaUsuarios(!mostrarTablaUsuarios)}>
          <Settings className="w-4 h-4 mr-2" />
          Configuración
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <pre className="whitespace-pre-wrap">{informacionRifa}</pre>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-10 gap-2 mb-4">
        {Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0')).map(numero => (
          <Button
            key={numero}
            onClick={() => seleccionarNumero(numero)}
            variant="outline"
            className={`w-full ${
              esNumeroNoDisponible(numero)
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            disabled={esNumeroNoDisponible(numero) && !numerosSeleccionados.includes(numero)}
          >
            {numero}
          </Button>
        ))}
      </div>

      {numerosSeleccionados.length === 1 && (
        <p className="text-red-500 font-bold mb-4">Seleccione el segundo número de su boleta</p>
      )}

      {mostrarFormulario && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={manejarEnvio} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={usuarioActual.nombre}
                  onChange={e => setUsuarioActual({ ...usuarioActual, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={usuarioActual.telefono}
                  onChange={e => setUsuarioActual({ ...usuarioActual, telefono: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={usuarioActual.email}
                  onChange={e => setUsuarioActual({ ...usuarioActual, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Estado de Pago</Label>
                <RadioGroup
                  value={usuarioActual.pagado ? "si" : "no"}
                  onValueChange={value => setUsuarioActual({ ...usuarioActual, pagado: value === "si" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="pagado-si" />
                    <Label htmlFor="pagado-si">Pagado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="pagado-no" />
                    <Label htmlFor="pagado-no">No Pagado</Label>
                  </div>
                </RadioGroup>
              </div>
              {usuarioActual.pagado && (
                <div>
                  <Label htmlFor="referenciaNequi">Referencia Nequi</Label>
                  <Input
                    id="referenciaNequi"
                    value={usuarioActual.referenciaNequi}
                    onChange={e => setUsuarioActual({ ...usuarioActual, referenciaNequi: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={cancelarFormulario}>
                  Cancelar
                </Button>
                <Button type="submit">Enviar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {mostrarTablaUsuarios && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Usuarios Registrados</CardTitle>
            <div className="space-x-2">
              <Button onClick={seleccionarTabla}>
                <Copy className="w-4 h-4 mr-2" />
                Seleccionar Tabla
              </Button>
              <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                <DialogTrigger asChild>
                  <Button onClick={() => setInformacionTemporal(informacionRifa)}>
                    <Info className="w-4 h-4 mr-2" />
                    Información
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Información de la Rifa</DialogTitle>
                    <DialogDescription>
                      <Textarea
                        value={informacionTemporal}
                        onChange={(e) => setInformacionTemporal(e.target.value)}
                        className="min-h-[200px] mb-4"
                      />
                      <div className="flex justify-end">
                        <Button onClick={guardarInformacion}>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog open={dialogoTituloAbierto} onOpenChange={setDialogoTituloAbierto}>
                <DialogTrigger asChild>
                  <Button onClick={() => setTituloTemporal(tituloRifa)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Título
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Título de la Rifa</DialogTitle>
                    <DialogDescription>
                      <Input
                        value={tituloTemporal}
                        onChange={(e) => setTituloTemporal(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex justify-end">
                        <Button onClick={guardarTitulo}>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog open={dialogoTerminosAbierto} onOpenChange={setDialogoTerminosAbierto}>
                <DialogTrigger asChild>
                  <Button onClick={() => setTerminosTemporal(terminos)}>
                    Términos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Términos y Condiciones</DialogTitle>
                    <DialogDescription>
                      <Textarea
                        value={terminosTemporal}
                        onChange={(e) => setTerminosTemporal(e.target.value)}
                        className="min-h-[200px] mb-4"
                      />
                      <div className="flex justify-end">
                        <Button onClick={guardarTerminos}>
                          Salvar
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table ref={tablaRef}>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Números</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Referencia Nequi</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map(usuario => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.telefono}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.numeros.join(', ')}</TableCell>
                    <TableCell>{usuario.pagado ? 'Sí' : 'No'}</TableCell>
                    <TableCell>{usuario.referenciaNequi || '-'}</TableCell>
                    <TableCell>
                      <Button onClick={() => eliminarUsuario(usuario.id)} variant="destructive">
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <hr className="border-t border-gray-300 mb-2" />
        <Collapsible
          open={terminosExpandidos}
          onOpenChange={setTerminosExpandidos}
          className="w-full"
        >
          <CollapsibleTrigger className="flex items-center justify-center w-full">
            <p className="text-center text-xs font-bold">Terminos</p>
            {terminosExpandidos ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Card>
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap text-sm">{terminos}</pre>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        <hr className="border-t border-gray-300 mt-2" />
      </div>
    </div>
  )
}