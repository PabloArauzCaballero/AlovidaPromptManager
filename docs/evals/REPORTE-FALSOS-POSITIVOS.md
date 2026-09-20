# Reporte — Falsos positivos del catálogo

- Fecha: 2026-09-19 · Catálogo: 176 skills · Escenarios negativos: 30
- Pregunta que responde: **¿alguna skill se dispara cuando NO corresponde?**

El eval principal (`REPORTE-EVAL.md`) mide que, cuando un pedido sí corresponde a una skill, se
elige la correcta — 99.1%. Esa medición **no castiga** a una description hambrienta que se activa
de más. Este reporte cubre esa laguna, que el propio `REPORTE-EVAL.md` declaraba en "No cubierto".

## Resultado

```
casos que activaron >=1 skill:  8/30 = 26.7%  (bruto)
de esos, defectos reales:       2/30 =  6.7%  (neto)

por familia (disparos / total):
  a  conversacional        2/5
  b  conocimiento general  0/5
  c  edición trivial       3/5
  d  fuera de dominio      1/5
  e  ambiguo               1/5
  f  otro stack            1/5
```

El 26.7% bruto **sobreestima el problema**: de los 8 disparos, 4 son defendibles, 1 correspondía
al set positivo y solo 2 son defectos. Reportar el bruto como "tasa de falsos positivos" sería
exactamente el tipo de cifra alarmista sin análisis que la regla 40 prohíbe.

## Los 2 defectos reales — corregidos

| Skill | Disparó con | Causa | Corrección aplicada |
|---|---|---|---|
| `ux-writing-microcopy` | "Cambiá el texto del botón de 'Guardar' a 'Guardar cambios'" | Trigger con cuantificador universal: *"cualquier texto de UI"*. Captura hasta el caso donde el texto **ya viene decidido** | Ahora dispara al **DECIDIR** qué dice, y aclara que no hace falta para aplicar un texto ya decidido |
| `refactoring-safely` | "Renombrá el archivo notas.txt a notas-reunion.txt" | Verbo sin objeto: *"al extraer o renombrar"*. Renombrar un archivo de texto no es refactorizar | Ahora: *"al extraer o renombrar **un símbolo, función o módulo en código**"* |

**El patrón es la conclusión reutilizable:** una description captura de más por dos vías —
**cuantificador universal** (`cualquier`, `todo`) o **verbo sin objeto**. Ambas se arreglan
agregando el objeto o condicionando a la decisión en vez de a la existencia del artefacto.

## Los 4 defendibles — no se tocaron

`work-report-md` en "¿en qué quedamos ayer?" (su trigger incluye "al retomar trabajo ajeno") ·
`finish-your-turn` en "cerramos por hoy" (si hay trabajo abierto, la regla 40 sí aplica) ·
`windows-dev-environment` en "instalar Python en máquina nueva" (trigger literal: "al configurar
la máquina de un dev nuevo") · `ci-cd-pipeline` en "pipeline en Jenkins" (la skill se declara
agnóstica de plataforma).

Forzar estas descriptions para bajar el número sería sobreajustar al set de prueba.

## Un escenario mal elegido

`bug-reporting-standard` disparó con *"No anda."* — **no es falso positivo**: su trigger dice
textual *"al convertir un 'no anda' en algo que otra persona pueda reproducir"*. El escenario
pertenece al set positivo y fue un error de construcción del set, no del catálogo.

## Lo que salió bien y conviene preservar

Dos colisiones **léxicas** que no dispararon:

- *"armá la agenda de la reunión del lunes"* → `appointment-scheduling` **no** se activó, porque
  acota con "al **modelar o tocar** horarios, disponibilidad, reserva de turnos".
- *"mail al proveedor por el estado de la factura"* → `quotations-billing` **no** se activó, porque
  nombra la **entidad** del dominio, no la palabra suelta.

La familia de conocimiento general dio **0/5**: ninguna pregunta conceptual activó nada, aun
cuando varias skills mencionan esos conceptos. La causa es la convención de la casa
**"Usar AL \<verbo de acción\>"**: condicionar el disparo a una acción sobre el código es lo que
protege al catálogo de activarse por coincidencia de vocabulario.

## No cubierto

- **Un solo juez, un solo pase.** Sin acuerdo inter-juez.
- **30 casos es muestra chica.** Con 2 defectos, el intervalo de confianza es ancho: no se puede
  afirmar "el catálogo tiene 6.7% de falsos positivos" como si fuera una medición estable.
- **Separación más débil que en el eval positivo.** Acá el mismo agente escribió y juzgó los
  escenarios (aunque redactó antes de leer el catálogo); en el eval positivo, generador y juez
  eran agentes distintos.
- **No se midió el costo** del falso positivo: cuánto contexto quema un disparo de más.

## Reproducir

Artefactos: `escenarios-negativos.jsonl` (set con familia) · `jueces-neg/` (entrada ciega) ·
`veredictos-neg/` (salida del juez con justificación por caso).
