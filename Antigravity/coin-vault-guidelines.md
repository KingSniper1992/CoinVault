# Coin Vault — Guidelines

## 1. Propósito

Coin Vault es una aplicación web de gestión financiera personal. Su
identidad combina una estructura moderna y minimalista con una estética
de videojuego retro pixel art.

Principios:

- Minimalismo.
- Claridad financiera.
- Pixel art como lenguaje visual, no como decoración excesiva.
- Jerarquía visual clara.
- Consistencia entre todas las pantallas.
- Responsive desde desktop hasta móvil.

> La información financiera siempre tiene prioridad sobre la decoración.

## 2. Identidad visual

Concepto:

**COIN VAULT = Finanzas + Pixel Art + Progreso.**

La aplicación debe sentirse como una herramienta financiera profesional
dentro de un pequeño universo de videojuego retro.

El estilo debe conservar:

- cofres
- monedas
- piedras
- nubes
- montañas pixeladas
- iconos pixel art
- bordes definidos
- sombras escalonadas

Evitar mezclarlo con:

- fotografías
- 3D realista
- glassmorphism dominante
- neón excesivo
- efectos fotográficos
- gradientes modernos agresivos

## 3. Logo

El logo oficial contiene el cofre, la moneda y:

`COIN VAULT`

`SAVE • TRACK • GROW`

Debe utilizarse principalmente en:

- Navbar.
- Login.
- Footer.
- Estados vacíos o pantallas especiales.

No deformar, recolorear arbitrariamente ni alterar sus proporciones.

## 4. Layout general

Todas las páginas deben partir de tres zonas:

``` text
┌────────────────────────────────────────────┐
│ NAVBAR                                     │
├────────────────────────────────────────────┤
│                                            │
│                CONTENIDO                   │
│                                            │
├────────────────────────────────────────────┤
│ FOOTER                                     │
└────────────────────────────────────────────┘
```

## 5. Navbar

El navbar es oscuro y contrasta con el fondo claro.

Estructura:

``` text
[LOGO] [Dashboard] [Ingresos] [Egresos] ... [Usuario ▼] [Cerrar sesión]
```

Reglas:

- Logo a la izquierda.
- Navegación después del logo.
- Usuario al extremo derecho.
- Cerrar sesión al extremo derecho.
- La ruta actual debe tener estado activo.
- Dorado para el estado activo.
- Iconos pixel art coherentes.

## 6. Fondo

El contenido utiliza un fondo claro inspirado en un paisaje pixel art:

- cielo azul/blanco muy claro
- nubes pixeladas
- montañas escalonadas
- diferentes capas de gris y azul
- espacio visual limpio en el centro

El fondo debe ser sutil. Nunca debe competir con formularios, tablas o
datos.

Las monedas y piedras pueden aparecer principalmente en esquinas y zonas
vacías.

## 7. Paleta

Valores de referencia:

| Uso              | Color     |
|------------------|-----------|
| Fondo            | `#F4F8FC` |
| Fondo secundario | `#EAF1F8` |
| Navbar           | `#111820` |
| Texto            | `#172033` |
| Texto secundario | `#68758A` |
| Dorado           | `#FFC928` |
| Dorado oscuro    | `#D99A00` |
| Ingreso          | `#35C759` |
| Egreso           | `#F05252` |
| Azul             | `#3B82F6` |
| Morado           | `#9B51E0` |
| Gris             | `#7B8799` |

El dorado es el color de identidad y debe reservarse para acciones
principales, bordes destacados y estados activos.

## 8. Cards

Las cards deben ser simples:

- fondo claro
- borde dorado
- sombra muy sutil
- icono pixel art
- título claro
- dato principal destacado

Ejemplos del dashboard:

1.  Mi llave de NU.
2.  Dinero total de inversión.
3.  Recordatorios o apuntes.
4.  Acceso a imágenes.

## 9. Tablas de quincenas

El dashboard utiliza cuatro bloques:

- Quincena 1: 1–15 de enero.
- Quincena 2: 16–31 de enero.
- Quincena 3: 1–15 de febrero.
- Quincena 4: 16–28 de febrero.

Estructura:

``` text
# | Concepto | Monto
```

El total aparece al final.

Los montos deben alinearse a la derecha.

## 10. Formularios

Los formularios de ingresos y egresos comparten estructura:

``` text
Título
Descripción breve

Nombre
Descripción
Color
Estado

[Cancelar] [Guardar]
```

El botón principal es dorado.

Labels siempre visibles; el placeholder solo sirve como ayuda.

## 11. Ingresos y egresos

Ingresos:

- verde
- flecha hacia arriba
- monedas
- crecimiento

Egresos:

- rojo
- flecha hacia abajo
- gastos
- salida de dinero

El color tiene función semántica y no debe saturar la pantalla.

## 12. Tipografía

Los títulos pueden utilizar una fuente pixel/display.

Los datos financieros y textos largos deben priorizar legibilidad.

Jerarquía:

``` text
H1 → título de pantalla
H2 → sección
H3 → componente
Body → información
Caption → información secundaria
```

## 13. Footer

Debe mantener:

``` text
COIN VAULT

Design by Doom Forge Studios
```

Puede incorporar decoración pixel art de monedas y piedras.

## 14. Responsive

Desktop:

- 4 cards por fila cuando exista espacio.
- 4 quincenas por fila cuando exista espacio.

Tablet:

- 2 columnas.

Móvil:

- 1 columna.
- Navbar compacto.
- Tablas con scroll horizontal o transformación a cards cuando sea
  apropiado.

## 15. Accesibilidad

La estética nunca debe sacrificar accesibilidad.

Implementar:

- contraste adecuado
- navegación por teclado
- focus visible
- labels reales
- mensajes de error claros
- áreas táctiles adecuadas
- información no dependiente únicamente del color

## 16. Regla de oro

> Coin Vault debe sentirse como un videojuego retro, pero funcionar como
> una aplicación financiera profesional.
