import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import { App } from "@/sidepanel/App";
import "@/sidepanel/index.css";
import { loadStorePack } from "@/lib/store-review";
import { useAppearanceStore } from "@/store/appearance-store";
import { useLocaleStore } from "@/store/locale-store";
import { useStoreReviewStore } from "@/store/store-review-store";

const ThemedToaster = () => {
  const resolved = useAppearanceStore((s) => s.resolved);
  return <Toaster theme={resolved} position="top-center" richColors closeButton />;
};

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing root element");
}

const boot = async (): Promise<void> => {
  await loadStorePack();
  await useLocaleStore.getState().hydrate();
  void useAppearanceStore.getState().hydrate();
  void useStoreReviewStore.getState().hydrate();
  createRoot(root).render(
    <StrictMode>
      <App />
      <ThemedToaster />
    </StrictMode>,
  );
};

void boot();
