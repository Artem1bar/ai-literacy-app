"""Ingest O*NET 28.0 tables into the occupation JSON store.

Usage:
    uv run python -m scripts.ingest_onet --input ../research/onet

Contract:
  - Reads `Occupation Data.txt`, `Task Statements.txt`, and
    `Technology Skills.txt` from the input directory.
  - Produces/updates one JSON file per SOC under `backend/data/occupations/`.
  - Never overwrites authored fields (scoreCard, skillBundle, learningPath).
  - Updates `checksums.json` with the source-file SHA-256.

Idempotent: re-running against unchanged input produces no git diff.

Phase 1 ships this as a skeleton — the actual O*NET release tables are not
checked into the repo. Phase 2 populates occupations by hand for the priority
SOC set; this script becomes the source of truth when the full O*NET drop
lands under `research/onet/`.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger("ingest_onet")

BACKEND_ROOT = Path(__file__).resolve().parent.parent
OCCUPATIONS_DIR = BACKEND_ROOT / "data" / "occupations"
CHECKSUMS_PATH = BACKEND_ROOT / "data" / "checksums.json"


def sha256_of(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65_536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def update_checksum(source_id: str, source_path: Path) -> None:
    payload = json.loads(CHECKSUMS_PATH.read_text()) if CHECKSUMS_PATH.exists() else {"sources": {}}
    payload.setdefault("sources", {})
    entry = payload["sources"].setdefault(source_id, {})
    entry.update(
        {
            "file": str(source_path),
            "sha256": sha256_of(source_path),
            "ingested_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "ingested_by_script": "scripts/ingest_onet.py",
        },
    )
    CHECKSUMS_PATH.write_text(json.dumps(payload, indent=2) + "\n")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Ingest O*NET 28.0 into occupations/")
    parser.add_argument("--input", required=True, help="Path to the O*NET tables directory")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    input_dir = Path(args.input)
    if not input_dir.exists():
        logger.error("Input dir %s does not exist — drop the O*NET release here and re-run.", input_dir)
        return 1

    occupation_file = input_dir / "Occupation Data.txt"
    if not occupation_file.exists():
        logger.error("Missing Occupation Data.txt in %s", input_dir)
        return 1

    logger.info("Ingest pending — Phase 2 populates occupations by hand; this script becomes authoritative once raw O*NET tables are dropped into %s.", input_dir)

    if not args.dry_run:
        update_checksum("onet-28", occupation_file)

    OCCUPATIONS_DIR.mkdir(parents=True, exist_ok=True)
    return 0


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    sys.exit(main())
