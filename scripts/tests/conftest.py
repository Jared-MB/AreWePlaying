import importlib.util
import json
import os
import sys
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parent.parent / "populate.py"
GOLDEN = Path(__file__).resolve().parent / "golden"


@pytest.fixture
def load_populate(tmp_path, monkeypatch):
    """Importa populate.py limpio, con argv propio y cwd en una carpeta temporal.

    El script parsea argv y usa rutas relativas al importarse, así que cada test
    lo carga de nuevo en vez de modificarlo para hacerlo testeable.
    """

    def load(*argv: str, tournaments: list | None = None):
        (tmp_path / "src" / "assets").mkdir(parents=True, exist_ok=True)
        (tmp_path / "public" / "logos").mkdir(parents=True, exist_ok=True)
        if tournaments is not None:
            (tmp_path / "src" / "assets" / "tournaments.json").write_text(
                json.dumps(tournaments), encoding="utf-8"
            )

        monkeypatch.chdir(tmp_path)
        monkeypatch.setattr(sys, "argv", ["populate.py", *argv])
        monkeypatch.delenv("POPULATE_USER_AGENT", raising=False)

        spec = importlib.util.spec_from_file_location("populate", SCRIPT)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    return load


@pytest.fixture
def golden():
    """Compara bytes contra scripts/tests/golden; UPDATE_GOLDEN=1 los reescribe."""

    def check(name: str, actual: bytes):
        path = GOLDEN / name
        if os.environ.get("UPDATE_GOLDEN") == "1":
            path.write_bytes(actual)
        assert path.exists(), f"Falta {name}; genéralo con UPDATE_GOLDEN=1"
        assert actual == path.read_bytes(), f"{name} cambió respecto al golden"

    return check
