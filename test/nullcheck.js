const dbt = null;

// ✓ null checks — разрешено
if (dbt) { dbt.run(); }
const x = dbt && dbt.run();
const y = dbt || null;
const z = dbt ?? null;
const w = dbt ? dbt.run() : null;

// ✗ правая часть логического — запрещено (не null-check, а утечка)
const bad1 = something && dbt;
const bad2 = something || dbt;
