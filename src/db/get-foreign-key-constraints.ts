import { Pool } from 'pg';

export interface ForeignKeyConstraint {
	column: string;
	relatedTable: string;
	relatedColumn: string;
}

export async function getForeignKeyConstraints(
	tableName: string,
	sourceDb: Pool
): Promise<ForeignKeyConstraint[]> {
	const query = `
  SELECT
    kcu.column_name AS "column",
    ccu.table_name AS "relatedTable",
    ccu.column_name AS "relatedColumn"
  FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1;
`;

	const result = await sourceDb.query<ForeignKeyConstraint>(query, [tableName]);

	return result.rows;
}
