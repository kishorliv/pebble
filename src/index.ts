import { SubsetConfig } from './config/subset-config';
import { createDbInstance } from './db/create-db-instance';
import { createSubset } from './subset/create-subset';

async function main() {
	try {
		const config: SubsetConfig = {
			connectionString: {
				sourceDb: process.env.SOURCE_DB_URL || '',
				destinationDb: process.env.DESTINATION_DB_URL || '',
			},
			seedTables: [{ name: 'User' }],
			percent: 5,
		};

		const sourceDb = createDbInstance(config.connectionString.sourceDb);

		await createSubset(config, sourceDb);
	} catch (e) {
		console.error('Something went wrong! Error details: ', e);
	}
}

main();
