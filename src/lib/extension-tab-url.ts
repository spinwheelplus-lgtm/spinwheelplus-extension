/** This extension's side panel as a normal tab. Dev falls back to the local page. */
export const extensionTabUrl = (): string => {
  const runtime = typeof chrome !== "undefined" ? chrome.runtime : undefined;
  if (typeof runtime?.getURL === "function") {
    return `${runtime.getURL("sidepanel.html")}#/`;
  }
  const url = new URL("sidepanel.html", window.location.href);
  url.hash = "/";
  return url.href;
};

export const openExternalUrl = (url: string): void => {
  window.open(url, "_blank", "noopener,noreferrer");
};
