import { useCallback, useEffect, useRef, useState } from "react";

import { copyTextToClipboard } from "@/lib/copy-text";

export const COPY_FEEDBACK_DURATION_MS = 2000;

export const useCopyFeedback = (durationMs = COPY_FEEDBACK_DURATION_MS) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const copyText = useCallback(
    async (text: string, key = "default"): Promise<boolean> => {
      if (!text) return false;
      const ok = await copyTextToClipboard(text);
      if (!ok) return false;
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
      }
      setCopiedKey(key);
      timerRef.current = setTimeout(() => {
        setCopiedKey(null);
        timerRef.current = null;
      }, durationMs);
      return true;
    },
    [durationMs],
  );

  const isCopied = useCallback(
    (key = "default") => copiedKey === key,
    [copiedKey],
  );

  return { copyText, isCopied };
};
