import { exec } from 'child_process';
import fs from 'fs';
import util from 'util';

const execPromise = util.promisify(exec);

export async function createTablesWithSchema(
	sourceDbUrl: string,
	targetDbUrl: string,
	dumpFilePath: string
) {
	if (fs.existsSync(dumpFilePath)) {
		console.log(
			`Dump file "${dumpFilePath}" already exists. Skipping creation of the new dump file...`
		);
	} else {
		await dumpSchema(sourceDbUrl, dumpFilePath);
	}

	await restoreSchema(targetDbUrl, dumpFilePath);
}

async function dumpSchema(sourceDbUrl: string, outputFilePath: string) {
	const command = `pg_dump --schema-only ${sourceDbUrl} > ${outputFilePath}`;

	console.log('Dumping the schema...');

	try {
		await execPromise(command);
		console.log(`Schema dumped successfully to ${outputFilePath}`);
	} catch (error) {
		console.error(`Error dumping schema: ${(error as Error).message}`);
	}
}

async function restoreSchema(targetDbUrl: string, inputFilePath: string) {
	const command = `psql ${targetDbUrl} < ${inputFilePath}`;

	console.log('Restoring the schema...');

	try {
		await execPromise(command);
		console.log(`Schema restored successfully to ${targetDbUrl}`);
	} catch (error) {
		console.error(`Error restoring schema: ${(error as Error).message}`);
	}
}
