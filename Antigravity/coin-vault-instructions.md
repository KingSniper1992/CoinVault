# Coin Vault — Instructions

## 1. Objetivo

Estas instrucciones definen cómo desarrollar nuevas pantallas y
funcionalidades manteniendo la identidad de Coin Vault.

Toda implementación debe respetar `coin-vault-guidelines.md`.

## 2. Antes de desarrollar

Para cada nueva pantalla comprobar:

- ¿Mantiene el navbar?
- ¿Mantiene el fondo?
- ¿Mantiene la paleta?
- ¿Mantiene el estilo pixel art?
- ¿Es minimalista?
- ¿Es responsive?
- ¿Es accesible?
- ¿Reutiliza componentes existentes?

No crear un nuevo estilo visual para cada módulo.

## 3. Arquitectura visual

Mantener:

``` text
Navbar
   ↓
Contenido
   ↓
Footer
```

El navbar y footer deben ser componentes reutilizables.

## 4. Componentización

Crear componentes reutilizables para:

``` text
Navbar
Footer
Card
Button
Input
Select
Table
Modal
Alert
EmptyState
PixelIcon
FormContainer
```

No duplicar estructuras equivalentes entre Ingresos y Egresos.

## 5. Navegación

Rutas conceptuales:

``` text
/login
/dashboard
/ingresos
/ingresos/tipos
/ingresos/nuevo
/egresos
/egresos/tipos
/egresos/nuevo
/reportes
/configuracion
```

Los nombres pueden adaptarse al framework, pero deben conservar
consistencia.

## 6. Dashboard

Debe conservar cuatro cards principales:

``` text
Mi llave de NU
Dinero total de inversión
Recordatorios o apuntes
Acceso a imágenes
```

Después:

``` text
Quincena 1
Quincena 2
Quincena 3
Quincena 4
```

Cada tabla:

``` text
#
Concepto
Monto
Total
```

## 7. Crear tipo de ingreso

Formulario mínimo:

``` text
Nuevo tipo de ingreso
Nombre del ingreso
Descripción
Color
Estado

Cancelar
Guardar ingreso
```

Nombre obligatorio.

Descripción opcional.

Estado inicial:

``` text
Activo
Inactivo
```

## 8. Crear tipo de egreso

Reutilizar el formulario de ingreso.

Cambiar solamente:

- título
- textos
- iconografía
- color semántico
- endpoint

Ejemplo:

``` text
Nuevo tipo de egreso
Nombre del egreso
Descripción
Color
Estado

Cancelar
Guardar egreso
```

## 9. Validación

Validar en frontend para feedback inmediato y nuevamente en backend para
seguridad.

Flujo:

``` text
Usuario
 ↓
Frontend
 ↓
Validación
 ↓
API
 ↓
Backend
 ↓
Validación
 ↓
Base de datos
```

Nunca confiar únicamente en el frontend.

## 10. Estados de interfaz

Toda operación debe contemplar:

``` text
Loading
Success
Error
Empty
Disabled
```

Ejemplo:

``` text
Guardando...
Ingreso creado correctamente.
```

Los errores técnicos no deben mostrarse directamente al usuario.

## 11. API

Mantener contratos claros.

Ejemplo:

``` http
GET    /api/ingresos/tipos
POST   /api/ingresos/tipos
PUT    /api/ingresos/tipos/{id}
DELETE /api/ingresos/tipos/{id}
```

Para egresos:

``` http
GET    /api/egresos/tipos
POST   /api/egresos/tipos
PUT    /api/egresos/tipos/{id}
DELETE /api/egresos/tipos/{id}
```

## 12. Seguridad

Nunca exponer:

- contraseñas
- tokens
- llaves completas
- secretos
- stack traces
- SQL
- credenciales

La llave de NU debe mostrarse parcialmente, por ejemplo:

``` text
**** **** ****
```

Los recursos financieros deben estar asociados al usuario autenticado.

Nunca confiar en un ID enviado por el cliente para decidir qué datos
puede consultar.

## 13. Assets

Organizar:

``` text
assets/
├── logo/
├── icons/
├── decorations/
└── background/
```

Los assets pixel art deben conservar transparencia cuando corresponda.

Para pixel art escalado:

``` css
image-rendering: pixelated;
```

Evitar filtros que suavicen los píxeles.

## 14. CSS

Centralizar colores:

``` css
:root {
  --cv-bg: #F4F8FC;
  --cv-bg-secondary: #EAF1F8;
  --cv-navbar: #111820;
  --cv-gold: #FFC928;
  --cv-gold-dark: #D99A00;
  --cv-text: #172033;
  --cv-text-muted: #68758A;
  --cv-income: #35C759;
  --cv-expense: #F05252;
}
```

Evitar repetir valores de color arbitrariamente.

## 15. Moneda

Para Colombia utilizar:

``` text
$ 1.310.000
```

La lógica de formato monetario debe estar centralizada.

No construir formatos monetarios manualmente dentro de cada componente.

## 16. Formularios

Reglas:

1.  Labels siempre visibles.
2.  Campos obligatorios claramente identificados.
3.  Errores cerca del campo.
4.  No perder datos escritos cuando falla una petición.
5.  Evitar doble envío.
6.  Deshabilitar el botón mientras se procesa cuando sea necesario.
7.  Mostrar confirmación después de guardar.

## 17. Tablas

Los montos se alinean a la derecha.

Ejemplo:

``` text
┌────┬────────────────┬────────────┐
│ #  │ Concepto       │ Monto      │
├────┼────────────────┼────────────┤
│ 1  │ Casa           │ 100.000    │
│ 2  │ Cadena         │ 150.000    │
│ 3  │ Movistar       │ 50.000     │
├────┴────────────────┼────────────┤
│ Total              │ 300.000    │
└─────────────────────┴────────────┘
```

## 18. Responsabilidad de capas

No colocar reglas de negocio dentro de componentes visuales.

Preferir:

``` text
UI
 ↓
Controller / Handler
 ↓
Service
 ↓
Repository
 ↓
Database
```

La UI presenta y captura información; el backend aplica las reglas de
negocio.

## 19. Manejo de errores

Respuesta conceptual:

``` json
{
  "success": false,
  "message": "No fue posible guardar el ingreso.",
  "code": "INCOME_CREATE_ERROR"
}
```

Los detalles técnicos deben permanecer en logs.

## 20. Responsive

Desktop:

``` text
4 columnas
```

Tablet:

``` text
2 columnas
```

Móvil:

``` text
1 columna
```

No comprimir tablas hasta hacerlas ilegibles.

## 21. Animaciones

Usar animaciones pequeñas y funcionales:

- moneda cayendo
- cofre abriéndose
- botón presionado
- transición de cards
- loading

Evitar movimiento constante, parpadeos y efectos que interfieran con la
lectura.

## 22. Nuevas funcionalidades

Proceso obligatorio:

``` text
1. Definir objetivo
2. Definir datos
3. Diseñar UX
4. Reutilizar componentes
5. Validar frontend
6. Implementar API/backend
7. Validar backend
8. Probar estados
9. Probar responsive
10. Revisar identidad visual
```

## 23. Checklist

### Visual

- [ ] Navbar correcto.
- [ ] Fondo Coin Vault.
- [ ] Logo correcto.
- [ ] Paleta consistente.
- [ ] Pixel art consistente.
- [ ] Footer correcto.
- [ ] Espaciado consistente.

### UX

- [ ] Loading.
- [ ] Success.
- [ ] Error.
- [ ] Empty.
- [ ] Disabled.
- [ ] Validaciones.
- [ ] Feedback de acciones.

### Técnico

- [ ] Componentes reutilizables.
- [ ] Sin lógica de negocio en UI.
- [ ] API integrada.
- [ ] Backend validado.
- [ ] Datos sensibles protegidos.
- [ ] Responsive.
- [ ] Accesibilidad.

## 24. Principio final

> Primero funcionalidad. Después UX. Después estética. Finalmente
> optimización.

La aplicación debe crecer sin perder coherencia visual, seguridad ni
mantenibilidad.
