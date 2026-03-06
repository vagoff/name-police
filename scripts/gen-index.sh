#!/bin/bash
# Regenerate IDEALIB_INDEX.md — run after adding/removing idea files

REPO="https://raw.githubusercontent.com/vagoff/name-police/main"
OUT="IDEALIB_INDEX.md"

echo "# idealib index" > $OUT
echo "" >> $OUT
echo "All idea files with direct raw URLs. Fetch this file first, then fetch individual ideas." >> $OUT
echo "" >> $OUT

for dir in idealib_en idealib_ru idealib_attic; do
  echo "## $dir" >> $OUT
  for f in $(ls $dir/*.md 2>/dev/null | sort); do
    name=$(basename $f)
    echo "- [$name]($REPO/$dir/$name)" >> $OUT
  done
  echo "" >> $OUT
done
