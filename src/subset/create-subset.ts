import { Pool } from 'pg';
import { SubsetConfig } from '../config/subset-config';
import { fetchRelatedDataRecursively } from './fetch-related-data-recursively';
import { CreateSubsetResult } from './types';

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

	return result;
}
