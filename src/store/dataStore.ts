import { DataStore } from '@/Types';
import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export type DataState = {
  // DATA
  dataStore: DataStore;
  system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL';

  // DATA SETTERS
  setDataStore: (dataInfo: DataStore) => void;
  setSystem: (system: DataStore) => void;
}

const useDataStore = create<DataState>()(
  // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
  subscribeWithSelector(
    // devtools middleware allows use of Redux devtool in chrome
    devtools(
      // store function - 'get' parameter is basically a `this` alias when invoked
      (set, get) => ({
        dataStore: {},
        system: 'PostgreSQL',
        setSystem: (system) => set((state) => ({ ...state, system })),
        setDataStore: (dataInfo) => set((state) => ({ ...state, dataStore: dataInfo })),
      })
    )
  )
);

export default useDataStore;
