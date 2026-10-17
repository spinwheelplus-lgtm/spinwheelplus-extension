const DB_NAME = "spinwheelplus.item-images.v1";
const STORE_NAME = "blobs";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const requestToPromise = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB request failed."));
  });

const openItemImageDb = (): Promise<IDBDatabase> => {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available."));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onclose = () => {
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => {
      dbPromise = null;
      reject(request.error ?? new Error("Could not open image storage."));
    };
  });

  return dbPromise;
};

const withStore = async <T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => Promise<T>,
): Promise<T> => {
  const db = await openItemImageDb();
  const tx = db.transaction(STORE_NAME, mode);
  const done = new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error ?? new Error("IndexedDB transaction failed."));
    tx.onabort = () =>
      reject(tx.error ?? new Error("IndexedDB transaction aborted."));
  });
  const result = await run(tx.objectStore(STORE_NAME)).catch((error: unknown) => {
    try {
      tx.abort();
    } catch {
      // Already finished or aborted.
    }
    throw error;
  });
  await done;
  return result;
};

export const idbPutItemImage = async (id: string, blob: Blob): Promise<void> => {
  await withStore("readwrite", async (store) => {
    await requestToPromise(store.put(blob, id));
  });
};

export const idbGetItemImage = async (id: string): Promise<Blob | undefined> => {
  const value = await withStore("readonly", async (store) =>
    requestToPromise(store.get(id)),
  );
  return value instanceof Blob ? value : undefined;
};

export const idbGetItemImages = async (
  ids: readonly string[],
): Promise<Map<string, Blob>> => {
  const unique = [...new Set(ids.filter((id) => id.length > 0))];
  if (unique.length === 0) return new Map();

  return withStore("readonly", async (store) => {
    const out = new Map<string, Blob>();
    await Promise.all(
      unique.map(async (id) => {
        const value = await requestToPromise(store.get(id));
        if (value instanceof Blob) out.set(id, value);
      }),
    );
    return out;
  });
};

export const idbListItemImageIds = async (): Promise<string[]> => {
  const keys = await withStore("readonly", async (store) =>
    requestToPromise(store.getAllKeys()),
  );
  return keys.map((key) => String(key));
};

export const idbDeleteItemImages = async (
  ids: readonly string[],
): Promise<void> => {
  const unique = [...new Set(ids.filter((id) => id.length > 0))];
  if (unique.length === 0) return;
  await withStore("readwrite", async (store) => {
    await Promise.all(
      unique.map((id) => requestToPromise(store.delete(id))),
    );
  });
};

export const idbClearItemImages = async (): Promise<void> => {
  await withStore("readwrite", async (store) => {
    await requestToPromise(store.clear());
  });
};
