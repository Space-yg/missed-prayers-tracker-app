type ArrayKeysToTypes<Obj extends object, Keys extends (keyof Obj)[]> = {
	[K in keyof Keys]: Obj[Keys[K]]
}

/**
 * Create a new IndexedDB database
 * 
 * @template StoreStructures The stores and their structure in the database
 */
export class IndexedDBDatabase<
	StoreNames extends string,
	StoreOptions extends {
		[storeName in StoreNames]: {
			autoIncrement?: boolean | undefined
			keyPath?: keyof StoreStructures[storeName] | (keyof StoreStructures[storeName])[] | null | undefined
		}
	},
	StoreStructures extends Record<StoreNames, object>,
	StoreIndicesNames extends {
		[storeName in StoreNames]?: string
	},
	StoreIndices extends {
		[storeName in StoreNames extends keyof StoreIndicesNames ? StoreNames : never]: {
			[indexName in NonNullable<StoreIndicesNames[storeName]>]: { keyPath: keyof StoreStructures[storeName] | (keyof StoreStructures[storeName])[], options?: IDBIndexParameters }
		}
	},
	DatabaseName extends string
> {
	databaseName: DatabaseName
	schema: (db: IDBDatabase) => void

	constructor(databaseName: DatabaseName, schema: (db: IDBDatabase) => void) {
		this.databaseName = databaseName
		this.schema = schema
	}

	async connect(): Promise<ConnectedIndexedDBDatabase<StoreNames, StoreOptions, StoreStructures, StoreIndicesNames, StoreIndices, DatabaseName>> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.databaseName, 1)

			request.addEventListener("upgradeneeded", event => this.schema((event.target as IDBOpenDBRequest).result))

			request.addEventListener("success", () => resolve(new ConnectedIndexedDBDatabase(this.databaseName, request.result)))

			request.addEventListener("error", () => reject(request.error))
		})
	}
}

class ConnectedIndexedDBDatabase<
	StoreNames extends string,
	StoreOptions extends {
		[storeName in StoreNames]: {
			autoIncrement?: boolean | undefined
			keyPath?: keyof StoreStructures[storeName] | (keyof StoreStructures[storeName])[] | null | undefined
		}
	},
	StoreStructures extends Record<StoreNames, object>,
	StoreIndicesNames extends {
		[storeName in StoreNames]?: string
	},
	StoreIndices extends {
		[storeName in StoreNames extends keyof StoreIndicesNames ? StoreNames : never]: {
			[indexName in NonNullable<StoreIndicesNames[storeName]>]: { keyPath: keyof StoreStructures[storeName] | (keyof StoreStructures[storeName])[], options?: IDBIndexParameters }
		}
	},
	DatabaseName extends string
> {
	databaseName: DatabaseName
	db: IDBDatabase

	constructor(databaseName: DatabaseName, db: IDBDatabase) {
		this.databaseName = databaseName
		this.db = db
	}

	async getAll<StoreName extends StoreNames>(storeName: StoreName, query?: IDBKeyRange | IDBValidKey | null | undefined, count?: number): Promise<StoreStructures[StoreName][]> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readonly")
			const store = transaction.objectStore(storeName)
			const request = store.getAll(query, count)

			request.addEventListener("success", () => resolve(request.result))

			request.addEventListener("error", () => reject(request.error))
		})
	}

	async get<StoreName extends StoreNames>(storeName: StoreName, query: IDBKeyRange | IDBValidKey): Promise<StoreStructures[StoreName]> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readonly")
			const store = transaction.objectStore(storeName)
			const request = store.get(query)

			request.addEventListener("success", () => resolve(request.result))

			request.addEventListener("error", () => reject(request.error))
		})
	}

	async filter<
		StoreName extends StoreNames extends keyof StoreIndicesNames ? StoreNames : never,
		StoreIndexName extends NonNullable<StoreIndicesNames[StoreName]>
	>(
		storeName: StoreName,
		index: StoreIndexName,
		query: StoreIndices[StoreName][StoreIndexName]["keyPath"] extends keyof StoreStructures[StoreName]
			? StoreStructures[StoreName][StoreIndices[StoreName][StoreIndexName]["keyPath"]]
			: StoreIndices[StoreName][StoreIndexName]["keyPath"] extends any[]
			? ArrayKeysToTypes<StoreStructures[StoreName], StoreIndices[StoreName][StoreIndexName]["keyPath"]>
			: never
	): Promise<StoreStructures[StoreName][]> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readonly")
			const store = transaction.objectStore(storeName)
			const idx = store.index(index)
			const request = idx.getAll(query as IDBValidKey)

			request.addEventListener("success", () => resolve(request.result))

			request.addEventListener("error", () => reject(request.error))
		})
	}

	async add<StoreName extends StoreNames>(
		storeName: StoreName,
		item: StoreOptions[StoreName]["autoIncrement"] extends true
			? StoreOptions[StoreName]["keyPath"] extends keyof StoreStructures[StoreName]
			? Omit<StoreStructures[StoreName], StoreOptions[StoreName]["keyPath"]>
			: StoreStructures[StoreName]
			: StoreStructures[StoreName]
	): Promise<
		StoreOptions[StoreName]["keyPath"] extends keyof StoreStructures[StoreName]
		? StoreStructures[StoreName][StoreOptions[StoreName]["keyPath"]]
		: StoreOptions[StoreName]["keyPath"] extends any[]
		? ArrayKeysToTypes<StoreStructures[StoreName], StoreOptions[StoreName]["keyPath"]>
		: never
	> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readwrite")
			const store = transaction.objectStore(storeName)
			const request = store.add(item)

			request.addEventListener("success", () => resolve(request.result as any))

			request.addEventListener("error", () => reject(request.error))
		})
	}

	async remove<StoreName extends StoreNames>(storeName: StoreName, query: IDBKeyRange | IDBValidKey): Promise<void> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readwrite")
			const store = transaction.objectStore(storeName)
			const request = store.delete(query)

			request.addEventListener("success", () => resolve())

			request.addEventListener("error", () => reject(request.error))
		})
	}

	async update<StoreName extends StoreNames>(storeName: StoreName, item: StoreStructures[StoreName]): Promise<IDBValidKey> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readwrite")
			const store = transaction.objectStore(storeName)
			const request = store.put(item)

			request.addEventListener("success", () => resolve(request.result))

			request.addEventListener("error", () => reject(request.error))
		})
	}
}