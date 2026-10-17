import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  PaintRoller,
  Palette,
  Plus,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";

import { themePreviewBackground } from "@/components/customize/customize-fields";
import { EntriesItemImageControl } from "@/components/entries-item-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { ITEM_IMAGE_MAX_COUNT, MAX_WHEEL_ITEMS } from "@/lib/constants";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { assignItemImageFromFile } from "@/lib/item-image-append";
import { remainingItemImageSlots } from "@/lib/item-image-session";
import {
  contrastOnColor,
  hasCustomItemColor,
  resolveItemSliceColor,
  themeItemColorPreviewPalette,
} from "@/lib/item-color";
import { createItemId } from "@/lib/random";
import type { WheelItem } from "@/lib/types";
import { hasWheelSliceContent } from "@/lib/visual-items";
import { useWheelStore } from "@/store/wheel-store";

const NAME_DEBOUNCE_MS = 200;

const itemWeight = (item: WheelItem): number =>
  item.weight > 0 ? item.weight : 1;

type NameInputProps = {
  itemId: string;
  name: string;
  disabled?: boolean;
  onCommit: (itemId: string, name: string) => void;
};

const NameInput = ({ itemId, name, disabled, onCommit }: NameInputProps) => {
  const itemName = useMessages().ui.entries.itemName;
  const [draft, setDraft] = useState(name);
  const draftRef = useRef(name);
  const timerRef = useRef<number | null>(null);
  draftRef.current = draft;

  useEffect(() => {
    setDraft(name);
  }, [name]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
        onCommit(itemId, draftRef.current);
      }
    },
    [itemId, onCommit],
  );

  const handleChange = (value: string) => {
    setDraft(value);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onCommit(itemId, value);
    }, NAME_DEBOUNCE_MS);
  };

  return (
    <Input
      value={draft}
      disabled={disabled}
      aria-label={itemName}
      placeholder={itemName}
      title={itemName}
      className="h-10 rounded-xl px-3"
      onChange={(event) => handleChange(event.currentTarget.value)}
    />
  );
};

type ColorInputProps = {
  item: WheelItem;
  index: number;
  themeColors: readonly string[];
  disabled?: boolean;
  onCommit: (itemId: string, bgColor: string | undefined) => void;
};

const ColorInput = ({
  item,
  index,
  themeColors,
  disabled,
  onCommit,
}: ColorInputProps) => {
  const entriesUi = useMessages().ui.entries;
  const useThemeColor = entriesUi.useThemeColor;
  const committed = resolveItemSliceColor(item.bgColor, index, themeColors);
  const [draft, setDraft] = useState(committed);
  const timerRef = useRef<number | null>(null);
  const custom = hasCustomItemColor(item.bgColor);
  const ColorIcon = custom ? PaintRoller : Palette;
  const iconColor = custom ? contrastOnColor(draft) : "#ffffff";
  const swatchStyle = custom
    ? { backgroundColor: draft, color: iconColor }
    : {
        background: themePreviewBackground(
          themeItemColorPreviewPalette(themeColors, draft),
        ),
        color: iconColor,
      };

  useEffect(() => {
    setDraft(resolveItemSliceColor(item.bgColor, index, themeColors));
  }, [item.bgColor, index, themeColors]);

  const handleChange = (value: string) => {
    setDraft(value);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onCommit(item.id, value);
    }, NAME_DEBOUNCE_MS);
  };

  return (
    <div className="relative size-10 shrink-0 overflow-visible">
      <label
        className={cn(
          "relative inline-flex size-10 items-center justify-center overflow-hidden rounded-xl border border-border shadow-sm",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        )}
        style={swatchStyle}
        title={custom ? entriesUi.customColor : entriesUi.themeColor}
      >
        <ColorIcon
          className={cn("size-4", !custom && "drop-shadow")}
          aria-hidden
        />
        <span className="sr-only">
          {custom ? entriesUi.customColor : entriesUi.themeColor}
        </span>
        <input
          type="color"
          value={draft}
          disabled={disabled}
          aria-label={custom ? entriesUi.customColor : entriesUi.themeColor}
          title={custom ? entriesUi.customColor : entriesUi.themeColor}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(event) => handleChange(event.currentTarget.value)}
        />
      </label>
      {custom ? (
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          aria-label={useThemeColor}
          title={useThemeColor}
          className="absolute -top-2 -right-2 z-10 rounded-full border border-background bg-destructive p-0 text-white shadow-sm hover:bg-destructive/90 hover:text-white"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (timerRef.current) {
              window.clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            onCommit(item.id, undefined);
          }}
        >
          <X strokeWidth={2.5} />
        </Button>
      ) : null}
    </div>
  );
};

export const EntriesAdvancedList = () => {
  const entries = useMessages().ui.entries;
  const items = useWheelStore((s) => s.items);
  const setItems = useWheelStore((s) => s.setItems);
  const spinning = useWheelStore((s) => s.spinning);
  const themeColors = useWheelStore((s) => s.customize.themeColors);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const quickEntryRef = useRef<HTMLInputElement>(null);
  const pendingScrollToEndRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingImageItemIdRef = useRef<string | null>(null);
  const [quickEntryName, setQuickEntryName] = useState("");
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const activeWeightTotal =
    items.reduce((total, item) => {
      if (item.inactive || !hasWheelSliceContent(item)) return total;
      return total + itemWeight(item);
    }, 0) || 1;

  const patchItem = useCallback(
    (itemId: string, patch: Partial<WheelItem>) => {
      setItems(
        itemsRef.current.map((item) =>
          item.id === itemId ? { ...item, ...patch } : item,
        ),
      );
    },
    [setItems],
  );

  const moveItem = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const current = next[index];
    const swapped = next[target];
    if (!current || !swapped) return;
    next[index] = swapped;
    next[target] = current;
    setItems(next);
  };

  const duplicateItem = (index: number) => {
    const source = items[index];
    if (!source) return;
    if (items.length >= MAX_WHEEL_ITEMS) {
      toast.error(fillTemplate(entries.keepEntries, { max: MAX_WHEEL_ITEMS }));
      return;
    }
    if (source.imageId && remainingItemImageSlots(items) <= 0) {
      toast.warning(
        `This wheel already has ${ITEM_IMAGE_MAX_COUNT} images. Remove one before adding another.`,
      );
      return;
    }
    const next = [...items];
    next.splice(index + 1, 0, {
      ...source,
      id: createItemId(),
      label: source.label.trim() ? `${source.label} copy` : "",
    });
    setItems(next);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  useLayoutEffect(() => {
    if (!pendingScrollToEndRef.current) return;
    pendingScrollToEndRef.current = false;
    const list = listScrollRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "instant" });
  }, [items]);

  const atEntryCap = items.length >= MAX_WHEEL_ITEMS;

  const submitQuickEntry = (): void => {
    const name = (quickEntryRef.current?.value ?? quickEntryName).trim();
    if (name.length === 0 || itemsRef.current.length >= MAX_WHEEL_ITEMS) {
      quickEntryRef.current?.focus({ preventScroll: true });
      return;
    }
    pendingScrollToEndRef.current = true;
    setItems([
      ...itemsRef.current,
      { id: createItemId(), label: name, weight: 1 },
    ]);
    setQuickEntryName("");
    quickEntryRef.current?.focus({ preventScroll: true });
  };

  const openImagePicker = (itemId: string): void => {
    const item = itemsRef.current.find((row) => row.id === itemId);
    if (!item || spinning) return;
    if (!item.imageId && remainingItemImageSlots(itemsRef.current) <= 0) {
      toast.warning(
        `This wheel already has ${ITEM_IMAGE_MAX_COUNT} images. Remove one before adding another.`,
      );
      return;
    }
    pendingImageItemIdRef.current = itemId;
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.currentTarget.files?.[0];
    const itemId = pendingImageItemIdRef.current;
    event.currentTarget.value = "";
    pendingImageItemIdRef.current = null;
    if (!file || !itemId) return;

    const item = itemsRef.current.find((row) => row.id === itemId);
    if (!item) return;
    if (!item.imageId && remainingItemImageSlots(itemsRef.current) <= 0) {
      toast.warning(
        `This wheel already has ${ITEM_IMAGE_MAX_COUNT} images. Remove one before adding another.`,
      );
      return;
    }

    setUploadingItemId(itemId);
    try {
      const next = await assignItemImageFromFile(itemsRef.current, itemId, file);
      setItems(next);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : entries.couldNotProcessImage,
      );
    } finally {
      setUploadingItemId(null);
    }
  };

  const removeItemImage = (itemId: string): void => {
    patchItem(itemId, { imageId: undefined, imageDataUrl: undefined });
  };

  const activeSliceCount = items.filter(
    (item) => !item.inactive && hasWheelSliceContent(item),
  ).length;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        spinning && "pointer-events-none",
      )}
      aria-disabled={spinning}
    >
    <div
      ref={listScrollRef}
      className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5"
    >
      <input
        ref={fileInputRef}
        id="entries-advanced-item-image"
        name="entries-advanced-item-image"
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          void handleImageFileChange(event);
        }}
      />
      {items.length === 0 ? (
        <div className="flex min-h-16 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-4 text-center text-sm text-muted-foreground">
          No entries yet. Type a name below.
        </div>
      ) : null}
      {items.map((item, index) => {
        const weight = itemWeight(item);
        const percent =
          item.inactive || !hasWheelSliceContent(item)
            ? 0
            : activeSliceCount === 1
              ? 100
              : Math.round((weight / activeWeightTotal) * 100);

        return (
          <article
            key={item.id}
            className={cn(
              "flex gap-2 rounded-xl border border-border bg-muted/70 p-2",
              item.inactive && "opacity-60",
            )}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <Button
                variant="outline"
                size="icon-xs"
                disabled={spinning || index === 0}
                aria-label={fillTemplate(entries.moveNameUp, {
                  name: item.label || entries.itemFallback,
                })}
                title={entries.moveUp}
                onClick={() => moveItem(index, -1)}
              >
                <ArrowUp />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                disabled={spinning || index >= items.length - 1}
                aria-label={fillTemplate(entries.moveNameDown, {
                  name: item.label || entries.itemFallback,
                })}
                title={entries.moveDown}
                onClick={() => moveItem(index, 1)}
              >
                <ArrowDown />
              </Button>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <NameInput
                itemId={item.id}
                name={item.label}
                disabled={spinning}
                onCommit={(itemId, name) => patchItem(itemId, { label: name })}
              />
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <ColorInput
                  item={item}
                  index={index}
                  themeColors={themeColors}
                  disabled={spinning}
                  onCommit={(itemId, bgColor) => patchItem(itemId, { bgColor })}
                />
                <EntriesItemImageControl
                  item={item}
                  isUploading={uploadingItemId === item.id}
                  disabled={spinning}
                  onPickClick={() => openImagePicker(item.id)}
                  onRemove={() => removeItemImage(item.id)}
                />
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={weight}
                  disabled={spinning}
                  aria-label={entries.itemWeight}
                  title={entries.itemWeight}
                  className="h-10 w-16 rounded-xl text-center"
                  onChange={(event) =>
                    patchItem(item.id, {
                      weight: Math.max(1, Number(event.currentTarget.value) || 1),
                    })
                  }
                />
                <span className="min-w-10 text-center text-sm text-muted-foreground">
                  {percent}%
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={spinning}
                aria-label={fillTemplate(entries.duplicateName, {
                  name: item.label || entries.itemFallback,
                })}
                title={entries.duplicate}
                onClick={() => duplicateItem(index)}
              >
                <Copy className="size-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon-xs"
                disabled={spinning}
                aria-label={fillTemplate(entries.removeName, {
                  name: item.label || entries.itemFallback,
                })}
                title={entries.remove}
                onClick={() => removeItem(item.id)}
              >
                <X className="size-4" />
              </Button>
              <Button
                variant={item.inactive ? "outline" : "default"}
                size="icon-xs"
                disabled={spinning}
                aria-pressed={!item.inactive}
                aria-label={item.inactive ? entries.enableItem : entries.disableItem}
                title={item.inactive ? entries.enableItem : entries.disableItem}
                onClick={() => {
                  patchItem(item.id, {
                    inactive: item.inactive ? undefined : true,
                  });
                }}
              >
                <Check />
              </Button>
            </div>
          </article>
        );
      })}

    </div>
    <form
      className="flex shrink-0 items-center gap-2 border-t border-border px-2 pt-3 pb-2"
      onSubmit={(event) => {
        event.preventDefault();
        submitQuickEntry();
      }}
    >
      <Input
        ref={quickEntryRef}
        value={quickEntryName}
        aria-label={entries.newEntryName}
        autoComplete="off"
        className="h-12 min-w-0 flex-1 rounded-xl bg-background px-4 text-base"
        disabled={spinning || atEntryCap}
        enterKeyHint="enter"
        name="wheel-quick-entry"
        placeholder={entries.typeName}
        title={
          atEntryCap ? fillTemplate(entries.keepEntries, { max: MAX_WHEEL_ITEMS }) : entries.typeNameEnter
        }
        onChange={(event) => setQuickEntryName(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.nativeEvent.isComposing) {
            event.preventDefault();
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="h-12 shrink-0 gap-2 rounded-xl px-4 text-emerald-600 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300"
        aria-label={entries.addEntry}
        disabled={spinning || atEntryCap}
        title={atEntryCap ? fillTemplate(entries.keepEntries, { max: MAX_WHEEL_ITEMS }) : entries.addEntry}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={submitQuickEntry}
      >
        <Plus className="size-4 shrink-0" aria-hidden />
        {entries.add}
      </Button>
    </form>
    </div>
  );
};
