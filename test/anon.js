const dbt = null;

// ✓ named — разрешено
function process(dbt) { dbt.run(); }
const fn = (dbt) => dbt.run();
const fn2 = function named(dbt) { dbt.run(); }

// ✗ анонимные колбэки — запрещено
[1,2,3].forEach(function(dbt) { dbt.run(); });
[1,2,3].forEach((dbt) => dbt.run());
setTimeout(function(dbt) { dbt.run(); }, 100);
