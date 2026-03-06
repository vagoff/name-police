#!/bin/bash
REMOTE=$(git remote get-url origin 2>/dev/null \
  | sed 's|https://[^@]*@github\.com/|https://github.com/|' \
  | sed 's|\.git$||')
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
BASE="${REMOTE}/blob/${BRANCH}"
OUT="INDEX.md"

{
echo "# name-police / idealib index"
echo ""
echo "Machine-readable index of all idea units."
echo "Regenerate with \`scripts/gen-index.sh\` (runs automatically on \`git push\`)."
echo "Each link is a GitHub blob URL — fetchable by agents and LLMs."
echo ""
} > $OUT

for dir in idealib_en idealib_ru idealib_attic; do
  files=$(ls $dir/idea-*.md 2>/dev/null | sort)
  [ -z "$files" ] && continue
  echo "## $dir" >> $OUT
  echo "" >> $OUT
  for f in $files; do
    id=$(grep '^id:' $f | head -1 | sed 's/id: *//')
    tags=$(grep '^tags:' $f | head -1 | sed 's/tags: *//')
    strength=$(grep '^strength:' $f | head -1 | sed 's/strength: *//')
    echo "- [$id](${BASE}/$f) \`$strength\` $tags" >> $OUT
  done
  echo "" >> $OUT
done
