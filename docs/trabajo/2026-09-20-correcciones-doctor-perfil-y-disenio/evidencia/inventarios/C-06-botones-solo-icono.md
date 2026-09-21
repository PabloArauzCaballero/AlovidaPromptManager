# Inventario C-06 — botones sólo-icono

> Corte `68dcb562` · rama `itzan/patron-acciones-fila-insignia-perfil`

## `iconOnly` en plantillas

```
$ git grep -o "iconOnly" -- 'src/app/**/*.html' | wc -l
107 apariciones en 34 plantillas
```

| # | Archivo | Apariciones | Dueño |
|---|---|---|---|
| 1 | `src/app/features/agenda/agenda.html` | 15 | Pablo |
| 2 | `src/app/features/agenda/my-agenda/my-agenda.html` | 9 | Pablo |
| 3 | `src/app/features/auth/register-patient/register-patient.html` | 8 | sin dueño declarado |
| 4 | `src/app/shared/components/organisms/paginated-form/paginated-form.html` | 8 | Itzan |
| 5 | `src/app/shared/components/organisms/date-picker/date-picker.html` | 7 | Itzan |
| 6 | `src/app/features/design-system-sample/design-system-sample.html` | 5 | sin dueño declarado |
| 7 | `src/app/shared/components/atoms/back-link/back-link.html` | 5 | Itzan |
| 8 | `src/app/features/agenda/blocks/blocks.html` | 4 | Pablo |
| 9 | `src/app/features/form-builder/field-editor/field-editor.html` | 4 | sin dueño declarado |
| 10 | `src/app/features/account/my-profile/work-history/work-history.html` | 3 | Itzan |
| 11 | `src/app/features/auth/register-practitioner/register-practitioner.html` | 3 | sin dueño declarado |
| 12 | `src/app/features/auth/registro-compartido/ubicacion-picker/ubicacion-picker.html` | 3 | sin dueño declarado |
| 13 | `src/app/features/account/my-profile/my-profile.html` | 2 | Itzan |
| 14 | `src/app/features/account/my-profile/practitioner-profile-edit/practitioner-profile-edit.html` | 2 | Itzan |
| 15 | `src/app/features/agenda/my-agenda/day-view/day-view.html` | 2 | Pablo |
| 16 | `src/app/features/agenda/my-agenda/week-view/week-view.html` | 2 | Pablo |
| 17 | `src/app/features/auth/register-imaging-center/register-imaging-center.html` | 2 | sin dueño declarado |
| 18 | `src/app/features/auth/register-laboratory/register-laboratory.html` | 2 | sin dueño declarado |
| 19 | `src/app/features/clinical-record/clinical-record.html` | 2 | sin dueño declarado |
| 20 | `src/app/features/pharma-lab/doctor-visits/doctor-visits.html` | 2 | sin dueño declarado |
| 21 | `src/app/shared/components/molecules/file-preview/file-preview.html` | 2 | Itzan |
| 22 | `src/app/shared/components/molecules/pagination/pagination.html` | 2 | Itzan |
| 23 | `src/app/shared/components/organisms/header/header.html` | 2 | Itzan |
| 24 | `src/app/features/account/my-profile/patient-profile-edit/patient-profile-edit.html` | 1 | Itzan |
| 25 | `src/app/features/account/my-profile/practitioner-profile/practitioner-profile-view/practitioner-profile-view.html` | 1 | Itzan |
| 26 | `src/app/features/account/my-profile/work-history/site-bank-qr-dialog/site-bank-qr-dialog.html` | 1 | Itzan |
| 27 | `src/app/features/alovida/shell/alovida-public-shell.html` | 1 | sin dueño declarado |
| 28 | `src/app/features/alovida/shell/alovida-shell.html` | 1 | sin dueño declarado |
| 29 | `src/app/features/shell-layout/shell-layout.html` | 1 | sin dueño declarado |
| 30 | `src/app/shared/components/molecules/card-detail-panel/card-detail-panel.html` | 1 | Itzan |
| 31 | `src/app/shared/components/molecules/reference-combobox/reference-combobox.html` | 1 | Itzan |
| 32 | `src/app/shared/components/molecules/search-field/search-field.html` | 1 | Itzan |
| 33 | `src/app/shared/components/organisms/auth-split/auth-split.html` | 1 | Itzan |
| 34 | `src/app/shared/components/organisms/tree-select/tree-select.html` | 1 | Itzan |

**Por dueño** — esto es el encargo de cada uno:

| Dueño | Apariciones | Archivos |
|---|---|---|
| Itzan | 41 | 17 |
| sin dueño declarado | 34 | 12 |
| Pablo | 32 | 5 |
