import postgres from 'postgres';

const sql = postgres('postgresql://brikk_db_user:T45WUkIuyq2JhqjwJeMDTYTHqmuZjR5j@dpg-d3aun10dl3ps738vbalg-a.oregon-postgres.render.com/brikk_db?sslmode=require', {
  ssl: 'require',
  max: 1,
});

const keyTables = ['users', 'organizations', 'agents', 'workflows', 'marketplace_agents', 'api_keys', 'audit_logs', 'security_events'];

try {
  for (const table of keyTables) {
    console.log(`\n=== ${table.toUpperCase()} ===`);
    const columns = await sql`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = ${table}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    columns.forEach(c => {
      const type = c.character_maximum_length ? `${c.data_type}(${c.character_maximum_length})` : c.data_type;
      const nullable = c.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const def = c.column_default ? ` DEFAULT ${c.column_default}` : '';
      console.log(`  ${c.column_name}: ${type} ${nullable}${def}`);
    });
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await sql.end();
}
