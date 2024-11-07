import { Pool } from 'pg';
import {
	ForeignKeyConstraint,
	getForeignKeyConstraints,
} from '../../db/get-foreign-key-constraints';
import { buildDependencyGraph } from './build-dependency-graph';
import { getAllTables } from '../../db/get-all-tables';

jest.mock('../db/get-all-tables');
jest.mock('../db/get-foreign-key-constraints');

const mockDb = new Pool();

const tables = ['users', 'orders', 'order_items', 'products', 'categories'];
const foreignKeyConstraints: Record<string, ForeignKeyConstraint[]> = {
	orders: [{ column: 'user_id', relatedTable: 'users', relatedColumn: 'id' }],
	order_items: [
		{ column: 'order_id', relatedTable: 'orders', relatedColumn: 'id' },
		{ column: 'product_id', relatedTable: 'products', relatedColumn: 'id' },
	],
	products: [{ column: 'category_id', relatedTable: 'categories', relatedColumn: 'id' }],
};

(getAllTables as jest.Mock).mockResolvedValue(tables);
(getForeignKeyConstraints as jest.Mock).mockImplementation((table: string) =>
	Promise.resolve(foreignKeyConstraints[table] || [])
);

describe('buildDependencyGraph', () => {
	it('should build a correct dependency graph based on foreign key relationships', async () => {
		const expectedGraph = {
			users: ['orders'],
			orders: ['order_items'],
			order_items: [],
			products: ['order_items'],
			categories: ['products'],
		};

		const graph = await buildDependencyGraph(mockDb);

		expect(graph).toEqual(expectedGraph);
	});
});
