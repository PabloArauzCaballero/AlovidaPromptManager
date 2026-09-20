#!/usr/bin/env python
"""Verifica que un reparto de prompts cumpla la estructura obligatoria.

La estructura la fija la convención del equipo:

    <AAAA-MM-DD>/<PromptDia|PromptNoche>/Daily-<Dia|Noche>-<AAAA-MM-DD>.md
    <AAAA-MM-DD>/<PromptDia|PromptNoche>/<Persona>/<Persona>-Daily-<Dia|Noche>-<AAAA-MM-DD>.md
    <AAAA-MM-DD>/<PromptDia|PromptNoche>/<Persona>/<NombreCorreccion.Modulo>/<NombreTarea>.md

Por qué existe: un reparto al que le falta el daily de una persona se ve igual de bien a simple
vista que uno completo. Revisarlo a ojo es exactamente lo que esta comprobación reemplaza.

Este script NO juzga el contenido de los prompts. Verifica que los archivos que el equipo
espera encontrar estén donde el equipo los busca. Un archivo presente no prueba que su
contenido sirva.

Uso:
    python tools/check_reparto.py repartos/2026-09-19     # sale 1 si falta algo
    python tools/check_reparto.py --self-test
"""
from __future__ import annotations

import argparse
import re
import sys
import tempfile
from pathlib import Path

PERSONAS = ("Ender", "Itzan", "Pablo", "Marcelo", "Justin")
TURNOS = {"PromptDia": "Dia", "PromptNoche": "Noche"}
FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")
IGNORAR = {".DS_Store", "Thumbs.db"}


def _subcarpetas(base: Path) -> list[Path]:
    return sorted(p for p in base.iterdir() if p.is_dir() and p.name not in IGNORAR)


def _archivos_md(base: Path) -> list[Path]:
    return sorted(p for p in base.iterdir() if p.is_file() and p.suffix == ".md")


def revisar(raiz: Path) -> list[str]:
    """Devuelve la lista de problemas. Lista vacía = estructura correcta."""
    problemas: list[str] = []

    if not raiz.is_dir():
        return [f"la carpeta de fecha no existe: {raiz}"]

    if not FECHA.match(raiz.name):
        problemas.append(
            f"el primer nivel debe ser una fecha AAAA-MM-DD, y es: '{raiz.name}'")

    fecha = raiz.name
    turnos = _subcarpetas(raiz)
    if not turnos:
        problemas.append(f"{fecha}/: no hay ninguna carpeta de turno")

    for turno in turnos:
        if turno.name not in TURNOS:
            problemas.append(
                f"{fecha}/{turno.name}/: turno no permitido "
                f"(solo {' o '.join(TURNOS)})")
            continue

        sufijo = TURNOS[turno.name]
        daily_equipo = turno / f"Daily-{sufijo}-{fecha}.md"
        if not daily_equipo.is_file():
            problemas.append(f"FALTA el daily de equipo: {_rel(daily_equipo, raiz)}")

        personas = _subcarpetas(turno)
        if not personas:
            problemas.append(
                f"{fecha}/{turno.name}/: no hay ninguna carpeta de persona")

        for persona in personas:
            if persona.name not in PERSONAS:
                problemas.append(
                    f"{fecha}/{turno.name}/{persona.name}/: persona desconocida "
                    f"(esperadas: {', '.join(PERSONAS)})")
                continue

            daily = persona / f"{persona.name}-Daily-{sufijo}-{fecha}.md"
            if not daily.is_file():
                problemas.append(f"FALTA el daily personal: {_rel(daily, raiz)}")

            lotes = _subcarpetas(persona)
            if not lotes:
                problemas.append(
                    f"{fecha}/{turno.name}/{persona.name}/: no tiene ninguna carpeta "
                    "<NombreCorreccion.Modulo> con su tarea")
                continue

            for lote in lotes:
                if "." not in lote.name:
                    problemas.append(
                        f"{_rel(lote, raiz)}/: el nombre del lote debe ser "
                        "<NombreCorreccion>.<Modulo>, con un punto")
                tareas = _archivos_md(lote)
                if not tareas:
                    problemas.append(
                        f"{_rel(lote, raiz)}/: no contiene ningún .md de tarea")

    return problemas


def _rel(p: Path, raiz: Path) -> str:
    try:
        return f"{raiz.name}/{p.relative_to(raiz).as_posix()}"
    except ValueError:
        return str(p)


# ----------------------------------------------------------------- self-test

def _armar_arbol_ok(base: Path, fecha: str = "2026-09-19") -> Path:
    """Construye un reparto mínimo y correcto: un turno, una persona, un lote."""
    raiz = base / fecha
    turno = raiz / "PromptNoche"
    (turno / "Pablo" / "Dia1-Algo.Backend").mkdir(parents=True)
    (turno / f"Daily-Noche-{fecha}.md").write_text("x", encoding="utf-8")
    (turno / "Pablo" / f"Pablo-Daily-Noche-{fecha}.md").write_text("x", encoding="utf-8")
    (turno / "Pablo" / "Dia1-Algo.Backend" / "Tarea.md").write_text("x", encoding="utf-8")
    return raiz


def self_test() -> int:
    casos: list[tuple[str, bool]] = []

    def check(nombre: str, condicion: bool) -> None:
        casos.append((nombre, condicion))

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)

        raiz = _armar_arbol_ok(base / "ok")
        check("arbol correcto no reporta problemas", revisar(raiz) == [])

        raiz = _armar_arbol_ok(base / "sin_daily_equipo")
        (raiz / "PromptNoche" / "Daily-Noche-2026-09-19.md").unlink()
        p = revisar(raiz)
        check("detecta falta de daily de equipo", len(p) == 1)
        check("nombra el daily de equipo faltante",
              "Daily-Noche-2026-09-19.md" in p[0] and "FALTA" in p[0])

        raiz = _armar_arbol_ok(base / "sin_daily_persona")
        (raiz / "PromptNoche" / "Pablo" / "Pablo-Daily-Noche-2026-09-19.md").unlink()
        p = revisar(raiz)
        check("detecta falta de daily personal", len(p) == 1)
        check("nombra el daily personal faltante",
              "Pablo-Daily-Noche-2026-09-19.md" in p[0])

        raiz = _armar_arbol_ok(base / "lote_vacio")
        (raiz / "PromptNoche" / "Pablo" / "Dia1-Algo.Backend" / "Tarea.md").unlink()
        p = revisar(raiz)
        check("detecta lote sin tarea", len(p) == 1 and "ningún .md" in p[0])

        raiz = _armar_arbol_ok(base / "sin_lote")
        import shutil as _sh
        _sh.rmtree(raiz / "PromptNoche" / "Pablo" / "Dia1-Algo.Backend")
        p = revisar(raiz)
        check("detecta persona sin lote", len(p) == 1 and "NombreCorreccion" in p[0])

        raiz = _armar_arbol_ok(base / "lote_sin_punto")
        (raiz / "PromptNoche" / "Pablo" / "Dia1-Algo.Backend").rename(
            raiz / "PromptNoche" / "Pablo" / "Dia1AlgoBackend")
        p = revisar(raiz)
        check("detecta lote sin punto en el nombre",
              any("con un punto" in x for x in p))

        raiz = _armar_arbol_ok(base / "persona_rara")
        (raiz / "PromptNoche" / "Fulano").mkdir()
        p = revisar(raiz)
        check("detecta persona desconocida",
              any("persona desconocida" in x for x in p))

        raiz = _armar_arbol_ok(base / "turno_raro")
        (raiz / "PromptTarde").mkdir()
        p = revisar(raiz)
        check("detecta turno no permitido",
              any("turno no permitido" in x for x in p))

        raiz = _armar_arbol_ok(base / "fecha_mala", fecha="19-09-2026")
        p = revisar(raiz)
        check("detecta primer nivel que no es fecha",
              any("AAAA-MM-DD" in x for x in p))

        check("carpeta inexistente se reporta, no explota",
              len(revisar(base / "no-existe")) == 1)

        raiz = base / "vacia" / "2026-09-19"
        raiz.mkdir(parents=True)
        p = revisar(raiz)
        check("fecha sin turnos se reporta",
              any("ninguna carpeta de turno" in x for x in p))

    fallos = [n for n, ok in casos if not ok]
    for nombre, ok in casos:
        print(f"  [{'PASS' if ok else 'FAIL'}] {nombre}")
    print(f"check_reparto self-test: {len(casos) - len(fallos)} PASS, {len(fallos)} FAIL")
    return 1 if fallos else 0


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("ruta", nargs="?", help="carpeta de fecha del reparto")
    ap.add_argument("--self-test", action="store_true", help="corre las pruebas internas")
    args = ap.parse_args()

    if args.self_test:
        return self_test()

    if not args.ruta:
        ap.error("falta la carpeta de fecha del reparto (o usá --self-test)")

    raiz = Path(args.ruta).resolve()
    problemas = revisar(raiz)

    if problemas:
        print(f"check_reparto: ESTRUCTURA INCOMPLETA en {raiz.name}")
        for p in problemas:
            print(f"  - {p}")
        return 1

    print(f"check_reparto: OK, {raiz.name} cumple la estructura obligatoria")
    return 0


if __name__ == "__main__":
    sys.exit(main())
