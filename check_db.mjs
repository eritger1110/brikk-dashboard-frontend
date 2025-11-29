import postgres from 'postgres';

const sql = postgres('postgresql://brikk_db_user:T45WUkIuyq2JhqjwJeMDTYTHqmuZjR5j@dpg-d3aun10dl3ps738vbalg-a.oregon-postgres.render.com/brikk_db?sslmode=require', {
  ssl: 'require',
  max: 1,
});

try {
  console.log('Connecting to Render Postgres...\n');
  
  const tables = await sql`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename
  `;
  
  console.log(`Found ${tables.length} tables:\n`);
  tables.forEach((t, i) => console.log(`${i + 1}. ${t.tablename}`));
  
  if (tables.length > 0) {
    console.log(`\nSample table structure (${tables[0].tablename}):`);
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = ${tables[0].tablename}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    columns.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type} (${c.is_nullable === 'YES' ? 'nullable' : 'not null'})`));
  }
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await sql.end();
}
