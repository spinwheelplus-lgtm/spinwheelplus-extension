const STORAGE_KEY = "spinwheelplus.store-review.v1";

export const STORE_REVIEW_SPIN_GOAL = 5;
export const STORE_REVIEW_LATER_MS = 30 * 24 * 60 * 60 * 1000;

const REVIEW_URL_BY_PACK = {
  chrome:
    "https://chromewebstore.google.com/detail/spinwheelplus/dhenelblilfpogangiapipnoipojplgi/reviews",
  edge: "https://microsoftedge.microsoft.com/addons/detail/spinwheelplus/ejgmajnbanlenfeeaoncnjmafkcopojf",
  firefox: "https://addons.mozilla.org/en-US/firefox/addon/spinwheelplus/reviews/",
} as const;

type StorePack = keyof typeof REVIEW_URL_BY_PACK;

let storePack: StorePack = "chrome";

const isStorePack = (value: unknown): value is StorePack =>
  value === "chrome" || value === "edge" || value === "firefox";

export type StoreReviewStatus = "pending" | "later" | "done";

export type StoreReviewPersist = {
  spinCount: number;
  status: StoreReviewStatus;
  laterUntil: number | null;
};

export const DEFAULT_STORE_REVIEW: StoreReviewPersist = {
  spinCount: 0,
  status: "pending",
  laterUntil: null,
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

/** Reads `store-pack.json`. Pack rewrites that file inside the Edge and Firefox zips. */
export const loadStorePack = async (): Promise<void> => {
  try {
    const url = new URL("store-pack.json", window.location.href);
    const response = await fetch(url);
    if (!response.ok) return;
    const body = (await response.json()) as { pack?: unknown };
    if (isStorePack(body.pack)) storePack = body.pack;
  } catch {
    storePack = "chrome";
  }
};

export const storeReviewUrl = (): string => REVIEW_URL_BY_PACK[storePack];

export const openStoreReview = (): void => {
  window.open(storeReviewUrl(), "_blank", "noopener,noreferrer");
};

const parseStoreReview = (raw: unknown): StoreReviewPersist => {
  if (!raw || typeof raw !== "object") return DEFAULT_STORE_REVIEW;
  const row = raw as Partial<StoreReviewPersist>;
  const spinCount =
    typeof row.spinCount === "number" && Number.isFinite(row.spinCount)
      ? Math.max(0, Math.floor(row.spinCount))
      : 0;
  const status: StoreReviewStatus =
    row.status === "later" || row.status === "done" ? row.status : "pending";
  const laterUntil =
    typeof row.laterUntil === "number" && Number.isFinite(row.laterUntil)
      ? row.laterUntil
      : null;
  return { spinCount, status, laterUntil };
};

export const loadStoreReview = async (): Promise<StoreReviewPersist> => {
  try {
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return parseStoreReview(result[STORAGE_KEY]);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return parseStoreReview(raw ? JSON.parse(raw) : null);
  } catch {
    return DEFAULT_STORE_REVIEW;
  }
};

export const saveStoreReview = async (state: StoreReviewPersist): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [STORAGE_KEY]: state });
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode: keep working in memory.
  }
};

export const storeReviewIsDue = (
  state: StoreReviewPersist,
  now = Date.now(),
): boolean => {
  if (state.status === "done" || state.spinCount < STORE_REVIEW_SPIN_GOAL) {
    return false;
  }
  if (state.status === "later" && state.laterUntil != null && now < state.laterUntil) {
    return false;
  }
  return true;
};
