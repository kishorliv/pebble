export interface SubsetConfig {
	schemaDumpFile: string;
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
