// ✓ controlled
const dbt = new DB_ToolBox();

// ✓ built-ins
const m = new Map();
const p = new Promise((res) => res());
const e = new Error('oops');

// ✓ explicitly allowed
const svc = new MyService();

// ✗ unknown
const repo = new UserRepository();
