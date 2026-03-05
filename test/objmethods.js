const dbt = null;

const o = {
  m1(dbt) { dbt.run(); },
  m2(x) { return x; }
};

// ✓ правильный вызов
o.m1(dbt);

// ✗ неправильный
o.m1(42);
o.m2(dbt);
