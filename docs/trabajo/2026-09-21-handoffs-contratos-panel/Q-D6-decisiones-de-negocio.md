# Q-D6 — dos decisiones que no son de implementación

Registradas el 2026-09-21 durante H2 y H4. **Ninguna se resolvió por conveniencia.**

---

## Q-D6.a — ¿«OTROS SERVICIOS» debe ser un motivo propio del catálogo?

**Dueño: negocio.** Hoy queda implementado como `OTHER` + el texto «Otros servicios», que es lo
que el contrato real acepta **tal cual** y sin ampliar nada.

### Qué implicaría ampliarlo de verdad

No es «agregar una palabra al enum». Son cuatro cosas, en este orden:

1. **Terminología.** `exception_type_concept_id` es **FK a `terminology.catalog_concepts`**: el
   motivo nuevo necesita su concepto sembrado, con código, rótulo y versión del sistema de
   codificación. Sin eso, la FK no resuelve.
2. **Contrato.** `ExceptionType` y `EXCEPTION_TYPES` en `scheduling-catalog.dto.ts:725-742`, más
   el `@IsIn` que valida el cuerpo. Es un cambio de contrato público: rompe a todo cliente que
   tenga la lista de siete hardcodeada.
3. **Despliegue.** La semilla de terminología tiene que correr **antes** que el código que la
   usa, o las excepciones existentes quedan apuntando a un concepto inexistente.
4. **Migración.** Qué pasa con los `OTHER` ya creados cuyo `reason` dice «Otros servicios»:
   ¿se reclasifican, se dejan, o conviven dos formas de decir lo mismo?

### Por qué se registra en vez de hacerse

Nada de esto es decisión de quien implementa la maqueta. Mientras tanto, `OTHER` + texto cumple
lo que el doctor pidió —que el rato aparezca bloqueado con ese motivo— **sin que el doble mienta
sobre el contrato real**.

---

## Q-D6.b — ¿de dónde sale la posología por defecto de cada medicamento?

**Dueño: negocio.** Bloqueado hasta que exista una fuente autoritativa con **nombre, referencia
y fecha**.

**Lo que hay hoy:** tres medicamentos con una frecuencia **sintética de desarrollo**
(`paracetamol`, `amoxicilina`, `losartan`), declarada en el propio archivo con su procedencia
`MANTRA_DEV_VADEMECUM` y la advertencia de que **no es apta para uso clínico**. Sin citar ninguna
fuente externa.

**Lo que queda bloqueado hasta que llegue esa fuente:**

- Presentar la frecuencia como catálogo oficial en cualquier pantalla.
- Cualquier salida de la maqueta con estos valores.
- Extender la propiedad a más medicamentos — en particular a los de margen terapéutico estrecho:
  `warfarina` se dejó **a propósito** sin frecuencia.

**El precedente es de la casa y es exactamente este problema.** B-13 (`REGISTRO-DEFECTOS.md` de
la API, cerrado el 02/09): 17 medicamentos con contraindicaciones, efectos adversos e
interacciones escritos a mano **citando RxNorm, SNOMED CT y WHO ATC como si fueran su fuente**.
Se resolvió retractando las 68 filas clínicas, dejando una sola fuente declarada como dato de
desarrollo y poniendo un gate de producción. Repetirlo con la posología costaría lo mismo o más:
una frecuencia equivocada en una receta no es un dato feo, es un daño.

**La posología real no la decide el equipo** (regla 97.5.4).
