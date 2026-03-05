// ✓ VALID: constructors
const dbt = new DB_ToolBox();
const xxxFoo = new C1();
this.dbt = new DB_ToolBox();        // field assignment
const obj = {};
obj.dbt = new DB_ToolBox();         // property assignment

// ✓ VALID: method calls ON controlled instance
dbt.connect();
this.dbt.query('SELECT 1');
obj.dbt.run();

// ✓ VALID: assignment flow
const dbt2 = dbt;
this.dbt2 = obj.dbt;

// ✓ VALID: passing to method with correct param name
class Service {
  process(dbt, userId) { return userId; }
}
const svc = new Service();
svc.process(dbt, 42);
svc.process(this.dbt, 42);

// ✗ INVALID: wrong variable name for constructor
const helper = new DB_ToolBox();

// ✗ INVALID: controlled flows into non-controlled
const plain = dbt;

// ✗ INVALID: using dbt in forbidden context (condition)
if (dbt) { console.log('ok'); }

// ✗ INVALID: return
function bad() { return dbt; }

// ✗ INVALID: passing dbt to method with wrong param name
class Other {
  run(conn, val) {}
}
const o = new Other();
o.run(dbt, 1);
