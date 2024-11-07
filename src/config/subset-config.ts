export interface SubsetConfig {
	schemaDumpFile: string;
	connectionString: {
		sourceDb: string;
		targetDb: string;
	};
	percent: number;
}

interface SeedTable {
	name: string;
}
