# Antes de H4 — «Cómo atendés» y los enlaces sueltos

> Medido en el corte `68dcb562` de la rama, con la rama al día de H3.
> **Qué prueba este documento:** qué muestra hoy la sección que C-01 manda quitar,
> de dónde sale cada uno de sus dos datos, y cuántos de los dos enlaces de C-02
> existen de verdad en este corte.

---

## 1. La sección «Cómo atendés» — H4.S1.M1

Vive en la pestaña «Dónde atiendo» de la ficha del médico,
`features/account/my-profile/practitioner-profile/practitioner-profile-view/practitioner-profile-view.html:416-433`:

```html
<!-- «Cómo atendés» es otra pregunta que «dónde»: va en su propio
     bloque, fuera del de las sedes y en la misma pestaña (pedido del
     19/09/2026). Pegado al mapa se leía como un pie de la lista. -->
<app-card class="mi-perfil__bloque-interno" variant="outlined" padding="md">
  <h3 class="mi-perfil__subtitulo mi-perfil__subtitulo--primero">Cómo atendés</h3>
  <dl class="mi-perfil__datos">
    <div class="mi-perfil__dato">
      <dt>Telemedicina</dt>
      <dd>{{ perfil().telemedicina ? 'Atendés por telemedicina' : 'No la ofrecés' }}</dd>
    </div>
    <div class="mi-perfil__dato">
      <dt>Pacientes nuevos</dt>
      <dd>
        {{ perfil().aceptaPacientesNuevos ? 'Aceptás pacientes nuevos' : 'No los aceptás' }}
      </dd>
    </div>
  </dl>
</app-card>
```

### 1.1 De dónde sale cada dato

| Dato en pantalla | Campo del tipo | Campo del contrato | Quien lo arma |
|---|---|---|---|
| Telemedicina | `telemedicina: boolean` (`practitioner-profile-view.types.ts:173`) | `telehealthAvailable` | `practitioner-profile.ts:211` (ficha propia) y `practitioner-detail.ts:193` (ficha pública) |
| Pacientes nuevos | `aceptaPacientesNuevos: boolean` (`practitioner-profile-view.types.ts:172`) | `acceptsNewPatients` | `practitioner-profile.ts:210` (ficha propia) y `practitioner-detail.ts:192` (ficha pública) |

**Los dos alimentan también la ficha pública.** `practitioner-detail.ts:26` importa
`PractitionerProfileView`: el detalle del Directorio **es la misma vista**. Lo que se
quite de acá se quita también de lo que ve un paciente.

### 1.2 Dónde más se ve cada dato hoy — la medición que decide el destino

**Telemedicina: se ve en dos lugares.** Además de esta sección, la portada de la ficha
lo estampa como chip (`practitioner-profile-view.html:771-773`):

```html
@if (perfil().telemedicina) {
  <app-chip variant="info">Atiende por telemedicina</app-chip>
}
```

Ese chip está **fuera** de las pestañas, en la tarjeta de identidad, y se dibuja tanto
en la ficha propia como en la pública. Quitar «Cómo atendés» no lo pierde: deja de
decirlo dos veces.

**Pacientes nuevos: esta sección es la última que queda.** Las otras tres
representaciones ya se retiraron, y las tres por el mismo motivo, escrito en el código:

| Dónde estaba | Qué dice el código | Ruta |
|---|---|---|
| Chip de la portada de la ficha | «se mostraba en TODA ficha, también en la de quien nunca tocó el ajuste, y el valor por defecto terminaba diciendo “No toma pacientes nuevos” de gente que sí los toma» | `practitioner-profile-view.html:766-769` |
| Sello de la tarjeta del Directorio | «el sello salía en … el valor por defecto anunciaba “No toma pacientes nuevos” de profesionales que sí los [toman]» | `practitioners-directory.ts:615-618` |
| Pregunta del editor y del alta | «“Acepto pacientes nuevos” ya no se pregunta (propietario, 13/09/2026): siempre está habilitado. El alta tampoco lo pregunta» | `practitioner-profile-edit.html:146-148` y `practitioner-profile-edit.ts:315` |

Y el editor no sólo dejó de preguntarlo: **lo fuerza** (`practitioner-profile-edit.ts:1014-1018`):

```ts
// «Acepto pacientes nuevos» siempre está habilitado: un perfil que lo tenía
// apagado se corrige en el primer guardado, sin preguntar.
if (!original.acceptsNewPatients) {
  cambios.acceptsNewPatients = true;
}
```

**Consecuencia medible:** el dato no es gobernable desde ninguna pantalla. O dice
«Aceptás pacientes nuevos» —lo único que el editor deja quedar— o, en un perfil que
nunca se guardó, dice «No los aceptás», que es exactamente la frase falsa por la que
se lo sacó de los otros tres lugares.

---

## 2. Los enlaces sueltos — H4.S2.M1 (antes)

Comando del DoD, literal:

```console
$ git grep -n "my-practice\|medical-organization" -- src/app/features/account/my-profile
src/app/features/account/my-profile/my-profile.html:41:          routerLink="/administration/my-practice"
src/app/features/account/my-profile/my-profile.spec.ts:1118:    expect(destinos.map((a) => a.getAttribute('href'))).toEqual(['/administration/my-practice']);
src/app/features/account/my-profile/pestanas-del-perfil-medico.ts:88: * se crea en `/administration/my-practice`, y duplicar acá el formulario daría
src/app/features/account/my-profile/work-history/work-history.ts:166:   * - `'consultorios'` — «Mis organizaciones» (`administration/my-practice`)
```

De los cuatro aciertos, **uno solo es un enlace**: `my-profile.html:41`. Los otros tres
son una aserción de su spec y dos comentarios.

**El segundo enlace de C-02 no existe en este corte.** Búsqueda en todo `src/app`:
ningún `routerLink` ni `href` del perfil apunta a `administration/medical-organization`.
Esa ruta existe (`app.routes.ts:133`) y vive en el menú (`navigation.map.ts:933`), pero
no como botón suelto del perfil. **No se inventa que se lo quitó.**

### 2.1 Qué es exactamente el enlace que sí existe

```html
<a
  app-button variant="secondary" size="sm" [iconOnly]="true"
  data-testid="mi-perfil-mis-organizaciones"
  routerLink="/administration/my-practice"
  aria-label="Mis organizaciones"
  appTooltip="Mis organizaciones"
>
  <app-nav-icon name="hospital" />
</a>
```

Dos cosas que hay que saber antes de borrarlo:

1. **Es el único acceso a esa pantalla.** El comentario de arriba
   (`my-profile.html:22-26`) lo dice: salió del menú del médico en §4.H del plan de UX
   del 22/08/2026, y este botón quedó como única puerta. «Borrarlo o esconderlo
   convierte una limpieza visual en una pérdida de acceso» — el argumento es del
   archivo, y sigue en pie.
2. **Su rótulo es el de un botón y su destino es el del otro.** El doctor pide quitar
   «Mi consultorio propio» y «Mi organización médica», y que sólo el consultorio pase a
   pestaña. Este botón se llama «Mis organizaciones» pero lleva a
   `/administration/my-practice`, que es **el consultorio**:
   `my-practice.html` es una cabecera más `<app-work-history secciones="consultorios" />`,
   nada más. O sea: el rótulo es el que él quiere que desaparezca y el contenido es el
   que quiere promovido. Un solo movimiento cumple las dos mitades.

---

## 3. Qué ofrece «esa view», literal

`features/practice/my-practice/my-practice.html` entero:

```html
<app-page-header title="Mis organizaciones" subtitle="…" [breadcrumbs]="breadcrumbs()" />
<app-work-history class="consultorio__bloque" secciones="consultorios" />
```

«Todo lo que ofrece esa view» **es** `app-work-history` en modo `consultorios`: la lista
con la marca «Tu consultorio» / «Trabajás acá», las acciones de fila (Editar · Retirar ·
QR bancario, ya en el patrón de ADR-0012), el alta del consultorio propio con su mapa y
su catálogo de municipios, y la búsqueda en el padrón. El diálogo del QR
(`work-history/site-bank-qr-dialog/`) viaja adentro. **Reusar ese componente no es
parecerse a esa pantalla: es ser esa pantalla.**
