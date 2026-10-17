import { SITE_URL } from "@/lib/constants";
import { useLocaleStore } from "@/store/locale-store";

export const BrandMark = () => {
  const messages = useLocaleStore((s) => s.messages);
  return (
  <a
    href={SITE_URL}
    target="_blank"
    rel="noreferrer"
    className="mx-3 mt-4 flex items-center justify-center gap-2 text-foreground no-underline"
    title={messages.openBrand}
  >
    <img
      src="./img/logo64.png"
      alt=""
      width={32}
      height={32}
      className="size-8"
    />
    <span className="text-sm font-semibold">SpinWheelPlus</span>
  </a>
  );
};
