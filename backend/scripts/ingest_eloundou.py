"""Ingest Eloundou et al. (2024) task-level exposure labels.

Usage:
    uv run python -m scripts.ingest_eloundou --input ../research/eloundou

Contract:
  - Reads the task-level exposure CSV from the input directory.
  - Aggregates per SOC (mean of binary exposure labels across tasks).
  - Writes the per-SOC exposure priors to seeds/exposure_priors.json.
  - Updates checksums.json with the source SHA-256.

Like the O*NET ingest, this is a skeleton until the raw dataset lands under
`research/eloundou/`. For Phase 2, priors live in `seeds/exposure_priors.json`
authored from the paper's published aggregate tables with a `confidence`
qualifier per SOC.
"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

from scripts.ingest_onet import update_checksum

logger = logging.getLogger("ingest_eloundou")

BACKEND_ROOT = Path(__file__).resolve().parent.parent
PRIORS_PATH = BACKEND_ROOT / "data" / "seeds" / "exposure_priors.json"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Aggregate Eloundou exposure labels to SOC")
    parser.add_argument("--input", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    input_dir = Path(args.input)
    if not input_dir.exists():
        logger.error("Input dir %s does not exist — drop the Eloundou appendix CSV and re-run.", input_dir)
        return 1

    tasks_file = next(iter(input_dir.glob("*.csv")), None)
    if not tasks_file:
        logger.error("No CSV found in %s", input_dir)
        return 1

    logger.info("Aggregation pending — priors sourced from the paper's published tables until raw data is dropped here.")

    if not args.dry_run:
        update_checksum("eloundou-2024", tasks_file)

    return 0


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    sys.exit(main())
