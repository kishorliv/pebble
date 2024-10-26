import { Pool } from 'pg';

export async function getAllTables(sourceDb: Pool): Promise<string[]> {
	const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  `;

	const res = await sourceDb.query<{ table_name: string }>(query);

	return res.rows.map((row) => row.table_name);
}
