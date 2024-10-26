import { Pool } from 'pg';
import { SubsetConfig } from '../config/subset-config';
import { fetchRelatedDataRecursively } from './fetch-related-data-recursively';
import { CreateSubsetResult } from './types';
import { getAllTables } from '../db/get-all-tables';

export async function createSubset(
	config: SubsetConfig,
	sourceDb: Pool
): Promise<CreateSubsetResult> {
	const result: CreateSubsetResult = {};

	for (const seedTable of config.seedTables) {
		const { name } = seedTable;

		const query = `
      SELECT * FROM ${name}
      TABLESAMPLE SYSTEM (${config.percent} PERCENT)
    `;

		const data = await sourceDb.query(query);
		result[name] = data.rows;

		await fetchRelatedDataRecursively(name, result, data.rows, sourceDb);
	}

	const allTables = await getAllTables(sourceDb);
	const standaloneTables = allTables.filter((table) => !(table in result));

	for (const table of standaloneTables) {
		const standaloneQuery = `
      SELECT * FROM ${table}
      TABLESAMPLE SYSTEM (${config.percent} PERCENT)
    `;

		const data = await sourceDb.query(standaloneQuery);
		result[table] = data.rows;

		await fetchRelatedDataRecursively(table, result, data.rows, sourceDb);
	}

	return result;
}
