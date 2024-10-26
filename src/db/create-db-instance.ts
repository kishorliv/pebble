import { Pool } from 'pg';

let dbInstance: Pool | undefined = undefined;

export function createDbInstance(connectionString: string): Pool {
	if (dbInstance) {
		return dbInstance;
	}

	return new Pool({
		connectionString,
	});
}
