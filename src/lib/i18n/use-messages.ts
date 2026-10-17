import { useLocaleStore } from "@/store/locale-store";

export const useMessages = () => useLocaleStore((state) => state.messages);

/** For stores and helpers that are not React components. */
export const readMessages = () => useLocaleStore.getState().messages;
