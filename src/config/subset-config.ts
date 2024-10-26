export interface SubsetConfig {
	schemaDumpFile: string;
	connectionString: {
		sourceDb: string;
		targetDb: string;
	};
	seedTables: SeedTable[];
	percent: number;
}

interface SeedTable {
	name: string;
}
