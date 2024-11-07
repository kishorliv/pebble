/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	rootDir: './',
	testMatch: ['<rootDir>/src/**/*.(spec|test).ts'],
	modulePaths: ['<rootDir>'],
	moduleDirectories: ['node_modules', 'src'],
};
