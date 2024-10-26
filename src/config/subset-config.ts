export interface SubsetConfig {
	connectionString: string;
	seedTables: SeedTable[];
	percent: number;
}

interface SeedTable {
	name: string;
}
