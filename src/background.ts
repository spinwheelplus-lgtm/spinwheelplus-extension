type SidebarActionApi = {
  toggle: () => Promise<void> | void;
};

type ExtensionApi = typeof chrome & {
  sidebarAction?: SidebarActionApi;
};

const ext = chrome as ExtensionApi;

const applyChromeSidePanel = (): void => {
  void ext.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
};

if (typeof ext.sidePanel?.setPanelBehavior === "function") {
  ext.runtime.onInstalled.addListener(applyChromeSidePanel);
  applyChromeSidePanel();
} else if (ext.sidebarAction && ext.action?.onClicked) {
  ext.action.onClicked.addListener(() => {
    void ext.sidebarAction?.toggle();
  });
}
