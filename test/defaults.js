// ✓ null/undefined — разрешено
function f(dbt = null) { return dbt; }
function g(dbt = undefined) { return dbt; }
class Service {
  process(dbt = null, userId) { return userId; }
}

// ✗ примитив — запрещено
function bad(dbt = 5) {}
