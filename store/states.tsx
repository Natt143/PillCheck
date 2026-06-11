import { create } from 'zustand';

// 1. Define the TypeScript types for your store
interface StoreState {
  time1: string;
  time2: string;
  time1Stat: string;
  time2Stat: string;
  logs: number;
  setTime1: (time: string) => void;
  setTime2: (time: string) => void;
  setTime1Stat: (status: string) => void;
  setTime2Stat: (status: string) => void;
  setLogs: (updater: number | ((current: number) => number)) => void;
  resetAll: () => void;
}

const initialState = {
  time1: "8:00 AM",
  time2: "8:00 PM",
  time1Stat: "log",
  time2Stat: "log",
  logs: 0,
};

// 2. Pass the interface <StoreState> to create()
export const useStore = create<StoreState>((set) => ({
  ...initialState,

  setTime1: (time) => set({ time1: time }),
  setTime2: (time) => set({ time2: time }),

  setTime1Stat: (status) => set({ time1Stat: status }),
  setTime2Stat: (status) => set({ time2Stat: status }),
  setLogs: (updater) => 
    set((state) => ({ 
      logs: typeof updater === 'function' ? updater(state.logs) : updater 
    })),

  resetAll: () => set(initialState),
}));