const dbt = null;

// named function declaration
function process(dbt) { dbt.run(); }
process(dbt);

// named function expression
const fn = function process2(dbt) { dbt.run(); };
fn(dbt);

// arrow function
const arrow = (dbt) => dbt.run();
arrow(dbt);

// anonymous callback
[1,2,3].forEach(function(dbt) { dbt.run(); });

// arrow callback
[1,2,3].forEach((dbt) => dbt.run());

// ✗ passing dbt to callback where param is not dbt*
[1,2,3].forEach((item) => item.toString());
const bad = (item) => item;
bad(dbt);
