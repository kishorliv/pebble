export interface SubsetConfig {
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
