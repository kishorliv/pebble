import { exec } from 'child_process';
import fs from 'fs';

export async function createTablesWithSchema(sourceDbUrl: string, dumpFilePath: string) {
	if (fs.existsSync(dumpFilePath)) {
		console.log(
			`Dump file "${dumpFilePath}" already exists. Skipping creation of the new dump file...`
		);
	} else {
		await dumpSchema(sourceDbUrl, dumpFilePath);
	}

	await restoreSchema(sourceDbUrl, dumpFilePath);
}

async function dumpSchema(sourceDbUrl: string, outputFilePath: string) {
	const command = `pg_dump --schema-only ${sourceDbUrl} > ${outputFilePath}`;

	console.log('Dumping the schema...');

	exec(command, (error, _stdout, stderr) => {
		if (error) {
			console.error(`Error dumping schema: ${error.message}`);
			return;
		}

		if (stderr) {
			console.error(`Error: ${stderr}`);
			return;
		}

		console.log(`Schema dumped successfully to ${outputFilePath}`);
	});
}

async function restoreSchema(targetDbUrl: string, inputFilePath: string) {
	const command = `psql ${targetDbUrl} < ${inputFilePath}`;

	console.log('Restoring the schema...');

	exec(command, (error, _stdout, stderr) => {
		if (error) {
			console.error(`Error restoring schema: ${error.message}`);
			return;
		}

		if (stderr) {
			console.error(`Error: ${stderr}`);
			return;
		}

		console.log(`Schema restored successfully to ${targetDbUrl}`);
	});
}
