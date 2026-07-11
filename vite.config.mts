/// <reference types="vitest" />

import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		reporters: ['minimal', 'github-actions'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.mts'],
			reporter: ['text','lcovonly'],
			exclude: ['src/result/safeResult.mts', 'src/result/safeAsyncResult.mts'],
		},
		include: ['test/**/*.test.mts', 'test/**/*.test.ts'],
		typecheck: {
			include: ['**/*.test-d.mts'],
		},
	},
});
