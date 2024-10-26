import { Pool } from 'pg';
import { SubsetConfig } from '../config/subset-config';
import { fetchRelatedDataRecursively } from './fetch-related-data-recursively';
import { CreateSubsetResult } from './types';
import { getAllTables } from '../db/get-all-tables';

export async function createSubset(
	config: SubsetConfig,
	sourceDb: Pool
): Promise<CreateSubsetResult> {
	console.log('Creating the subset...');

	const result: CreateSubsetResult = {};
	const allTables = await getAllTables(sourceDb);

	if (!allTables.length) {
		throw new Error('No tables found!');
	}

	// start traversing using the seed tables
	for (const seedTable of config.seedTables) {
		const { name } = seedTable;

		if (!allTables.includes(name)) {
			throw new Error(`Table "${name}" does not seem to exist in the database!`);
		}

		const query = `
      SELECT * FROM ${name}
      TABLESAMPLE SYSTEM (${config.percent})
    `;

		const data = await sourceDb.query(query);
		result[name] = data.rows;

		if (!data.rows.length) {
			console.log(`Skipping subsetting table "${name}" since there is no data in that table`);
			continue;
		}

		await fetchRelatedDataRecursively(name, result, data.rows, sourceDb);
	}

	// subset tables without relationships
	const standaloneTables = allTables.filter((table) => !(table in result));

	for (const table of standaloneTables) {
		const standaloneQuery = `
      SELECT * FROM ${table}
      TABLESAMPLE SYSTEM (${config.percent})
    `;

		const data = await sourceDb.query(standaloneQuery);
		result[table] = data.rows;

		await fetchRelatedDataRecursively(table, result, data.rows, sourceDb);
	}

	console.log('Done');

	return result;
}
