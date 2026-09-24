import base64
import json
from datetime import UTC, datetime, timedelta
from io import BytesIO

import pytest
import responses
import time_machine
from PIL import Image
from responses import matchers

API = "https://scoretdi2025-eta.vercel.app/api/"
T1 = "AAAAAAAA-AAAA-4AAA-8AAA-000000000001"
T2 = "BBBBBBBB-BBBB-4BBB-8BBB-000000000002"
TEAM_A = "aaaaaaa1-0000-4000-8000-000000000001"
TEAM_B = "aaaaaaa2-0000-4000-8000-000000000002"
WEEK_1 = "a0000000-0000-4000-8000-000000000001"
WEEK_2 = "a0000000-0000-4000-8000-000000000002"
NOW = datetime(2026, 9, 24, 6, 0, tzinfo=UTC)


def png_base64(size=(40, 20), mode="RGBA") -> str:
    buffer = BytesIO()
    Image.new(mode, size, (255, 0, 0, 128) if mode == "RGBA" else (255, 0, 0)).save(
        buffer, format="PNG"
    )
    return base64.b64encode(buffer.getvalue()).decode()


# --- Funciones puras -------------------------------------------------------


def test_is_uuid(load_populate):
    p = load_populate()
    assert p.is_uuid(T1)
    assert p.is_uuid(T1.lower())
    assert not p.is_uuid("../../etc")
    assert not p.is_uuid(f"{T1}/..")
    assert not p.is_uuid(None)
    assert not p.is_uuid(123)


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        ("26/09/2026 18:00", datetime(2026, 9, 26, 18, 0, tzinfo=UTC)),
        ("26/09/2026", datetime(2026, 9, 26, tzinfo=UTC)),
        ("2026-09-26", None),
        ("", None),
        (None, None),
    ],
)
def test_parse_api_date(load_populate, value, expected):
    assert load_populate().parse_api_date(value) == expected


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        (
            "2026-09-24T11:10:21.320659+00:00",
            datetime(2026, 9, 24, 11, 10, 21, 320659, tzinfo=UTC),
        ),
        # Sin zona horaria se asume UTC.
        ("2026-09-24T11:10:21", datetime(2026, 9, 24, 11, 10, 21, tzinfo=UTC)),
        ("ayer", None),
        ("", None),
        (None, None),
    ],
)
def test_parse_updated_at(load_populate, value, expected):
    assert load_populate().parse_updated_at(value) == expected


def test_decode_base64_image_acepta_data_uri_y_sin_padding(load_populate):
    p = load_populate()
    raw = base64.b64encode(b"hola!").decode()  # "aG9sYSE="
    assert p.decode_base64_image(raw) == b"hola!"
    assert p.decode_base64_image(raw.rstrip("=")) == b"hola!"
    assert p.decode_base64_image(f"  data:image/png;base64,{raw}  ") == b"hola!"


def test_load_json_file(load_populate, tmp_path):
    p = load_populate()
    assert p.load_json_file("no-existe.json") is None
    (tmp_path / "roto.json").write_text("{", encoding="utf-8")
    assert p.load_json_file("roto.json") is None
    (tmp_path / "vacio.json").write_text("[]", encoding="utf-8")
    assert p.load_json_file("vacio.json") is None
    (tmp_path / "ok.json").write_text('[{"a": 1}]', encoding="utf-8")
    assert p.load_json_file("ok.json") == [{"a": 1}]


def test_save_json_as_file_con_formato_de_biome(load_populate, tmp_path):
    p = load_populate()
    p.save_json_as_file("out.json", [{"name": "UP MÉXICO", "n": 1}])
    assert (tmp_path / "out.json").read_text(encoding="utf-8") == (
        '[\n\t{\n\t\t"name": "UP MÉXICO",\n\t\t"n": 1\n\t}\n]\n'
    )


def test_user_agent(load_populate, monkeypatch):
    p = load_populate()
    assert p.HEADERS["User-Agent"] == (
        "AreWePlaying/1.0 (+https://areweplaying.com; "
        "https://github.com/Jared-MB/AreWePlaying; amunozbaez669@gmail.com)"
    )


# --- Fechas del torneo -------------------------------------------------------


def days(*dates):
    return [{"date": d} for d in dates]


@time_machine.travel(NOW, tick=False)
def test_is_calendar_complete(load_populate):
    p = load_populate()
    # Queda una jornada por jugar: el calendario sirve tal cual.
    assert p.is_calendar_complete(days("14/09/2026", "28/09/2026"))
    # Ya se jugaron todas: hay que volver a preguntar (playoffs).
    assert not p.is_calendar_complete(days("14/09/2026", "21/09/2026"))
    assert not p.is_calendar_complete(days("fecha rara"))
    assert not p.is_calendar_complete([])


@time_machine.travel(NOW, tick=False)
@pytest.mark.parametrize(
    ("last_day", "end_times", "finished"),
    [
        # 14 días de gracia tras la última jornada (estrictamente más).
        ("09/09/2026", ["x", "x"], True),
        ("10/09/2026 05:59", ["x", "x"], True),
        ("10/09/2026 06:00", ["x", "x"], False),
        ("11/09/2026", ["x", "x"], False),
        # Un partido sin hora de término lo mantiene abierto.
        ("01/01/2026", ["x", ""], False),
        ("01/01/2026", ["x", None], False),
    ],
)
def test_is_tournament_finished(load_populate, last_day, end_times, finished):
    p = load_populate()
    matches = [{"data": [{"endTime": e} for e in end_times]}]
    assert p.is_tournament_finished(days("01/08/2026", last_day), matches) is finished


def test_is_tournament_finished_sin_partidos(load_populate):
    p = load_populate()
    assert not p.is_tournament_finished(days("01/01/2020"), [{"data": []}])
    assert not p.is_tournament_finished([], [{"data": [{"endTime": "x"}]}])


# --- Guardas -----------------------------------------------------------------


def test_guard_shrink(load_populate, tmp_path, capsys):
    p = load_populate()
    (tmp_path / "cache.json").write_text("[1, 2, 3]", encoding="utf-8")

    p.guard_shrink("sin-cache.json", "partidos", 0, len)
    p.guard_shrink("cache.json", "partidos", 3, len)
    p.guard_shrink("cache.json", "partidos", 4, len)

    with pytest.raises(SystemExit) as exit_info:
        p.guard_shrink("cache.json", "partidos", 2, len)
    assert exit_info.value.code == 1
    assert capsys.readouterr().out == (
        "El API regresó 2 partidos y había 3 guardados en cache.json. "
        "No se sobrescribe; usa --allow-shrink si es intencional.\n"
    )


def test_guard_shrink_con_allow_shrink(load_populate, tmp_path):
    p = load_populate("--allow-shrink")
    (tmp_path / "cache.json").write_text("[1, 2, 3]", encoding="utf-8")
    p.guard_shrink("cache.json", "partidos", 0, len)


# --- Logos -------------------------------------------------------------------


def test_save_team_logo(load_populate, tmp_path):
    p = load_populate()
    url = p.save_team_logo(T1, TEAM_A, png_base64((1024, 256)))
    assert url == f"/logos/{T1}/{TEAM_A}.avif"

    path = tmp_path / "public" / "logos" / T1 / f"{TEAM_A}.avif"
    with Image.open(path) as image:
        # Se conserva la proporción y la transparencia, con 512 px de lado máximo.
        assert (image.format, image.size, image.mode) == ("AVIF", (512, 128), "RGBA")

    # Mismo logo: no se reescribe el archivo (el diff nocturno queda limpio).
    mtime = path.stat().st_mtime_ns
    p.save_team_logo(T1, TEAM_A, png_base64((1024, 256)))
    assert path.stat().st_mtime_ns == mtime


def test_save_team_logo_rgb_sin_alfa(load_populate, tmp_path):
    p = load_populate()
    p.save_team_logo(T1, TEAM_B, png_base64((30, 30), mode="RGB"))
    with Image.open(tmp_path / "public" / "logos" / T1 / f"{TEAM_B}.avif") as image:
        assert (image.size, image.mode) == ((30, 30), "RGB")


@pytest.mark.parametrize(
    ("tournament_id", "team_id", "raw"),
    [
        (T1, TEAM_A, None),
        (T1, TEAM_A, ""),
        ("../../x", TEAM_A, png_base64()),
        (T1, "../evil", png_base64()),
        (T1, TEAM_A, "no-es-base64!!"),
        (T1, TEAM_A, base64.b64encode(b"no es imagen").decode()),
    ],
)
def test_save_team_logo_descarta(load_populate, tmp_path, tournament_id, team_id, raw):
    p = load_populate()
    assert p.save_team_logo(tournament_id, team_id, raw) is None
    assert not any((tmp_path / "public" / "logos").rglob("*.avif"))


# --- main(): cuándo se vuelve a pedir un torneo -----------------------------


def tournament(tid, **extra):
    return {"id": tid, "division": "I", "category": "Varonil", "season": "s", **extra}


@time_machine.travel(NOW, tick=False)
@pytest.mark.parametrize(
    ("argv", "entry", "fetched"),
    [
        ([], {"finished": True, "updated_at": "2020-01-01T00:00:00+00:00"}, False),
        ([], {"finished": False, "updated_at": "2026-09-23T06:30:00+00:00"}, False),
        ([], {"finished": False, "updated_at": "2026-09-23T06:00:00+00:00"}, False),
        ([], {"finished": False, "updated_at": "2026-09-23T05:59:00+00:00"}, True),
        ([], {"finished": False}, True),
        ([], {"finished": False, "updated_at": "basura"}, True),
        (
            ["--force"],
            {"finished": True, "updated_at": "2026-09-24T05:00:00+00:00"},
            True,
        ),
        (["-f"], {"finished": False, "updated_at": "2026-09-24T05:00:00+00:00"}, True),
    ],
)
def test_main_decide_que_torneos_pedir(load_populate, argv, entry, fetched):
    p = load_populate(*argv, tournaments=[tournament(T1, **entry)])
    calls = []
    p.get_tournament_data = calls.append
    p.main()
    assert calls == ([T1] if fetched else [])


def test_get_tournament_data_rechaza_ids_raros(load_populate):
    p = load_populate()
    with pytest.raises(SystemExit):
        p.get_tournament_data("../../x")


# --- Golden: API → JSON del repo --------------------------------------------


def api_body(data):
    return {"data": json.dumps(data)}


def api_week(week_id, date, name):
    return {
        "Fecha": date,
        "Nombre": name,
        "tipojornadanombre": "Temporada Regular",
        "JornadaID": week_id,
        "TorneoID": T1.lower(),
    }


def api_match(n, local, visiting, date, *, played):
    return {
        "PartidoID": f"a1000000-0000-4000-8000-00000000000{n}",
        "Numero": n,
        "EquipoLocal": local[1],
        "EquipoLocalID": local[0],
        "EquipoVisita": visiting[1],
        "EquipoVisitaID": visiting[0],
        "Fecha": date,
        "Iniciado": date if played else "",
        "Terminado": date if played else "",
        "EquipoCasaPuntos": "76" if played else "0",
        "EquipoVisitaPuntos": "57" if played else "0",
        "PeriodoFinal": "CUARTO 4" if played else "",
        "Nombre": f"PARTIDO {n}",
        "PartidoIniciado": 0 if played else 1,
        "SedeNombre": "CENTRO DEPORTIVO COYOACÁN",
        "Ubicacion": "http://maps.google.com/maps?daddr=19.36,-99.16",
        "EnVivo": 0,
        "URL": "",
        "PosLocal": "(1)" if played else "",
        "GPLocal": "1-0" if played else "",
        "PosVisita": "(2)" if played else "",
        "GPVisita": "0-1" if played else "",
    }


A = (TEAM_A, "UP MÉXICO", "UNIVERSIDAD PANAMERICANA CAMPUS MÉXICO")
B = (TEAM_B, "UV", "UNIVERSIDAD VERACRUZANA")


def api_team(team, logo):
    return {
        "EquipoID": team[0],
        "Nombre": team[2],
        "NombreCorte": team[1],
        "Logo": logo,
    }


def api_row(team, position, wins, losses):
    return {
        "Posicion": position,
        "EquipoLargo": team[2],
        "Equipo": team[1],
        "Partidos": wins + losses,
        "PartidosLocal": wins,
        "PartidosVisita": losses,
        "Porcentaje": 100.0 * wins / max(wins + losses, 1),
        "GanadosPerdidos": f"{wins}-{losses}",
        "Ganados": wins,
        "Perdidos": losses,
        "RegistroLocal": f"{wins}-0",
        "RegistroVisita": f"0-{losses}",
        "GanadosLocal": wins,
        "PerdidosLocal": 0,
        "GanadosVisita": 0,
        "PerdidosVisita": losses,
        "PuntosFavor": 76 * wins + 57 * losses,
        "PuntosContra": 57 * wins + 76 * losses,
        "DiferenciaPuntos": 19 * (wins - losses),
        "EquipoLocalPuntos": 76 * wins,
        "EquipoLocalPuntosContra": 57 * wins,
        "DiferenciaPuntosLocal": 19 * wins,
        "EquipoVisitaPuntos": 57 * losses,
        "EquipoVisitaPuntosContra": 76 * losses,
        "DiferenciaPuntosVisita": -19 * losses,
        "Puntos": 2 * wins + losses,
        "PuntosLocal": 2 * wins,
        "PuntosVisita": losses,
    }


WEEKS = [
    api_week(WEEK_1, "14/09/2026", "SEMANA 1"),
    api_week(WEEK_2, "28/09/2026", "SEMANA 2"),
]
MATCHES = {
    WEEK_1: [api_match(1, A, B, "18/09/2026 14:00", played=True)],
    WEEK_2: [api_match(2, B, A, "03/10/2026 13:00", played=False)],
}
TEAMS = [api_team(A, png_base64()), api_team(B, None)]
TABLE = [api_row(A, 1, 1, 0), api_row(B, 2, 0, 1)]


class FakeAsyncApi:
    """Sustituye `fetch_api_data_async` (equipos y tabla van por aiohttp).

    aioresponses no es compatible con aiohttp 3.14, así que se reemplaza la
    función del script y se registra qué se pidió.
    """

    def __init__(self):
        self.routes = {}
        self.calls = []

    def get(self, endpoint, params, data):
        self.routes[(endpoint, tuple(sorted(params.items())))] = data

    async def __call__(self, session, endpoint, params):
        self.calls.append((endpoint, params))
        key = (endpoint, tuple(sorted(params.items())))
        if key not in self.routes:
            raise AssertionError(f"Petición inesperada: {endpoint} {params}")
        # El API manda `data` como JSON dentro de un string.
        return json.loads(api_body(self.routes[key])["data"])


@pytest.fixture
def aio():
    return FakeAsyncApi()


def load_with_fake(load_populate, aio, **kwargs):
    p = load_populate(**kwargs)
    p.fetch_api_data_async = aio
    return p


def mock_api(rsps, aio, *, weeks=True, teams=True, table=TABLE):
    if weeks:
        rsps.get(
            API + "jornadas",
            json=api_body(WEEKS),
            match=[matchers.query_param_matcher({"torneoID": T1})],
        )
    for week_id, data in MATCHES.items():
        rsps.get(
            API + "partidos",
            json=api_body(data),
            match=[matchers.query_param_matcher({"jornadaID": week_id})],
        )
    if teams:
        aio.get("equipos", {"torneoID": T1}, TEAMS)
    aio.get("tablaResumen", {"torneoID": T1}, table)


@time_machine.travel(NOW, tick=False)
def test_golden_api_a_json(load_populate, aio, tmp_path, golden):
    p = load_with_fake(
        load_populate, aio, tournaments=[tournament(T1, finished=False), tournament(T2)]
    )

    with responses.RequestsMock() as rsps:
        mock_api(rsps, aio)
        p.get_tournament_data(T1)
        # Se identifica ante el API.
        assert rsps.calls[0].request.headers["User-Agent"].startswith("AreWePlaying/")
    assert [endpoint for endpoint, _ in aio.calls] == ["equipos", "tablaResumen"]

    folder = tmp_path / "src" / "assets" / T1
    for name in ("weeks", "matches", "teams", "teams-table"):
        golden(f"{name}.json", (folder / f"{name}.json").read_bytes())
    golden(
        "tournaments.json",
        (tmp_path / "src" / "assets" / "tournaments.json").read_bytes(),
    )
    assert (tmp_path / "public" / "logos" / T1 / f"{TEAM_A}.avif").exists()


@time_machine.travel(NOW, tick=False)
def test_reutiliza_jornadas_y_equipos_en_cache(load_populate, aio, tmp_path, capsys):
    p = load_with_fake(load_populate, aio, tournaments=[tournament(T1)])
    folder = tmp_path / "src" / "assets" / T1
    folder.mkdir(parents=True)
    cached_weeks = [
        {
            "date": "14/09/2026",
            "week": "SEMANA 1",
            "type": "",
            "id": WEEK_1,
            "tournamentId": "",
        },
        {
            "date": "28/09/2026",
            "week": "SEMANA 2",
            "type": "",
            "id": WEEK_2,
            "tournamentId": "",
        },
    ]
    cached_teams = [
        {"id": TEAM_A, "name": A[2], "shortName": A[1], "logo": None},
        {"id": TEAM_B, "name": B[2], "shortName": B[1], "logo": None},
    ]
    (folder / "weeks.json").write_text(json.dumps(cached_weeks), encoding="utf-8")
    (folder / "teams.json").write_text(json.dumps(cached_teams), encoding="utf-8")

    # Sin mocks para jornadas ni equipos: si los pidiera, el test fallaría.
    with responses.RequestsMock() as rsps:
        mock_api(rsps, aio, weeks=False, teams=False)
        p.get_tournament_data(T1)

    assert [endpoint for endpoint, _ in aio.calls] == ["tablaResumen"]
    out = capsys.readouterr().out
    assert f"Reusing cached match days for {T1}" in out
    assert f"Reusing cached teams for {T1}" in out
    assert json.loads((folder / "weeks.json").read_text()) == cached_weeks


@time_machine.travel(NOW + timedelta(days=10), tick=False)
def test_calendario_agotado_vuelve_a_pedir_jornadas(load_populate, aio, tmp_path):
    p = load_with_fake(load_populate, aio, tournaments=[tournament(T1)])
    folder = tmp_path / "src" / "assets" / T1
    folder.mkdir(parents=True)
    (folder / "weeks.json").write_text(
        json.dumps([{"date": "14/09/2026", "id": WEEK_1}]), encoding="utf-8"
    )

    with responses.RequestsMock() as rsps:
        mock_api(rsps, aio)
        p.get_tournament_data(T1)
        assert any("jornadas" in call.request.url for call in rsps.calls)


@time_machine.travel(NOW, tick=False)
def test_equipo_de_la_tabla_que_no_existe(load_populate, aio):
    p = load_with_fake(load_populate, aio, tournaments=[tournament(T1)])
    ghost = (TEAM_B, "FANTASMA", "EQUIPO FANTASMA")

    with (
        responses.RequestsMock() as rsps,
        pytest.raises(ValueError, match="Team FANTASMA not found"),
    ):
        mock_api(rsps, aio, table=[api_row(ghost, 1, 0, 0)])
        p.get_tournament_data(T1)


@time_machine.travel(NOW, tick=False)
def test_menos_partidos_que_antes_aborta_sin_escribir(load_populate, aio, tmp_path):
    p = load_with_fake(load_populate, aio, tournaments=[tournament(T1)])
    folder = tmp_path / "src" / "assets" / T1
    folder.mkdir(parents=True)
    previous = [{"id": WEEK_1, "data": [{}, {}, {}]}]
    (folder / "matches.json").write_text(json.dumps(previous), encoding="utf-8")

    with (
        responses.RequestsMock(assert_all_requests_are_fired=False) as rsps,
        pytest.raises(SystemExit),
    ):
        mock_api(rsps, aio)
        p.get_tournament_data(T1)

    assert json.loads((folder / "matches.json").read_text()) == previous
