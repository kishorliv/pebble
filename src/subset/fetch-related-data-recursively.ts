import { Pool } from 'pg';
import { getForeignKeyConstraints } from '../db/get-foreign-key-constraints';
import { CreateSubsetResult } from './types';

export async function fetchRelatedDataRecursively(
	tableName: string,
	result: CreateSubsetResult,
	rows: any[],
	sourceDb: Pool
): Promise<void> {
	const foreignKeys = await getForeignKeyConstraints(tableName, sourceDb);

	for (const fk of foreignKeys) {
		const { column, relatedTable, relatedColumn } = fk;
		const relatedIds = rows.map((row) => row[column]).filter((id) => id);

		if (relatedIds.length === 0) {
			continue;
		}

		const query = `
      SELECT * FROM ${relatedTable}
      WHERE ${relatedColumn} = ANY($1)
    `;

		const relatedTableData = await sourceDb.query(query, [relatedIds]);

		result[relatedTable] = relatedTableData.rows;

		await fetchRelatedDataRecursively(relatedTable, result, relatedTableData.rows, sourceDb);
	}
}
