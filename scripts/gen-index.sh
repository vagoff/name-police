#!/bin/bash
# Run from repo root to regenerate INDEX.md
OUT="INDEX.md"

echo "# name-police / idealib index" > $OUT
echo "" >> $OUT
echo "Machine-readable index of all idea units. Regenerate with \`scripts/gen-index.sh\`." >> $OUT
echo "" >> $OUT

for dir in idealib_en idealib_ru idealib_attic; do
  echo "## $dir" >> $OUT
  echo "" >> $OUT
  for f in $(ls $dir/idea-*.md 2>/dev/null | sort); do
    id=$(grep '^id:' $f | head -1 | sed 's/id: *//')
    tags=$(grep '^tags:' $f | head -1 | sed 's/tags: *//')
    strength=$(grep '^strength:' $f | head -1 | sed 's/strength: *//')
    echo "- [$id]($f) \`$strength\` $tags" >> $OUT
  done
  echo "" >> $OUT
done