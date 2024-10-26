import { SubsetConfig } from './config/subset-config';
import { createDbInstance } from './db/create-db-instance';
import { createTablesWithSchema } from './db/create-tables-with-schema';
import { createSubset } from './subset/create-subset';

// usage example
async function main() {
	try {
		const config: SubsetConfig = {
			schemaDumpFile: '.temp/database_schema.sql',
			connectionString: {
				sourceDb: 'postgresql://localhost:5432/dvdrental',
				targetDb: 'postgresql://localhost:5432/test_db',
			},
			seedTables: [{ name: 'actor' }],
			percent: 5,
		};

		const sourceDb = createDbInstance(config.connectionString.sourceDb);

		await createTablesWithSchema(
			config.connectionString.sourceDb,
			config.connectionString.targetDb,
			config.schemaDumpFile
		);

		const subset = await createSubset(config, sourceDb);

		console.log({ subset });
	} catch (e) {
		console.error('Something went wrong! ', e);
	}
}

main();
