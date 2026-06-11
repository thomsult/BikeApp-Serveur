import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";


export const clientPersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
  },
});
