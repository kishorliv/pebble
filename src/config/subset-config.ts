export interface SubsetConfig {
	schemaDumpFilePath: string;
	connectionString: {
		sourceDb: string;
		destinationDb: string;
	};
	seedTables: SeedTable[];
	percent: number;
}

interface SeedTable {
	name: string;
}
