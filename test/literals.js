const db = {};

// ✓
db.setMode("read");
db.setMode("write");
db.connect("host", "tcp");

// ✗ wrong value
db.setMode("superuser");

// ✗ not a literal
const m = getMode();
db.setMode(m);

// ✗ template with expression
const mode = "read";
db.setMode(`${mode}`);

// ✓ template without expression
db.setMode(`write`);
