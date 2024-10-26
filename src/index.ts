import { SubsetConfig } from './config/subset-config';
import { createDbInstance } from './db/create-db-instance';
import { createSubset } from './subset/create-subset';

// usage example
async function main() {
	try {
		const config: SubsetConfig = {
			connectionString: {
				sourceDb: 'postgresql://localhost:5432/dvdrental',
				destinationDb: 'postgresql://localhost:5432/test_db',
			},
			seedTables: [{ name: 'actor' }],
			percent: 5,
		};

		const sourceDb = createDbInstance(config.connectionString.sourceDb);

		console.log('Creating the subset...');

		const subset = await createSubset(config, sourceDb);

		console.log({ subset });
		console.log('Done');
	} catch (e) {
		console.error('Something went wrong! ', e);
	}
}

main();
