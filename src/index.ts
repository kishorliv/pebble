import { SubsetConfig } from './config/subset-config';
import { createDbInstance } from './db/create-db-instance';
import { createTablesWithSchema } from './db/create-tables-with-schema';
import { createSubset } from './subset/create-subset';
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
			seedTables: [{ name: 'actor' }],
			percent: 5,
		};

		const sourceDb = createDbInstance(config.connectionString.sourceDb);

		const graph = await buildDependencyGraph(sourceDb);

		const sortedGraph = topologicalSort(graph);
		console.log('Topological Sort:', sortedGraph);

		// const subset = await createSubset(config, sourceDb);

		// console.log({ subset });
	} catch (e) {
		console.error('Something went wrong! ', e);
	}
}

main();
