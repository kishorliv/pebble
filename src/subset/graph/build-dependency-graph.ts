import { Pool } from 'pg';
import { getAllTables } from '../../db/get-all-tables';
import { getForeignKeyConstraints } from '../../db/get-foreign-key-constraints';

export type Graph = Record<string, string[]>;

export async function buildDependencyGraph(sourceDb: Pool): Promise<Graph> {
	const graph: Record<string, string[]> = {};

	const tables = await getAllTables(sourceDb);

	// init
	for (const table of tables) {
		graph[table] = [];
	}

	for (const table of tables) {
		const foreignKeys = await getForeignKeyConstraints(table, sourceDb);

		for (const fk of foreignKeys) {
			graph[table].push(fk.relatedTable); // child -> parent
		}
	}

	return graph;
}
