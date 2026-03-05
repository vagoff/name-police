const dbt = null;

// ✓ shorthand — имя сохраняется
function f() { return {dbt}; }

// ✗ non-shorthand — имя теряется
function g() { return {foo: dbt}; }

// ✗ в массиве
const arr = [dbt];
