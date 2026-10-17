import { WheelTitleEditButton } from "@/components/wheel-title-edit-button";
import type { CustomizeState } from "@/lib/types";
import { useCustomizeUiStore } from "@/store/customize-ui-store";
import { useWheelStore } from "@/store/wheel-store";

type WheelHeaderProps = {
  customize: CustomizeState;
  showEdit?: boolean;
};

export const WheelHeader = ({
  customize,
  showEdit = true,
}: WheelHeaderProps) => {
  const title = customize.title.trim();
  const spinning = useWheelStore((s) => s.spinning);
  const openCustomize = useCustomizeUiStore((s) => s.openCustomize);

  if (!customize.showHeader || !title) return null;

  return (
    <header className="w-full min-w-0 px-1 text-center">
      <div
        className="mx-auto flex w-fit min-w-0 max-w-[90%] items-center justify-center gap-1.5 rounded-xl px-4 py-3"
        style={{
          backgroundColor: customize.titlePanelColor,
          color: customize.titleColor,
        }}
      >
        <span
          className="min-w-0 truncate text-center font-semibold"
          style={{
            fontSize: `${customize.titleFontSize}px`,
            lineHeight: 1.2,
          }}
          title={title}
        >
          {title}
        </span>
        {showEdit ? (
          <WheelTitleEditButton
            disabled={spinning}
            onClick={() => openCustomize("settings")}
          />
        ) : null}
      </div>
    </header>
  );
};
