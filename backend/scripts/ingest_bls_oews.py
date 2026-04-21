"""Ingest BLS OEWS Louisiana annual release.

Usage:
    uv run python -m scripts.ingest_bls_oews --input ../research/bls-oews-la

Contract:
  - Reads the annual LA OEWS workbook (state-level SOC × employment × wage
    percentiles).
  - Merges LA employment count and LA median wage into each occupation JSON
    file under backend/data/occupations/.
  - Preserves authored scoreCard and skillBundle fields; only wage and
    employment counts are refreshed.
  - Bumps the occupation's `lastReviewed` date on change.

Idempotent. Skeleton — populated by hand for Phase 2.
"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

from scripts.ingest_onet import update_checksum

logger = logging.getLogger("ingest_bls_oews")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Refresh LA employment & wage figures from BLS OEWS")
    parser.add_argument("--input", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    input_dir = Path(args.input)
    if not input_dir.exists():
        logger.error("Input dir %s does not exist — drop the OEWS LA release here.", input_dir)
        return 1

    oes_file = next(iter(input_dir.glob("*.xlsx")), None)
    if oes_file is None:
        logger.error("No XLSX found in %s", input_dir)
        return 1

    logger.info("Merge pending — Phase 2 authors LA figures manually from BLS published tables.")

    if not args.dry_run:
        update_checksum("bls-oews-la-2025", oes_file)

    return 0


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    sys.exit(main())
