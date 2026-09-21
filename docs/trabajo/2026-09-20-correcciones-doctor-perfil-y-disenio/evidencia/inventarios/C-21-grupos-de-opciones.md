# Inventario C-21 — grupos de opciones que hoy no son `select`

> Corte `68dcb562` · rama `itzan/patron-acciones-fila-insignia-perfil`

> **Cómo se contó.** El comando del encargo cuenta el nombre suelto, y eso incluye
> la etiqueta de cierre: `<app-chip>` y `</app-chip>` suman dos por cada chip. Acá se
> cuenta **la etiqueta de apertura**, que es el número de controles reales. Los dos
> números están, para que se pueda auditar la diferencia.

## `app-chip` — etiquetas de apertura

```
$ git grep -o "<app-chip" -- 'src/app/**/*.html'
58 apariciones en 26 plantillas
```

| # | Archivo | Apariciones | Dueño |
|---|---|---|---|
| 1 | `src/app/features/design-system-sample/design-system-sample.html` | 7 | sin dueño declarado |
| 2 | `src/app/features/public-directories/pharmacy-detail/pharmacy-detail.html` | 5 | sin dueño declarado |
| 3 | `src/app/features/account/my-profile/practitioner-profile/practitioner-profile-view/practitioner-profile-view.html` | 4 | Itzan |
| 4 | `src/app/features/insurance/insurance-catalog/insurance-catalog.html` | 4 | sin dueño declarado |
| 5 | `src/app/features/organization/pharmacy-inbox/pharmacy-inbox.html` | 4 | sin dueño declarado |
| 6 | `src/app/features/tutorials/tutorials-center.html` | 4 | sin dueño declarado |
| 7 | `src/app/features/glossary/glossary.html` | 3 | sin dueño declarado |
| 8 | `src/app/features/insurance/broker-detail/broker-detail.html` | 3 | sin dueño declarado |
| 9 | `src/app/features/organization/pharmacy-inbox/inbox-order/inbox-order.html` | 3 | sin dueño declarado |
| 10 | `src/app/features/accounting/resumen/resumen.html` | 2 | sin dueño declarado |
| 11 | `src/app/features/clinical-record/patient-chart/medication-block/medication-block.html` | 2 | Justin |
| 12 | `src/app/features/organization/pharmacy-profile/documentos-legales/documentos-legales.html` | 2 | sin dueño declarado |
| 13 | `src/app/shared/components/organisms/filter-bar/filter-bar.html` | 2 | Itzan |
| 14 | `src/app/features/account/pharmacy-orders/order-invoice/hoja-de-factura/hoja-de-factura.html` | 1 | sin dueño declarado |
| 15 | `src/app/features/account/pharmacy-orders/order-invoice/tu-factura/tu-factura.html` | 1 | sin dueño declarado |
| 16 | `src/app/features/admin/clinical-forms/forms-catalog.html` | 1 | sin dueño declarado |
| 17 | `src/app/features/alovida/buscar/medicamentos-listado/medicamentos-listado.html` | 1 | sin dueño declarado |
| 18 | `src/app/features/clinical-record/patient-chart/diagnosis-block/diagnosis-block.html` | 1 | sin dueño declarado |
| 19 | `src/app/features/glossary/glossary-term.html` | 1 | sin dueño declarado |
| 20 | `src/app/features/insurance/broker-directory/broker-directory.html` | 1 | sin dueño declarado |
| 21 | `src/app/features/organization/pharmacy-inbox/inbox-order/resumen-de-factura/resumen-de-factura.html` | 1 | sin dueño declarado |
| 22 | `src/app/features/organization/pharmacy-profile/datos-de-la-empresa/datos-de-la-empresa.html` | 1 | sin dueño declarado |
| 23 | `src/app/features/organization/pharmacy-profile/pharmacy-profile.html` | 1 | sin dueño declarado |
| 24 | `src/app/features/organization/pharmacy-profile/representante-y-gerentes/representante-y-gerentes.html` | 1 | sin dueño declarado |
| 25 | `src/app/features/symptom-check/symptom-check.html` | 1 | sin dueño declarado |
| 26 | `src/app/shared/components/organisms/fact-section/fact-section.html` | 1 | Itzan |

**Por dueño** — esto es el encargo de cada uno:

| Dueño | Apariciones | Archivos |
|---|---|---|
| sin dueño declarado | 49 | 22 |
| Itzan | 7 | 3 |
| Justin | 2 | 1 |

## `radio-group` — etiquetas de apertura

```
$ git grep -o "<app-radio-group" -- 'src/app/**/*.html'
16 apariciones en 11 plantillas
```

| # | Archivo | Apariciones | Dueño |
|---|---|---|---|
| 1 | `src/app/features/design-system-sample/design-system-sample.html` | 3 | sin dueño declarado |
| 2 | `src/app/shared/components/organisms/survey-form/survey-form.html` | 3 | Itzan |
| 3 | `src/app/features/account/pharmacy-orders/checkout/checkout.html` | 2 | sin dueño declarado |
| 4 | `src/app/features/account/my-profile/insurance-portability-card/portability-export-dialog/portability-export-dialog.html` | 1 | Itzan |
| 5 | `src/app/features/account/pharmacy-orders/new-order/new-order.html` | 1 | sin dueño declarado |
| 6 | `src/app/features/geo/tracked-subject-form/tracked-subject-form.html` | 1 | sin dueño declarado |
| 7 | `src/app/features/health-context/version-supersede/version-supersede.html` | 1 | sin dueño declarado |
| 8 | `src/app/features/identity-assurance/review-decision-form/review-decision-form.html` | 1 | sin dueño declarado |
| 9 | `src/app/features/identity-verification/identity-verification.html` | 1 | sin dueño declarado |
| 10 | `src/app/features/organization/pharmacy-inbox/inbox-order/inbox-order.html` | 1 | sin dueño declarado |
| 11 | `src/app/shared/components/organisms/paginated-form/paginated-form.html` | 1 | Itzan |

**Por dueño** — esto es el encargo de cada uno:

| Dueño | Apariciones | Archivos |
|---|---|---|
| sin dueño declarado | 11 | 8 |
| Itzan | 5 | 3 |

## `radio-otro` — etiquetas de apertura

```
$ git grep -o "radio-otro" -- 'src/app/**/*.html'
5 apariciones en 2 plantillas
```

| # | Archivo | Apariciones | Dueño |
|---|---|---|---|
| 1 | `src/app/shared/components/molecules/radio-otro/radio-otro.html` | 4 | Itzan |
| 2 | `src/app/shared/components/organisms/paginated-form/paginated-form.html` | 1 | Itzan |

**Por dueño** — esto es el encargo de cada uno:

| Dueño | Apariciones | Archivos |
|---|---|---|
| Itzan | 5 | 2 |

## `segmented-control` — etiquetas de apertura

```
$ git grep -o "segmented-control" -- 'src/app/**/*.html'
13 apariciones en 9 plantillas
```

| # | Archivo | Apariciones | Dueño |
|---|---|---|---|
| 1 | `src/app/features/agenda/agenda-create/agenda-create.html` | 5 | Pablo |
| 2 | `src/app/features/account/appointments/appointments.html` | 1 | sin dueño declarado |
| 3 | `src/app/features/account/medical-record/where-to-buy/where-to-buy.html` | 1 | sin dueño declarado |
| 4 | `src/app/features/clinical-record/patient-chart/specialty-form-block/specialty-form-block.html` | 1 | sin dueño declarado |
| 5 | `src/app/features/form-builder/field-editor/field-editor.html` | 1 | sin dueño declarado |
| 6 | `src/app/features/insurance/insurance-analytics/insurance-analytics.html` | 1 | sin dueño declarado |
| 7 | `src/app/features/nearby-places/search-origin-picker/search-origin-picker.html` | 1 | sin dueño declarado |
| 8 | `src/app/features/quotations/quotation-form/quotation-form.html` | 1 | sin dueño declarado |
| 9 | `src/app/shared/components/organisms/paginated-form/paginated-form.html` | 1 | Itzan |

**Por dueño** — esto es el encargo de cada uno:

| Dueño | Apariciones | Archivos |
|---|---|---|
| sin dueño declarado | 7 | 7 |
| Pablo | 5 | 1 |
| Itzan | 1 | 1 |

## Resumen

| Tipo | Nombre suelto (encargo) | Apertura (real) | Archivos |
|---|---|---|---|
| `app-chip` | 379 | **58** | 26 |
| `radio-group` | 136 | **16** | 11 |
| `radio-otro` | 5 | **5** | 2 |
| `segmented-control` | 13 | **13** | 9 |
