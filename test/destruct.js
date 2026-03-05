const obj = {};

// ✓ должно быть разрешено
const {dbt} = obj;

// ✓ то же самое длинной записью
const dbt2 = obj.dbt;

// ✗ переименование при деструктуризации — имя теряется
const {dbt: helper} = obj;
