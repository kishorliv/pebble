import { SubsetConfig } from './config/subset-config';
import { createDbInstance } from './db/create-db-instance';
import { createSubsetFromSortedGraph } from './subset/create-subset';
import { buildDependencyGraph } from './subset/graph/build-dependency-graph';
import { topologicalSort } from './subset/sort/topological-sort';

// usage example
async function main() {
	try {
		const config: SubsetConfig = {
			schemaDumpFile: '.temp/database_schema.sql',
			connectionString: {
				sourceDb: 'postgresql://localhost:5432/dvdrental',
				targetDb: 'postgresql://localhost:5432/test_db',
			},
			percent: 5,
		};

		const sourceDb = createDbInstance(config.connectionString.sourceDb);
		const graph = await buildDependencyGraph(sourceDb);
		const sortedTables = topologicalSort(graph);

		if (!sortedTables) {
			console.error('Could not sort the graph. Exiting...');
			return;
		}

		const subset = await createSubsetFromSortedGraph(config, sortedTables, sourceDb);

		console.log({ subset });
	} catch (e) {
		console.error('Something went wrong! ', e);
	}
}

main();
