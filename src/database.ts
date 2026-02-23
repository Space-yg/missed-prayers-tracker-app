import { IndexedDBDatabase } from "./IDB"

import type { Wird, PrayedPrayer } from "./types"

const DATABASE_NAME = "database"
const DATABASE_SCHEMA = (db: IDBDatabase) => {
	// This store will keep track of each wird of prayers the person wants to pray
	if (!db.objectStoreNames.contains("wirds")) {
		// Store
		const store = db.createObjectStore("wirds", { keyPath: "id", autoIncrement: true })
	}

	// This store will keep track of each record of prayers prayed
	if (!db.objectStoreNames.contains("prayed-prayers")) {
		// Store
		const store = db.createObjectStore("prayed-prayers", { keyPath: "id", autoIncrement: true })

		// Indices
		store.createIndex("wirdId", "wirdId", { unique: false })
	}
}

const IDB = new IndexedDBDatabase<
	// Store names
	"wirds" | "prayed-prayers",

	// Store options
	{
		"wirds": { keyPath: "id", autoIncrement: true }
		"prayed-prayers": { keyPath: "id", autoIncrement: true }
	},

	// Store structures
	{
		"wirds": Wird
		"prayed-prayers": PrayedPrayer
	},

	// Store indices names
	{
		"prayed-prayers": "wirdId"
	},

	// Store indices
	{
		"prayed-prayers": {
			"wirdId": { keyPath: "wirdId", options: { unique: false } }
		}
	},

	// Database name
	"database"
>(DATABASE_NAME, DATABASE_SCHEMA)
const dbConnected = IDB.connect()

export default dbConnected