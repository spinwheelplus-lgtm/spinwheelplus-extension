import { create } from "zustand";

import {
  DEFAULT_STORE_REVIEW,
  loadStoreReview,
  saveStoreReview,
  STORE_REVIEW_LATER_MS,
  type StoreReviewPersist,
} from "@/lib/store-review";

type StoreReviewState = StoreReviewPersist & {
  ready: boolean;
  hydrate: () => Promise<void>;
  recordSuccessfulSpin: () => void;
  markRated: () => void;
  snooze: () => void;
};

let pendingSpins = 0;

const persist = (state: StoreReviewPersist): void => {
  void saveStoreReview(state);
};

const snapshot = (state: StoreReviewState): StoreReviewPersist => ({
  spinCount: state.spinCount,
  status: state.status,
  laterUntil: state.laterUntil,
});

export const useStoreReviewStore = create<StoreReviewState>((set, get) => ({
  ...DEFAULT_STORE_REVIEW,
  ready: false,
  hydrate: async () => {
    const saved = await loadStoreReview();
    const extra = pendingSpins;
    pendingSpins = 0;
    const next: StoreReviewPersist = {
      ...saved,
      spinCount: saved.spinCount + extra,
    };
    set({ ...next, ready: true });
    if (extra > 0) persist(next);
  },
  recordSuccessfulSpin: () => {
    if (!get().ready) {
      pendingSpins += 1;
      return;
    }
    if (get().status === "done") return;
    const next: StoreReviewPersist = {
      ...snapshot(get()),
      spinCount: get().spinCount + 1,
    };
    set(next);
    persist(next);
  },
  markRated: () => {
    const next: StoreReviewPersist = {
      ...snapshot(get()),
      status: "done",
      laterUntil: null,
    };
    set(next);
    persist(next);
  },
  snooze: () => {
    const next: StoreReviewPersist = {
      ...snapshot(get()),
      status: "later",
      laterUntil: Date.now() + STORE_REVIEW_LATER_MS,
    };
    set(next);
    persist(next);
  },
}));
