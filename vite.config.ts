import path from 'path'
import { defineConfig, type ResolverFunction } from 'vite'
import react from '@vitejs/plugin-react'

function inPages(path: string): string | null {
	return /(\w|\/|:| |-)+\/pages\/\w+/.exec(path)?.[0] ?? null
}

const pagesLocalImport: (path: string, hasIndex?: boolean) => ResolverFunction = (path, hasIndex = false) => (source, importer, options) => {
	// console.log("!!!!!!!!!!!!!!!!! HERE !!!!!!!!!!!!!!!!!")
	// console.log("source:", source)
	// console.log("importer:", /(\w|\/|:| |-)+\/pages\/\w+/.exec(importer!)![0])
	// console.log("Importing:", /(\w|\/|:| |-)+\/pages\/\w+/.exec(importer!)![0] + path + source + (hasIndex ? "/index.tsx" : ".tsx"))
	return /(\w|\/|:| |-)+\/pages\/[\w\-]+/.exec(importer!)![0] + path + source + (hasIndex ? "/index.tsx" : ".tsx")
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			// Global
			{ find: "@/database", replacement: path.resolve(__dirname, "./src/database.ts") },
			{ find: "@/types", replacement: path.resolve(__dirname, "./src/types.d.ts") },
			{ find: "@/utils", replacement: path.resolve(__dirname, "./src/utils.tsx") },

			// Local
			{ find: "!/components", replacement: "", customResolver: pagesLocalImport("/components", true) },
			{ find: "!/contexts", replacement: "", customResolver: pagesLocalImport("/contexts") },
		]
	},
	base: "/missed-prayers-tracker-app"
})
