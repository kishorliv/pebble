import { SubsetConfig } from './config/subset-config';
import { createDbInstance } from './db/create-db-instance';
import { createSubset } from './subset/create-subset';

async function main() {
	try {
		const config: SubsetConfig = {
			connectionString: process.env.DB_URL || '',
			seedTables: [{ name: 'User' }],
			percent: 5,
		};

		const sourceDb = createDbInstance(config.connectionString);

		await createSubset(config, sourceDb);
	} catch (e) {
		console.error('Something went wrong! Error details: ', e);
	}
}

main();
