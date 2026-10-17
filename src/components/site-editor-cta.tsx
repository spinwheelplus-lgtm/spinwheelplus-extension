import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/cn";
import { SITE_URL } from "@/lib/constants";
import { useLocaleStore } from "@/store/locale-store";

type SiteEditorCtaProps = {
  className?: string;
  href?: string;
  label?: string;
  title?: string;
  note?: string;
};

export const SiteEditorCta = ({
  className,
  href = SITE_URL,
  label,
  title,
  note,
}: SiteEditorCtaProps) => {
  const messages = useLocaleStore((s) => s.messages);
  const resolvedLabel = label ?? messages.openEditor;
  const resolvedTitle = title ?? resolvedLabel;
  const resolvedNote = note ?? messages.openEditorNote;
  return (
  <div className={cn("mx-3 mt-3", className)}>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
      title={resolvedTitle}
    >
      <ExternalLink className="size-5 shrink-0" aria-hidden />
      {resolvedLabel}
    </a>
    <p className="mt-2 text-center text-sm text-muted-foreground">{resolvedNote}</p>
  </div>
  );
};
