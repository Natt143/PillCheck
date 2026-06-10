import { create } from 'zustand';

interface AppState {
  pillStatus: string;
  setPillStatus: (status: string) => void;
}

export const useStore = create<AppState>((set) => ({
  pillStatus: 'No Match',
  setPillStatus: (status) => set({ pillStatus: status }),
}));

