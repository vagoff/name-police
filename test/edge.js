class DB_ToolBox {}
class C1 {}

// Case 1: a.b.dbt = 1  (controlled LHS, non-controlled RHS)
const a = {};
a.b = {};
a.b.dbt = 1;

// Case 2: o = {dbt: 2}  (controlled name as object key)
const o = { dbt: 2 };

// Case 3: method with controlled param, called with non-controlled arg
class C {
  m(dbt) { return dbt; }
}
const inst = new C();
inst.m(3);
