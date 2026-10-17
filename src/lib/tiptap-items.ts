import type { JSONContent } from "@tiptap/core";

import { createItemId } from "@/lib/random";
import type { WheelItem } from "@/lib/types";

const paragraphText = (node: JSONContent | undefined): string => {
  if (!node?.content) return "";
  return node.content
    .map((child) => {
      if (child.type === "text") return child.text ?? "";
      return "";
    })
    .join("")
    .trim();
};

const paragraphImage = (node: JSONContent | undefined): string | undefined => {
  if (!node?.content) return undefined;
  for (const child of node.content) {
    if (child.type === "image" && typeof child.attrs?.src === "string") {
      return child.attrs.src;
    }
  }
  return undefined;
};

export const itemsFromTiptapDoc = (
  doc: JSONContent,
  previous: readonly WheelItem[] = [],
): WheelItem[] => {
  const items: WheelItem[] = [];
  let index = 0;
  for (const node of doc.content ?? []) {
    if (node.type !== "paragraph") continue;
    const label = paragraphText(node);
    const imageDataUrl = paragraphImage(node);
    const prev = previous[index];
    const keepImage =
      Boolean(imageDataUrl) && imageDataUrl === prev?.imageDataUrl;
    items.push({
      id: prev?.id || createItemId(),
      label,
      weight: prev?.weight && prev.weight > 0 ? prev.weight : 1,
      imageId: keepImage ? prev?.imageId : undefined,
      imageDataUrl: keepImage ? imageDataUrl : undefined,
      bgColor: prev?.bgColor,
      inactive: prev?.inactive,
    });
    index += 1;
  }
  return items;
};

export const tiptapDocFromItems = (items: WheelItem[]): JSONContent => ({
  type: "doc",
  content:
    items.length === 0
      ? [{ type: "paragraph" }]
      : items.map((item) => {
          const content: JSONContent[] = [];
          if (item.imageDataUrl) {
            content.push({
              type: "image",
              attrs: { src: item.imageDataUrl, alt: item.label },
            });
          }
          if (item.label) {
            content.push({ type: "text", text: item.label });
          }
          return {
            type: "paragraph",
            content: content.length > 0 ? content : undefined,
          };
        }),
});
